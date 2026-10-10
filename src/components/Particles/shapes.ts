export type Rand = () => number;

/** Deterministic, so every visit builds the same shapes */
export function mulberry32(seed: number): Rand {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export interface Shape {
  /** xyz per particle, in units where the shape spans roughly -1..1 */
  pos: Float32Array;
  /** group and weight per particle: the group picks a shader animation, the weight scales size and alpha */
  meta: Float32Array;
}

/** Animated parts, matched by number in the vertex shader */
export const GROUP = {
  none: 0,
  dot1: 1,
  dot2: 2,
  dot3: 3,
  sparkle: 4,
  bridge: 5,
  cloud: 6,
  up: 7,
  down: 8,
} as const;

/** Faint particles that make the air around a shape */
const DUST = 0.1;

type Vec2 = [number, number];
type Vec3 = [number, number, number];
type Transform = (x: number, y: number, z: number) => Vec3;

const identity: Transform = (x, y, z) => [x, y, z];

/** Turns about the vertical axis, then moves: how the devices and the card are posed */
const pose = (yaw: number, tx: number, ty: number, tz: number): Transform => {
  const c = Math.cos(yaw);
  const s = Math.sin(yaw);
  return (x, y, z) => [x * c + z * s + tx, y + ty, -x * s + z * c + tz];
};

/** The stack is seen from a little above and turned. Must match tilt() in shaders.ts */
export const TILT = { pitch: 0.5, yaw: 0.65 };
const tilt: Transform = (x, y, z) => {
  const cp = Math.cos(TILT.pitch);
  const sp = Math.sin(TILT.pitch);
  const y1 = y * cp - z * sp;
  const z1 = y * sp + z * cp;
  const cy = Math.cos(TILT.yaw);
  const sy = Math.sin(TILT.yaw);
  return [x * cy + z1 * sy, y1, -x * sy + z1 * cy];
};

class Builder {
  readonly pos: Float32Array;
  readonly meta: Float32Array;
  transform: Transform = identity;
  private i = 0;

  constructor(readonly n: number, readonly rand: Rand) {
    this.pos = new Float32Array(n * 3);
    this.meta = new Float32Array(n * 2);
  }

  get left() {
    return this.n - this.i;
  }

  /** A share of the whole budget, never more than what is left */
  share(fraction: number) {
    return Math.min(this.left, Math.round(this.n * fraction));
  }

  push(x: number, y: number, z: number, group: number, weight: number) {
    if (this.i >= this.n) return;
    const [tx, ty, tz] = this.transform(x, y, z);
    const k = this.i++;
    this.pos[k * 3] = tx;
    this.pos[k * 3 + 1] = ty;
    this.pos[k * 3 + 2] = tz;
    this.meta[k * 2] = group;
    this.meta[k * 2 + 1] = weight;
  }

  jitter(amount: number) {
    return (this.rand() - 0.5) * amount;
  }

  /** Shuffled, so particles cross the screen to random places when shapes change */
  done(): Shape {
    const { pos, meta, rand } = this;
    for (let k = this.i - 1; k > 0; k--) {
      const j = Math.floor(rand() * (k + 1));
      for (let c = 0; c < 3; c++) [pos[k * 3 + c], pos[j * 3 + c]] = [pos[j * 3 + c], pos[k * 3 + c]];
      for (let c = 0; c < 2; c++) [meta[k * 2 + c], meta[j * 2 + c]] = [meta[j * 2 + c], meta[k * 2 + c]];
    }
    return { pos, meta };
  }
}

/* ---- Primitives (x right, y up, z toward the viewer) ---- */

function line(b: Builder, count: number, x1: number, y1: number, x2: number, y2: number, width: number, z: number, depth: number, group: number, weight: number) {
  const len = Math.hypot(x2 - x1, y2 - y1) || 1;
  const nx = -(y2 - y1) / len;
  const ny = (x2 - x1) / len;
  for (let k = 0; k < count; k++) {
    const t = b.rand();
    const o = b.jitter(width);
    b.push(x1 + (x2 - x1) * t + nx * o, y1 + (y2 - y1) * t + ny * o, z + b.jitter(depth), group, weight);
  }
}

function arc(b: Builder, count: number, cx: number, cy: number, radius: number, from: number, to: number, band: number, z: number, group: number, weight: number) {
  for (let k = 0; k < count; k++) {
    const a = from + (to - from) * b.rand();
    const r = radius + b.jitter(band);
    b.push(cx + Math.cos(a) * r, cy + Math.sin(a) * r, z + b.jitter(0.03), group, weight);
  }
}

/** A point on a rounded rectangle's outline, s in 0..1 around the perimeter */
function roundRectPoint(s: number, w: number, h: number, r: number): Vec2 {
  const sw = w - 2 * r;
  const sh = h - 2 * r;
  const quarter = (Math.PI * r) / 2;
  const perimeter = 2 * sw + 2 * sh + 4 * quarter;
  let d = s * perimeter;
  const hw = w / 2;
  const hh = h / 2;
  const corner = (cx: number, cy: number, from: number, t: number): Vec2 => {
    const a = from - (t / quarter) * (Math.PI / 2);
    return [cx + Math.cos(a) * r, cy + Math.sin(a) * r];
  };
  if (d < sw) return [-hw + r + d, hh];
  d -= sw;
  if (d < quarter) return corner(hw - r, hh - r, Math.PI / 2, d);
  d -= quarter;
  if (d < sh) return [hw, hh - r - d];
  d -= sh;
  if (d < quarter) return corner(hw - r, -hh + r, 0, d);
  d -= quarter;
  if (d < sw) return [hw - r - d, -hh];
  d -= sw;
  if (d < quarter) return corner(-hw + r, -hh + r, -Math.PI / 2, d);
  d -= quarter;
  if (d < sh) return [-hw, -hh + r + d];
  d -= sh;
  return corner(-hw + r, hh - r, Math.PI, d);
}

function insideRoundRect(x: number, y: number, w: number, h: number, r: number) {
  const qx = Math.abs(x) - (w / 2 - r);
  const qy = Math.abs(y) - (h / 2 - r);
  if (qx <= 0 || qy <= 0) return Math.abs(x) <= w / 2 && Math.abs(y) <= h / 2;
  return qx * qx + qy * qy <= r * r;
}

function roundRect(b: Builder, count: number, cx: number, cy: number, w: number, h: number, r: number, band: number, z: number, depth: number, group: number, weight: number) {
  for (let k = 0; k < count; k++) {
    const [x, y] = roundRectPoint(b.rand(), w, h, r);
    b.push(cx + x + b.jitter(band), cy + y + b.jitter(band), z + b.jitter(depth), group, weight);
  }
}

function roundRectFill(b: Builder, count: number, cx: number, cy: number, w: number, h: number, r: number, z: number, depth: number, group: number, weight: number) {
  let placed = 0;
  while (placed < count && b.left > 0) {
    const x = b.jitter(w);
    const y = b.jitter(h);
    if (!insideRoundRect(x, y, w, h, r)) continue;
    b.push(cx + x, cy + y, z + b.jitter(depth), group, weight);
    placed++;
  }
}

function disc(b: Builder, count: number, cx: number, cy: number, radius: number, z: number, depth: number, group: number, weight: number) {
  for (let k = 0; k < count; k++) {
    const a = b.rand() * Math.PI * 2;
    const r = Math.sqrt(b.rand()) * radius;
    b.push(cx + Math.cos(a) * r, cy + Math.sin(a) * r, z + b.jitter(depth), group, weight);
  }
}

function ball(b: Builder, count: number, cx: number, cy: number, cz: number, radius: number, group: number, weight: number) {
  for (let k = 0; k < count; k++) {
    const u = b.rand() * 2 - 1;
    const a = b.rand() * Math.PI * 2;
    const r = Math.cbrt(b.rand()) * radius;
    const s = Math.sqrt(1 - u * u);
    b.push(cx + s * Math.cos(a) * r, cy + s * Math.sin(a) * r, cz + u * r, group, weight);
  }
}

/** The four-point sparkle that has come to mean "AI" */
function sparkle(b: Builder, count: number, cx: number, cy: number, radius: number, group: number, weight: number) {
  let placed = 0;
  while (placed < count && b.left > 0) {
    const x = b.jitter(radius * 2);
    const y = b.jitter(radius * 2);
    if (Math.sqrt(Math.abs(x)) + Math.sqrt(Math.abs(y)) > Math.sqrt(radius)) continue;
    b.push(cx + x, cy + y, b.jitter(0.05), group, weight);
    placed++;
  }
}

function triangle(b: Builder, count: number, a: Vec2, c1: Vec2, c2: Vec2, z: number, group: number, weight: number) {
  for (let k = 0; k < count; k++) {
    let u = b.rand();
    let v = b.rand();
    if (u + v > 1) {
      u = 1 - u;
      v = 1 - v;
    }
    const x = a[0] + (c1[0] - a[0]) * u + (c2[0] - a[0]) * v;
    const y = a[1] + (c1[1] - a[1]) * u + (c2[1] - a[1]) * v;
    b.push(x, y, z + b.jitter(0.06), group, weight);
  }
}

/* Plates lie flat: their outline is drawn in x and z, at a height y */

function plate(b: Builder, count: number, y: number, cx: number, cz: number, w: number, d: number, r: number, band: number, weight: number) {
  for (let k = 0; k < count; k++) {
    const [x, z] = roundRectPoint(b.rand(), w, d, r);
    b.push(cx + x + b.jitter(band), y + b.jitter(0.02), cz + z + b.jitter(band), GROUP.none, weight);
  }
}

function plateFill(b: Builder, count: number, y: number, w: number, d: number, r: number, weight: number) {
  let placed = 0;
  while (placed < count && b.left > 0) {
    const x = b.jitter(w);
    const z = b.jitter(d);
    if (!insideRoundRect(x, z, w, d, r)) continue;
    b.push(x, y, z, GROUP.none, weight);
    placed++;
  }
}

function plateLine(b: Builder, count: number, y: number, x1: number, z1: number, x2: number, z2: number, width: number, weight: number) {
  for (let k = 0; k < count; k++) {
    const t = b.rand();
    b.push(x1 + (x2 - x1) * t + b.jitter(width), y + b.jitter(0.015), z1 + (z2 - z1) * t + b.jitter(width), GROUP.none, weight);
  }
}

/** The rest of the budget as a loose, flattened shell of dust */
function halo(b: Builder, inner: number, outer: number) {
  b.transform = identity;
  while (b.left > 0) {
    const u = b.rand() * 2 - 1;
    const a = b.rand() * Math.PI * 2;
    const r = inner + (outer - inner) * Math.sqrt(b.rand());
    const s = Math.sqrt(1 - u * u);
    b.push(s * Math.cos(a) * r, s * Math.sin(a) * r, u * r * 0.5, GROUP.none, DUST * (0.6 + b.rand() * 0.8));
  }
}

/* ---- Shapes, in story order ---- */

/** A ball of dust behind the statement, turning slowly */
function cloud(n: number, rand: Rand): Shape {
  const b = new Builder(n, rand);
  while (b.left > 0) {
    const u = rand() * 2 - 1;
    const a = rand() * Math.PI * 2;
    const r = 0.45 + 0.8 * Math.pow(rand(), 0.55);
    const s = Math.sqrt(1 - u * u);
    b.push(s * Math.cos(a) * r, u * r * 0.82, s * Math.sin(a) * r, GROUP.cloud, 0.25 + rand() * 0.75);
  }
  return b.done();
}

/** End to end: interface, API and data as three plates, with traffic running between them */
function stack(n: number, rand: Rand): Shape {
  const b = new Builder(n, rand);
  b.transform = tilt;
  const w = 1.8;
  const d = 1.15;

  for (const y of [0.62, 0, -0.62]) {
    plate(b, b.share(0.085), y, 0, 0, w, d, 0.12, 0.03, 1);
    plateFill(b, b.share(0.045), y - 0.01, w - 0.08, d - 0.08, 0.1, 0.12);
  }

  // Interface: a header bar and two cards
  plateLine(b, b.share(0.02), 0.62, -0.62, -0.36, 0.62, -0.36, 0.035, 0.9);
  plate(b, b.share(0.025), 0.62, -0.32, 0.12, 0.62, 0.42, 0.06, 0.012, 0.7);
  plate(b, b.share(0.025), 0.62, 0.38, 0.12, 0.62, 0.42, 0.06, 0.012, 0.7);

  // API: a grid of endpoints
  for (let i = -2; i <= 2; i++) {
    for (let j = -1; j <= 1; j++) {
      const count = b.share(0.0035);
      for (let k = 0; k < count; k++) {
        const a = rand() * Math.PI * 2;
        const r = Math.sqrt(rand()) * 0.045;
        b.push(i * 0.32 + Math.cos(a) * r, 0, j * 0.3 + Math.sin(a) * r, GROUP.none, 1);
      }
    }
  }

  // Data: the rows of a table
  for (let row = 0; row < 4; row++) {
    const z = -0.36 + row * 0.24;
    plateLine(b, b.share(0.012), -0.62, -0.7, z, -0.2, z, 0.02, 0.8);
    plateLine(b, b.share(0.016), -0.62, -0.1, z, 0.66, z, 0.02, 0.55);
  }

  // Traffic between the plates: x and z place the stream, y is where along it
  // the particle starts; the shader runs it and applies the same tilt
  b.transform = identity;
  const streams: Vec2[] = [[-0.55, -0.22], [-0.12, 0.3], [0.26, -0.12], [0.6, 0.26], [0.05, -0.38], [-0.4, 0.18]];
  const per = Math.round(b.share(0.1) / streams.length);
  streams.forEach(([x, z], i) => {
    for (let k = 0; k < per; k++) {
      b.push(x + b.jitter(0.035), rand(), z + b.jitter(0.035), i % 2 ? GROUP.down : GROUP.up, 1);
    }
  });

  halo(b, 1.3, 1.85);
  return b.done();
}

/** The assistant: a reply bubble mid-typing, the sparkle, an earlier message behind */
function chat(n: number, rand: Rand): Shape {
  const b = new Builder(n, rand);
  roundRect(b, b.share(0.25), 0, 0.1, 1.8, 1.1, 0.36, 0.045, 0, 0.14, GROUP.none, 1);
  triangle(b, b.share(0.025), [-0.62, -0.42], [-0.86, -0.8], [-0.28, -0.42], 0, GROUP.none, 1);
  roundRectFill(b, b.share(0.09), 0, 0.1, 1.72, 1.02, 0.32, -0.05, 0.02, GROUP.none, 0.12);

  ball(b, b.share(0.035), -0.34, 0.1, 0.04, 0.1, GROUP.dot1, 1);
  ball(b, b.share(0.035), 0, 0.1, 0.04, 0.1, GROUP.dot2, 1);
  ball(b, b.share(0.035), 0.34, 0.1, 0.04, 0.1, GROUP.dot3, 1);

  sparkle(b, b.share(0.05), 0.98, 0.84, 0.3, GROUP.sparkle, 1);
  sparkle(b, b.share(0.012), 1.26, 0.5, 0.12, GROUP.none, 0.9);

  roundRect(b, b.share(0.09), 0.46, -0.78, 1.15, 0.48, 0.24, 0.035, -0.5, 0.08, GROUP.none, 0.5);

  halo(b, 1.3, 1.85);
  return b.done();
}

/** Web and mobile: a phone in front, a browser behind, data flowing between them */
function devices(n: number, rand: Rand): Shape {
  const b = new Builder(n, rand);

  b.transform = pose(0.42, -0.78, -0.06, 0.3);
  roundRect(b, b.share(0.14), 0, 0, 0.66, 1.34, 0.12, 0.025, 0, 0.06, GROUP.none, 1);
  line(b, b.share(0.008), -0.08, 0.59, 0.08, 0.59, 0.03, 0.01, 0.01, GROUP.none, 1);
  line(b, b.share(0.012), -0.22, 0.44, 0.22, 0.44, 0.05, 0, 0.01, GROUP.none, 0.75);
  roundRect(b, b.share(0.03), 0, 0.17, 0.46, 0.28, 0.04, 0.012, 0, 0.01, GROUP.none, 0.6);
  roundRect(b, b.share(0.03), 0, -0.17, 0.46, 0.28, 0.04, 0.012, 0, 0.01, GROUP.none, 0.6);
  for (const x of [-0.18, -0.06, 0.06, 0.18]) disc(b, b.share(0.003), x, -0.5, 0.025, 0, 0.01, GROUP.none, 0.9);

  b.transform = pose(-0.32, 0.56, 0.12, -0.32);
  roundRect(b, b.share(0.16), 0, 0, 1.5, 1.02, 0.07, 0.025, 0, 0.06, GROUP.none, 1);
  line(b, b.share(0.025), -0.75, 0.38, 0.75, 0.38, 0.01, 0, 0.01, GROUP.none, 0.7);
  for (const x of [-0.66, -0.59, -0.52]) disc(b, b.share(0.003), x, 0.445, 0.022, 0, 0.01, GROUP.none, 1);
  line(b, b.share(0.012), -0.3, 0.445, 0.4, 0.445, 0.035, 0, 0.01, GROUP.none, 0.45);
  roundRect(b, b.share(0.035), -0.52, -0.08, 0.3, 0.74, 0.03, 0.012, 0, 0.01, GROUP.none, 0.5);
  roundRectFill(b, b.share(0.04), 0.16, 0.16, 0.9, 0.26, 0.03, 0, 0.01, GROUP.none, 0.32);
  for (const x of [-0.14, 0.16, 0.46]) roundRect(b, b.share(0.012), x, -0.26, 0.26, 0.22, 0.03, 0.01, 0, 0.01, GROUP.none, 0.55);

  // Shared code: x carries the position along the path, y and z a little spread
  b.transform = identity;
  const flow = b.share(0.07);
  for (let k = 0; k < flow; k++) b.push(rand(), b.jitter(0.06), b.jitter(0.06), GROUP.bridge, 1);

  halo(b, 1.4, 1.95);
  return b.done();
}

/** Critical integrations: a payment card, and the padlock of a secure sign-in */
function card(n: number, rand: Rand): Shape {
  const b = new Builder(n, rand);

  b.transform = pose(-0.28, -0.1, -0.06, 0);
  roundRect(b, b.share(0.2), 0, 0, 1.9, 1.2, 0.12, 0.03, 0, 0.08, GROUP.none, 1);
  roundRectFill(b, b.share(0.1), 0, 0, 1.82, 1.12, 0.1, -0.04, 0.01, GROUP.none, 0.12);

  // Chip, and the contactless mark beside it
  roundRectFill(b, b.share(0.04), -0.58, 0.16, 0.3, 0.24, 0.05, 0.02, 0.01, GROUP.none, 0.95);
  for (let i = 0; i < 3; i++) {
    arc(b, b.share(0.008 + i * 0.003), -0.3, 0.16, 0.07 + i * 0.065, -0.7, 0.7, 0.012, 0.02, GROUP.none, 0.85);
  }

  // Number in four groups, then holder and expiry
  for (let g = 0; g < 4; g++) {
    for (let k = 0; k < 4; k++) disc(b, b.share(0.0024), -0.74 + g * 0.42 + k * 0.08, -0.18, 0.022, 0.02, 0.01, GROUP.none, 1);
  }
  line(b, b.share(0.012), -0.74, -0.42, -0.2, -0.42, 0.025, 0.02, 0.01, GROUP.none, 0.6);
  line(b, b.share(0.007), 0.38, -0.42, 0.62, -0.42, 0.025, 0.02, 0.01, GROUP.none, 0.6);

  // The padlock, in front and above: body and shackle
  b.transform = pose(0.25, 0.92, 0.66, 0.4);
  roundRectFill(b, b.share(0.045), 0, -0.08, 0.38, 0.3, 0.05, 0, 0.06, GROUP.none, 1);
  arc(b, b.share(0.025), 0, 0.07, 0.12, 0, Math.PI, 0.035, 0, GROUP.none, 1);
  line(b, b.share(0.006), -0.12, 0.07, -0.12, 0.0, 0.035, 0, 0.02, GROUP.none, 1);
  line(b, b.share(0.006), 0.12, 0.07, 0.12, 0.0, 0.035, 0, 0.02, GROUP.none, 1);

  halo(b, 1.35, 1.9);
  return b.done();
}

/** Out to the edges, as the next section covers the stage */
function scatter(n: number, rand: Rand): Shape {
  const b = new Builder(n, rand);
  while (b.left > 0) {
    const u = rand() * 2 - 1;
    const a = rand() * Math.PI * 2;
    const r = 2.4 + rand() * 2.6;
    const s = Math.sqrt(1 - u * u);
    b.push(s * Math.cos(a) * r, s * Math.sin(a) * r, u * r * 0.6, GROUP.none, rand());
  }
  return b.done();
}

/**
 * Index 0 is the portrait, computed in the shader from the video's box, so
 * it has no entry here; 1 to 6 follow the page from the statement down.
 */
export function buildShapes(n: number): (Shape | null)[] {
  const rand = mulberry32(20240301);
  return [null, cloud(n, rand), stack(n, rand), chat(n, rand), devices(n, rand), card(n, rand), scatter(n, rand)];
}
