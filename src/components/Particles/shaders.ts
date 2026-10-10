/*
 * World units are CSS pixels at z = 0, origin at the viewport centre, y up.
 * Shape positions arrive in unit space and are posed by a stage (centre and
 * pixels per unit) and the shared rotation. Index 0 is the portrait: it has
 * no stored positions, it is laid out from the video's on-screen box.
 */

export const VERTEX = /* glsl */ `
uniform float uTime;
uniform float uMorph;
uniform float uFromPortrait;
uniform vec4 uRect;
uniform vec3 uFromStage;
uniform vec3 uToStage;
uniform mat3 uRot;
uniform vec2 uMouse;
uniform float uMouseForce;
uniform float uPortraitSize;
uniform float uSize;
uniform float uDpr;
uniform float uCamZ;
uniform float uFromAlpha;
uniform float uToAlpha;
uniform float uReduced;
uniform sampler2D uTex;
uniform vec3 uBone;

attribute vec2 aUv;
attribute vec4 aRand;
attribute vec3 aFrom;
attribute vec3 aTo;
attribute vec2 aFromMeta;
attribute vec2 aToMeta;

varying vec3 vColor;
varying float vAlpha;

const float PI = 3.14159265;

// Clockwise for a positive angle
mat2 turn(float a) {
  float c = cos(a);
  float s = sin(a);
  return mat2(c, -s, s, c);
}

// The stack's view from a little above; must match TILT in shapes.ts
vec3 tilt(vec3 p) {
  float cp = cos(0.5);
  float sp = sin(0.5);
  p.yz = vec2(p.y * cp - p.z * sp, p.y * sp + p.z * cp);
  float cy = cos(0.65);
  float sy = sin(0.65);
  p.xz = vec2(p.x * cy + p.z * sy, -p.x * sy + p.z * cy);
  return p;
}

// Group numbers match GROUP in shapes.ts
vec3 animate(vec3 p, float g, out float alpha) {
  alpha = 1.0;
  if (g < 0.5) return p;

  // Typing dots, one after another
  if (g < 3.5) {
    float t = fract(uTime * 0.85 - (g - 1.0) * 0.16);
    p.y += sin(clamp(t / 0.32, 0.0, 1.0) * PI) * 0.09;
    return p;
  }

  // The sparkle breathes and turns about its own centre
  if (g < 4.5) {
    vec2 c = vec2(0.98, 0.84);
    float s = 1.0 + 0.14 * sin(uTime * 2.4);
    p.xy = c + turn(uTime * 0.35) * (p.xy - c) * s;
    return p;
  }

  // Data running from the phone to the browser along an arc
  if (g < 5.5) {
    float u = fract(p.x + uTime * 0.09);
    vec3 q = mix(vec3(-0.62, 0.12, 0.32), vec3(0.36, 0.1, -0.28), u);
    q.y += sin(u * PI) * 0.5;
    q.yz += p.yz;
    alpha = sin(u * PI);
    return q;
  }

  // The cloud turns on its own, slower than the stage
  if (g < 6.5) {
    p.xz = turn(uTime * 0.07) * p.xz;
    p.y += sin(uTime * 0.6 + aRand.y * 6.2831) * 0.03;
    return p;
  }

  // Requests and data travelling between the stack's plates, up and down
  float u = fract(p.y + uTime * 0.22);
  if (g > 7.5) u = 1.0 - u;
  alpha = sin(u * PI);
  return tilt(vec3(p.x, -0.62 + 1.24 * u, p.z));
}

vec3 staged(vec3 p, vec3 stage) {
  return vec3(stage.xy, 0.0) + (uRot * p) * stage.z;
}

void main() {
  float gaFrom = 1.0;
  float gaTo = 1.0;
  bool portrait = uFromPortrait > 0.5;

  vec3 from = portrait
    ? vec3(uRect.x + aUv.x * uRect.z, uRect.y - aUv.y * uRect.w, 0.0)
    : staged(animate(aFrom, aFromMeta.x, gaFrom), uFromStage);
  vec3 to = staged(animate(aTo, aToMeta.x, gaTo), uToStage);

  // Each particle leaves on its own beat, so shapes come apart in a wave
  float t = clamp((uMorph - aRand.x * 0.45) / 0.55, 0.0, 1.0);
  t = t < 0.5 ? 4.0 * t * t * t : 1.0 - pow(-2.0 * t + 2.0, 3.0) * 0.5;
  if (uReduced > 0.5) t = step(0.5, uMorph);

  vec3 pos = mix(from, to, t);

  // A swirl in flight, a breath at rest; none of it under reduced motion
  float still = 1.0 - uReduced;
  float flight = sin(t * PI) * still;
  vec3 swirl = vec3(
    sin(aRand.y * 6.2831 + uTime * 0.7),
    cos(aRand.z * 6.2831 + uTime * 0.6),
    sin(aRand.w * 6.2831 + uTime * 0.5)
  );
  pos += swirl * flight * (0.25 + 0.5 * aRand.y) * uToStage.z;
  float rest = portrait ? t : 1.0;
  pos.xy += vec2(sin(uTime * 0.9 + aRand.z * 40.0), cos(uTime * 0.8 + aRand.w * 40.0)) * 1.4 * still * rest;

  // The cursor pushes particles aside
  vec2 d = pos.xy - uMouse;
  float dist = length(d);
  float push = smoothstep(130.0, 0.0, dist) * uMouseForce * still;
  pos.xy += d / max(dist, 0.001) * push * 46.0;

  vec4 mv = modelViewMatrix * vec4(pos, 1.0);
  gl_Position = projectionMatrix * mv;
  float persp = uCamZ / max(-mv.z, 1.0);

  float wFrom = portrait ? 1.0 : aFromMeta.y;
  float wTo = aToMeta.y;
  float vary = 0.85 + 0.3 * aRand.w;
  float sizeFrom = portrait ? uPortraitSize : uSize * mix(0.55, 1.0, wFrom) * vary;
  float sizeTo = uSize * mix(0.55, 1.0, wTo) * vary;
  gl_PointSize = max(1.0, mix(sizeFrom, sizeTo, t) * persp * uDpr);

  // The portrait's own colours, cooling to bone as the particles leave it
  vec3 bone = uBone * (0.78 + 0.22 * aRand.w);
  vec3 cFrom = portrait ? texture2D(uTex, vec2(aUv.x, 1.0 - aUv.y)).rgb : bone;
  vColor = mix(cFrom, bone, smoothstep(0.0, 0.6, t));

  float alphaFrom = uFromAlpha * (portrait ? 1.0 : mix(0.16, 1.0, wFrom) * gaFrom);
  float alphaTo = uToAlpha * mix(0.16, 1.0, wTo) * gaTo;
  vAlpha = mix(alphaFrom, alphaTo, t);

  // The far side of a turning shape recedes
  float fog = mix(0.45, 1.0, smoothstep(-0.9, 0.5, pos.z / max(uToStage.z, 1.0)));
  vAlpha *= portrait ? mix(1.0, fog, t) : fog;

  // Reduced motion: no flight, the shapes cross-fade through nothing
  if (uReduced > 0.5) vAlpha *= abs(uMorph - 0.5) * 2.0;
}
`;

export const FRAGMENT = /* glsl */ `
uniform float uGlobalAlpha;

varying vec3 vColor;
varying float vAlpha;

void main() {
  gl_FragColor = vec4(vColor, vAlpha * uGlobalAlpha);
}
`;
