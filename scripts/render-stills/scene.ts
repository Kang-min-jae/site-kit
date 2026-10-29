/**
 * 시안용 정물 렌더 — 실제 사진이 오기 전까지 "물건이 테이블에 놓인" 소재를 직접 만든다.
 * 모든 형태·재질·빛은 이 파일에서 새로 만든 것이다 (외부 모델·텍스처·HDRI 없음).
 * 사용: node scripts/render-stills/render.mjs  → public/stills/*.jpg
 */
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

type Shot = { w: number; h: number; cam: [number, number, number]; look: [number, number, number]; fov: number; items: string[]; /** 물건 전체를 옮겨 글자 자리를 비운다 */ offset?: [number, number, number]; /** 바탕 없이(투명 PNG) — ObjectStage용 오려낸 물건 */ cutout?: boolean };

const SHOTS: Record<string, Shot> = {
  hero: { w: 1920, h: 1080, cam: [0.2, 2.05, 4.6], look: [0.15, 0.05, 0], fov: 32, items: ["bowl", "plate", "glass", "candle", "napkin", "cake"], offset: [0.95, 0, -0.55] },
  soup: { w: 1200, h: 1500, cam: [-0.35, 1.55, 1.75], look: [-0.88, 0.1, 0.05], fov: 34, items: ["bowl", "candle", "napkin", "plate", "glass"] },
  main: { w: 1200, h: 1500, cam: [1.35, 1.0, 1.75], look: [0.72, 0.06, 0.2], fov: 26, items: ["plate", "glass", "candle", "bowl"] },
  dessert: { w: 1200, h: 1500, cam: [0.3, 0.95, 2.35], look: [-0.2, 0.1, 0.95], fov: 28, items: ["cake", "candle", "glass", "plate"] },
  cutout: { w: 1200, h: 1200, cam: [0, 0.75, 1.55], look: [0, 0.1, 0], fov: 26, items: ["cake"], offset: [0.2, 0, -1.0], cutout: true },
  glass: { w: 1200, h: 1500, cam: [2.45, 0.68, 1.3], look: [1.35, 0.48, -0.45], fov: 30, items: ["glass", "candle", "bowl", "plate"] },
};

// ---- 절차 텍스처 (캔버스로 직접 그림) ----------------------------------------
function rand(seed: number) {
  let s = seed;
  return () => ((s = (s * 16807) % 2147483647) / 2147483647);
}
function woodTexture() {
  const c = document.createElement("canvas");
  c.width = 1024; c.height = 1024;
  const g = c.getContext("2d")!;
  const r = rand(7);
  g.fillStyle = "#3b2618"; g.fillRect(0, 0, 1024, 1024);
  for (let i = 0; i < 520; i++) {
    const y = r() * 1024, a = 0.05 + r() * 0.12;
    g.strokeStyle = r() > 0.5 ? `rgba(20,10,4,${a})` : `rgba(120,80,48,${a * 0.7})`;
    g.lineWidth = 0.6 + r() * 3;
    g.beginPath(); g.moveTo(0, y);
    for (let x = 0; x <= 1024; x += 64) g.lineTo(x, y + Math.sin(x / 140 + i) * (2 + r() * 6));
    g.stroke();
  }
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace; t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(2, 1); t.anisotropy = 8;
  return t;
}
function linenTexture() {
  const c = document.createElement("canvas");
  c.width = 512; c.height = 512;
  const g = c.getContext("2d")!;
  const r = rand(3);
  g.fillStyle = "#c9bca4"; g.fillRect(0, 0, 512, 512);
  for (let i = 0; i < 512; i += 2) {
    g.fillStyle = `rgba(90,75,55,${0.04 + r() * 0.08})`; g.fillRect(0, i, 512, 1);
    g.fillStyle = `rgba(255,248,235,${0.03 + r() * 0.06})`; g.fillRect(i, 0, 1, 512);
  }
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace; t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(3, 3);
  return t;
}

