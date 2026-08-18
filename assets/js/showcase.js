import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const MODEL_BASE = 'assets/models/';
const MODELS = [
  { name: 'Mercury', file: 'Mercury.glb' },
  { name: 'Venus',   file: 'Venus.glb' },
  { name: 'Earth',   file: 'Earth.glb' },
  { name: 'Mars',    file: 'Mars.glb' },
  { name: 'Jupiter', file: 'Jupiter.glb' },
  { name: 'Saturn',  file: 'Saturn.glb' },
  { name: 'Uranus',  file: 'Uranus.glb' },
  { name: 'Neptune', file: 'Neptune.glb' }
];

const wrap = document.getElementById('showcase-stage');
const canvas = document.getElementById('showcase-canvas');
const tabsEl = document.getElementById('showcase-tabs');
const nameEl = document.getElementById('showcase-name');
const loadingEl = document.getElementById('showcase-loading');

if (wrap && canvas && tabsEl) {
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
  camera.position.set(0, 0, 3.2);

  scene.add(new THREE.AmbientLight(0xffffff, 0.85));
  const key = new THREE.DirectionalLight(0xffffff, 2.1);
  key.position.set(3, 2, 4);
  scene.add(key);
  const rim = new THREE.DirectionalLight(0xa855f7, 1.1);
  rim.position.set(-4, -1, -3);
  scene.add(rim);

  const controls = new OrbitControls(camera, canvas);
  controls.enableDamping = true;
  controls.dampingFactor = 0.08;
  controls.enablePan = false;
  controls.enableZoom = false;
  controls.autoRotate = true;
  controls.autoRotateSpeed = 0.9;

  const loader = new GLTFLoader();
  let current = null;
  let currentIndex = -1;

  function resize() {
    const w = wrap.clientWidth;
    const h = wrap.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }

  function frameObject(obj) {
    const box = new THREE.Box3().setFromObject(obj);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    obj.position.sub(center);
    const maxDim = Math.max(size.x, size.y, size.z) || 1;
    obj.scale.setScalar(1.7 / maxDim);
  }

  function setLoading(on) {
    if (loadingEl) loadingEl.classList.toggle('is-hidden', !on);
  }

  function load(index) {
    if (index === currentIndex) return;
    currentIndex = index;
    const model = MODELS[index];

    [...tabsEl.children].forEach((b, i) => b.classList.toggle('active', i === index));
    if (nameEl) nameEl.textContent = model.name;

    setLoading(true);
    loader.load(
      MODEL_BASE + model.file,
      gltf => {
        if (current) {
          scene.remove(current);
          current.traverse(o => {
            if (o.isMesh) {
              o.geometry?.dispose();
              const m = o.material;
              if (Array.isArray(m)) m.forEach(x => x.dispose());
              else m?.dispose();
            }
          });
        }
        current = gltf.scene;
        frameObject(current);
        scene.add(current);
        setLoading(false);
      },
      undefined,
      err => {
        console.warn('Could not load', model.file, err);
        setLoading(false);
      }
    );
  }

  // build the selector
  MODELS.forEach((m, i) => {
    const b = document.createElement('button');
    b.className = 'showcase-tab';
    b.type = 'button';
    b.textContent = m.name;
    b.addEventListener('click', () => load(i));
    tabsEl.appendChild(b);
  });

  new ResizeObserver(resize).observe(wrap);
  resize();
  load(2); // Earth by default

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  controls.autoRotate = !reduced;

  (function tick() {
    requestAnimationFrame(tick);
    controls.update();
    renderer.render(scene, camera);
  })();
}
