import * as THREE from "three";
import { FRAGMENT, VERTEX } from "./shaders";
import { buildShapes, mulberry32 } from "./shapes";

const FOV = 30;
const BONE = new THREE.Color(0xefebe4);

export interface Frame {
  from: number;
  to: number;
  morph: number;
  /** The portrait's box in world units: left, top, width, height */
  rect: [number, number, number, number];
  fromStage: [number, number, number];
  toStage: [number, number, number];
  fromAlpha: number;
  toAlpha: number;
  globalAlpha: number;
  yaw: number;
  pitch: number;
  mouse: [number, number];
  mouseForce: number;
  time: number;
  portraitSize: number;
  size: number;
}

export interface Engine {
  resize(width: number, height: number): void;
  render(frame: Frame): void;
  useVideo(video: HTMLVideoElement): void;
  useImage(src: string): void;
  dispose(): void;
}

/**
 * One draw call: every particle is a point whose position is blended between
 * two shapes in the vertex shader. Only the pair of shapes changes on the
 * CPU, when the story crosses from one segment into the next.
 */
export function createEngine(
  canvas: HTMLCanvasElement,
  { cols, rows, dpr, reduced }: { cols: number; rows: number; dpr: number; reduced: boolean },
): Engine {
  const n = cols * rows;
  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: false,
    powerPreference: "high-performance",
  });
  renderer.setPixelRatio(dpr);
  renderer.setClearColor(0x000000, 0);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(FOV, 1, 1, 50000);

  const shapes = buildShapes(n);
  const rand = mulberry32(7);
  const uv = new Float32Array(n * 2);
  const seeds = new Float32Array(n * 4);
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const k = r * cols + c;
      uv[k * 2] = (c + 0.5) / cols;
      uv[k * 2 + 1] = (r + 0.5) / rows;
    }
  }
  for (let k = 0; k < n * 4; k++) seeds[k] = rand();

  const dynamic = (size: number) =>
    new THREE.BufferAttribute(new Float32Array(n * size), size).setUsage(THREE.DynamicDrawUsage);
  const aFrom = dynamic(3);
  const aTo = dynamic(3);
  const aFromMeta = dynamic(2);
  const aToMeta = dynamic(2);

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(new Float32Array(n * 3), 3));
  geometry.setAttribute("aUv", new THREE.BufferAttribute(uv, 2));
  geometry.setAttribute("aRand", new THREE.BufferAttribute(seeds, 4));
  geometry.setAttribute("aFrom", aFrom);
  geometry.setAttribute("aTo", aTo);
  geometry.setAttribute("aFromMeta", aFromMeta);
  geometry.setAttribute("aToMeta", aToMeta);

  const blank = new THREE.DataTexture(new Uint8Array([239, 235, 228, 255]), 1, 1);
  blank.needsUpdate = true;

  const uniforms = {
    uTime: { value: 0 },
    uMorph: { value: 0 },
    uFromPortrait: { value: 1 },
    uRect: { value: new THREE.Vector4() },
    uFromStage: { value: new THREE.Vector3() },
    uToStage: { value: new THREE.Vector3() },
    uRot: { value: new THREE.Matrix3() },
    uMouse: { value: new THREE.Vector2(-1e5, -1e5) },
    uMouseForce: { value: 0 },
    uPortraitSize: { value: 3 },
    uSize: { value: 2.4 },
    uDpr: { value: dpr },
    uCamZ: { value: 1000 },
    uFromAlpha: { value: 1 },
    uToAlpha: { value: 1 },
    uReduced: { value: reduced ? 1 : 0 },
    uTex: { value: blank as THREE.Texture },
    uBone: { value: new THREE.Vector3(BONE.r, BONE.g, BONE.b) },
    uGlobalAlpha: { value: 1 },
  };

  const material = new THREE.ShaderMaterial({
    uniforms,
    vertexShader: VERTEX,
    fragmentShader: FRAGMENT,
    transparent: true,
    depthTest: false,
    depthWrite: false,
  });

  const points = new THREE.Points(geometry, material);
  points.frustumCulled = false;
  scene.add(points);

  let pair: [number, number] = [-1, -1];
  const load = (index: number, pos: THREE.BufferAttribute, meta: THREE.BufferAttribute) => {
    const shape = shapes[index];
    if (!shape) return;
    (pos.array as Float32Array).set(shape.pos);
    (meta.array as Float32Array).set(shape.meta);
    pos.needsUpdate = true;
    meta.needsUpdate = true;
  };

  const rotation = new THREE.Matrix4();
  const yawM = new THREE.Matrix4();
  const pitchM = new THREE.Matrix4();
  let texture: THREE.Texture | null = null;

  const swapTexture = (next: THREE.Texture) => {
    next.colorSpace = THREE.NoColorSpace;
    next.minFilter = THREE.LinearFilter;
    next.generateMipmaps = false;
    texture?.dispose();
    texture = next;
    uniforms.uTex.value = next;
  };

  return {
    resize(width, height) {
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.position.set(0, 0, height / 2 / Math.tan(THREE.MathUtils.degToRad(FOV / 2)));
      camera.far = camera.position.z * 10;
      camera.updateProjectionMatrix();
      uniforms.uCamZ.value = camera.position.z;
    },

    render(f) {
      if (pair[0] !== f.from || pair[1] !== f.to) {
        if (f.from !== pair[0]) load(f.from, aFrom, aFromMeta);
        load(f.to, aTo, aToMeta);
        pair = [f.from, f.to];
      }

      yawM.makeRotationY(f.yaw);
      pitchM.makeRotationX(f.pitch);
      rotation.multiplyMatrices(yawM, pitchM);
      uniforms.uRot.value.setFromMatrix4(rotation);

      uniforms.uTime.value = f.time;
      uniforms.uMorph.value = f.morph;
      uniforms.uFromPortrait.value = f.from === 0 ? 1 : 0;
      uniforms.uRect.value.set(...f.rect);
      uniforms.uFromStage.value.set(...f.fromStage);
      uniforms.uToStage.value.set(...f.toStage);
      uniforms.uFromAlpha.value = f.fromAlpha;
      uniforms.uToAlpha.value = f.toAlpha;
      uniforms.uGlobalAlpha.value = f.globalAlpha;
      uniforms.uMouse.value.set(...f.mouse);
      uniforms.uMouseForce.value = f.mouseForce;
      uniforms.uPortraitSize.value = f.portraitSize;
      uniforms.uSize.value = f.size;

      renderer.render(scene, camera);
    },

    useVideo(video) {
      swapTexture(new THREE.VideoTexture(video));
    },

    useImage(src) {
      new THREE.TextureLoader().load(src, (t) => swapTexture(t));
    },

    dispose() {
      texture?.dispose();
      blank.dispose();
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    },
  };
}