// ---- 재질 ------------------------------------------------------------------
const M = {
  ceramic: new THREE.MeshPhysicalMaterial({ color: "#e8e1d4", roughness: 0.38, clearcoat: 0.5, clearcoatRoughness: 0.25 }),
  glaze: new THREE.MeshPhysicalMaterial({ color: "#26241f", roughness: 0.22, clearcoat: 1, clearcoatRoughness: 0.08 }),
  broth: new THREE.MeshPhysicalMaterial({ color: "#8f4c17", roughness: 0.02, clearcoat: 1 }),
  scallion: new THREE.MeshStandardMaterial({ color: "#6e8a35", roughness: 0.45 }),
  sesame: new THREE.MeshStandardMaterial({ color: "#e4d2a8", roughness: 0.6 }),
  sauce: new THREE.MeshPhysicalMaterial({ color: "#2e120a", roughness: 0.08, clearcoat: 1 }),
  herb: new THREE.MeshStandardMaterial({ color: "#4f6b2c", roughness: 0.5 }),
  sponge: new THREE.MeshStandardMaterial({ color: "#e2cfa6", roughness: 0.85 }),
  choco: new THREE.MeshPhysicalMaterial({ color: "#3a1f12", roughness: 0.18, clearcoat: 1 }),
  cream: new THREE.MeshStandardMaterial({ color: "#f1e9da", roughness: 0.7 }),
  glass: new THREE.MeshPhysicalMaterial({ color: "#ffffff", roughness: 0.02, transmission: 1, thickness: 0.05, ior: 1.5, transparent: true }),
  wine: new THREE.MeshPhysicalMaterial({ color: "#5a0f18", roughness: 0.03, transmission: 0.55, thickness: 0.4, ior: 1.34, clearcoat: 1 }),
  wax: new THREE.MeshStandardMaterial({ color: "#efe5cf", roughness: 0.92, emissive: "#3a1d08", emissiveIntensity: 0.25 }),
  flame: new THREE.MeshBasicMaterial({ color: "#ffd9a0" }),
  holder: new THREE.MeshPhysicalMaterial({ color: "#8c6a3c", metalness: 1, roughness: 0.32 }),
};

function lathe(points: [number, number][], segments = 96) {
  return new THREE.LatheGeometry(points.map(([x, y]) => new THREE.Vector2(x, y)), segments);
}
function shadowy<T extends THREE.Object3D>(o: T) {
  o.traverse((m) => { if ((m as THREE.Mesh).isMesh) { m.castShadow = true; m.receiveShadow = true; } });
  return o;
}

// ---- 물건 ------------------------------------------------------------------
function bowl() {
  const g = new THREE.Group();
  const outer: [number, number][] = [];
  for (let i = 0; i <= 24; i++) { const t = i / 24; outer.push([0.22 + Math.sin(t * Math.PI * 0.5) * 0.36, t * 0.32]); }
  const inner = [...outer].reverse().map(([x, y]) => [x - 0.03, y + 0.02] as [number, number]);
  g.add(new THREE.Mesh(lathe([[0, 0.01], [0.2, 0], ...outer, [0.6, 0.33], ...inner, [0, 0.05]]), M.glaze));
  const soup = new THREE.Mesh(new THREE.CircleGeometry(0.5, 96), M.broth);
  soup.rotation.x = -Math.PI / 2; soup.position.y = 0.25; g.add(soup);
  const r = rand(11);
  for (let i = 0; i < 26; i++) {
    const a = r() * Math.PI * 2, d = Math.sqrt(r()) * 0.36;
    const s = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.012, 16, 1, true), M.scallion);
    s.position.set(Math.cos(a) * d, 0.256, Math.sin(a) * d); g.add(s);
  }
  for (let i = 0; i < 40; i++) {
    const a = r() * Math.PI * 2, d = Math.sqrt(r()) * 0.4;
    const s = new THREE.Mesh(new THREE.SphereGeometry(0.007, 8, 6), M.sesame);
    s.scale.set(1.6, 0.6, 1); s.rotation.y = r() * 3; s.position.set(Math.cos(a) * d, 0.255, Math.sin(a) * d); g.add(s);
  }
  g.position.set(-0.9, 0, 0.1);
  return shadowy(g);
}
function plate() {
  const g = new THREE.Group();
  g.add(new THREE.Mesh(lathe([[0, 0.012], [0.3, 0.008], [0.42, 0.02], [0.62, 0.06], [0.66, 0.07], [0.63, 0.075], [0.42, 0.035], [0.3, 0.03], [0, 0.03]]), M.ceramic));
  const pool = new THREE.Mesh(new THREE.CircleGeometry(0.2, 64), M.sauce);
  pool.rotation.x = -Math.PI / 2; pool.scale.set(1.25, 1, 1.05); pool.position.set(0.04, 0.033, 0.02); g.add(pool);
  const sides = new THREE.MeshPhysicalMaterial({ color: "#eadfc9", roughness: 0.35, clearcoat: 0.6 });
  const crust = new THREE.MeshPhysicalMaterial({ color: "#6e3812", roughness: 0.4, clearcoat: 0.8, clearcoatRoughness: 0.3 });
  const spots: [number, number][] = [[-0.12, -0.03], [0.07, -0.09], [0.13, 0.1], [-0.05, 0.14]];
  for (const [x, z] of spots) {
    const sc = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.08, 0.065, 48), [sides, crust, sides]);
    sc.position.set(x, 0.065, z); g.add(sc);
  }
  const r = rand(5);
  for (let i = 0; i < 9; i++) {
    const h = new THREE.Mesh(new THREE.SphereGeometry(0.022, 12, 8), M.herb);
    h.scale.set(1.4, 0.5, 0.8); h.rotation.set(r(), r() * 3, r());
    h.position.set(-0.14 + r() * 0.3, 0.1 + r() * 0.01, -0.1 + r() * 0.26); g.add(h);
  }
  g.position.set(0.75, 0, 0.25);
  return shadowy(g);
}
function wineGlass() {
  const g = new THREE.Group();
  const prof: [number, number][] = [[0, 0], [0.17, 0], [0.18, 0.008], [0.03, 0.02], [0.018, 0.05], [0.016, 0.42], [0.06, 0.47], [0.14, 0.56], [0.17, 0.68], [0.16, 0.8], [0.145, 0.88], [0.14, 0.88], [0.152, 0.8], [0.16, 0.68], [0.13, 0.565], [0.05, 0.48], [0, 0.47]];
  g.add(new THREE.Mesh(lathe(prof, 128), M.glass));
  const wineProf: [number, number][] = [[0, 0.48], [0.05, 0.485], [0.125, 0.565], [0.15, 0.64], [0, 0.64]];
  g.add(new THREE.Mesh(lathe(wineProf, 96), M.wine));
  g.position.set(1.55, 0, -0.35);
  return shadowy(g);
}
let flameLight: THREE.PointLight;
function candle() {
  const g = new THREE.Group();
  g.add(new THREE.Mesh(lathe([[0, 0], [0.16, 0], [0.17, 0.015], [0.12, 0.03], [0.07, 0.035], [0.07, 0.05], [0, 0.05]]), M.holder));
  const body = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.058, 0.62, 48), M.wax);
  body.position.y = 0.36; g.add(body);
  const f = new THREE.Mesh(new THREE.SphereGeometry(0.02, 24, 16), M.flame);
  f.scale.set(1, 2.6, 1); f.position.y = 0.72; g.add(f);
  flameLight = new THREE.PointLight("#ff9b4d", 2.6, 6, 1.6);
  flameLight.position.y = 0.74; flameLight.castShadow = false;
  g.add(flameLight);
  body.castShadow = false;
  g.position.set(0.55, 0, -0.75);
  g.traverse((m) => { if ((m as THREE.Mesh).isMesh && m !== f) m.receiveShadow = true; });
  return g;
}
function cake() {
  const g = new THREE.Group();
  g.add(new THREE.Mesh(lathe([[0, 0.008], [0.2, 0.005], [0.3, 0.03], [0.32, 0.035], [0.3, 0.04], [0.2, 0.02], [0, 0.02]]), M.ceramic));
  const layers = [M.sponge, M.choco, M.sponge, M.choco];
  let y = 0.02;
  layers.forEach((m, i) => {
    const h = i % 2 ? 0.025 : 0.05;
    const l = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.13, h, 64), m);
    l.position.y = y + h / 2; y += h; g.add(l);
  });
  const top = new THREE.Mesh(new THREE.CylinderGeometry(0.134, 0.134, 0.018, 64), M.choco);
  top.position.y = y + 0.009; g.add(top);
  const dollop = new THREE.Mesh(new THREE.SphereGeometry(0.045, 32, 16), M.cream);
  dollop.scale.set(1, 0.7, 1); dollop.position.set(0.2, 0.05, 0.08); g.add(dollop);
  g.position.set(-0.2, 0, 1.0); g.rotation.y = 2.2;
  return shadowy(g);
}
function napkin() {
  const geo = new THREE.PlaneGeometry(1.4, 0.9, 60, 40);
  const pos = geo.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i), y = pos.getY(i);
    pos.setZ(i, Math.sin(x * 7) * 0.002 + Math.sin(y * 11 + x * 3) * 0.0015);
  }
  geo.computeVertexNormals();
  const m = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ map: linenTexture(), roughness: 1, side: THREE.DoubleSide }));
  m.rotation.x = -Math.PI / 2; m.rotation.z = 0.18; m.position.set(-0.75, 0.008, 0.25); m.receiveShadow = true;
  return m;
}

// ---- 장면 ------------------------------------------------------------------
export async function render(name: string) {
  const shot = SHOTS[name];
  const renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true, alpha: !!shot.cutout });
  renderer.setPixelRatio(1);
  renderer.setSize(shot.w, shot.h);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  document.body.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  if (!shot.cutout) {
    scene.background = new THREE.Color("#120d09");
    scene.fog = new THREE.Fog("#120d09", 4.5, 11);
  }
  const pm = new THREE.PMREMGenerator(renderer);
  scene.environment = pm.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environmentIntensity = shot.cutout ? 0.6 : 0.22;

  const table = new THREE.Mesh(new THREE.BoxGeometry(9, 0.2, 5), new THREE.MeshStandardMaterial({ map: woodTexture(), roughness: 0.5 }));
  table.position.y = -0.1; table.receiveShadow = true;
  if (!shot.cutout) scene.add(table);
  const wall = new THREE.Mesh(new THREE.PlaneGeometry(20, 8), new THREE.MeshStandardMaterial({ color: "#2a1d14", roughness: 0.95 }));
  wall.position.set(0, 2, -3.2); wall.receiveShadow = true;
  if (!shot.cutout) scene.add(wall);

  const key = new THREE.SpotLight("#ffd6a3", 36, 14, 0.32, 1, 1.6);
  const off = shot.offset ?? [0, 0, 0];
  key.position.set(-1.6 + off[0], 4.4, 1.2 + off[2]); key.target.position.set(0.3 + off[0], 0, -0.05 + off[2]);
  key.castShadow = true; key.shadow.mapSize.set(2048, 2048); key.shadow.radius = 8; key.shadow.bias = -0.0004;
  scene.add(key, key.target);
  const rim = new THREE.DirectionalLight("#8ea0c0", 0.35); rim.position.set(3, 2.5, -4); scene.add(rim);
  scene.add(new THREE.HemisphereLight("#3a2a1c", "#0c0805", 0.35));

  const make: Record<string, () => THREE.Object3D> = { bowl, plate, glass: wineGlass, candle, cake, napkin };
  const things = new THREE.Group();
  things.position.set(...off);
  for (const it of shot.items) things.add(make[it]());
  scene.add(things);

  const cam = new THREE.PerspectiveCamera(shot.fov, shot.w / shot.h, 0.05, 50);
  cam.position.set(...shot.cam); cam.lookAt(...shot.look);
  renderer.compile(scene, cam);
  renderer.render(scene, cam);
  return renderer.domElement.toDataURL("image/png");
}
(window as unknown as { renderShot: typeof render }).renderShot = render;
