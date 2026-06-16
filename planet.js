import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const wrap = document.querySelector('.planet-wrap');
const canvas = document.getElementById('planet-canvas');

// ── Random planet model picked on each page load ────────────────────────
const PLANET_MODELS = [
  'Mars.glb',
  'Earth.glb',
  'Jupiter.glb',
  'Mercury.glb',
  'Venus.glb',
  'Saturn.glb',
  'Uranus.glb',
  'Neptune.glb',
  // add more models here as needed
];
const randomModel = PLANET_MODELS[Math.floor(Math.random() * PLANET_MODELS.length)];

if (!wrap || !canvas) {
  console.warn('Planet wrap or canvas not found – skipping 3D Earth.');
} else {
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 0.85;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
  camera.position.set(0, 0.6, 7.0);
  camera.lookAt(0, 0, 0);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping    = true;
  controls.dampingFactor    = 0.05;
  controls.rotateSpeed      = 0.8;
  controls.autoRotate       = true;
  controls.autoRotateSpeed  = 0.6;
  controls.enableZoom       = false;
  controls.enablePan        = false;
  controls.minDistance      = 6;
  controls.maxDistance      = 18;
  controls.target.set(0, 0, 0);
  controls.update();

  // ── Planet-specific lighting rigs ──────────────────────────────────────
  // Lights are added lazily once we know which model loaded, so each planet
  // gets a rig tuned to its real-world solar distance and albedo.

  function applyEarthLighting() {
    // ACESFilmic crushes bright colours too hard for Earth's vivid palette,
    // so we switch to LinearToneMapping + high exposure for this planet only.
    renderer.toneMapping         = THREE.LinearToneMapping;
    renderer.toneMappingExposure = 2.2;  // drives overall brightness hard

    // Bright white-blue ambient – lifts the whole surface, kills mud
    scene.add(new THREE.AmbientLight(0x6688cc, 3.5));

    // Primary sun: pure white, very high intensity key from upper-right
    const sun = new THREE.DirectionalLight(0xffffff, 8.0);
    sun.position.set(8, 3, 5);
    scene.add(sun);

    // Strong front-facing fill so the camera-facing hemisphere is fully lit
    const frontFill = new THREE.DirectionalLight(0xddeeff, 4.0);
    frontFill.position.set(0, 0, 10);   // straight at the camera = max visibility
    scene.add(frontFill);

    // Blue atmosphere scatter on the shadow limb
    const atmScatter = new THREE.DirectionalLight(0x4488ff, 2.0);
    atmScatter.position.set(-7, 0.5, 3);
    scene.add(atmScatter);

    // Top-down pole fill – keeps ice caps bright white
    const poleFill = new THREE.DirectionalLight(0xccddff, 2.5);
    poleFill.position.set(0, 10, 2);
    scene.add(poleFill);

    // Bottom fill so the southern hemisphere isn't lost
    const bottomFill = new THREE.DirectionalLight(0x99bbff, 1.8);
    bottomFill.position.set(0, -8, 3);
    scene.add(bottomFill);

    // Back rim – thin bright edge separating Earth from the black background
    const rimLight = new THREE.DirectionalLight(0xaaccff, 1.5);
    rimLight.position.set(-4, 1, -6);
    scene.add(rimLight);
  }

  function applyGenericLighting() {
    // Default rig (originally tuned for Mars / warm planets)
    scene.add(new THREE.AmbientLight(0x2a1205, 0.9));

    const sunLight = new THREE.DirectionalLight(0xffd0a0, 2.4);
    sunLight.position.set(6, 2, 4);
    scene.add(sunLight);

    const fillLight = new THREE.DirectionalLight(0xc87040, 0.9);
    fillLight.position.set(-6, 1, 3);
    scene.add(fillLight);

    const scatterLight = new THREE.DirectionalLight(0x8b3a10, 0.5);
    scatterLight.position.set(-5, 0.5, 2);
    scene.add(scatterLight);

    const rimLight = new THREE.DirectionalLight(0x502010, 0.55);
    rimLight.position.set(-4, -2, -4);
    scene.add(rimLight);

    const backFill = new THREE.DirectionalLight(0x7a3010, 0.4);
    backFill.position.set(2, -1, -6);
    scene.add(backFill);
  }

  let modelGroup = null;
  const loader = new GLTFLoader();

  // ── Atmosphere glow (sprite halo) ──────────────────────────────────────
  function createAtmosphereGlow(isEarth = false) {
    const c = document.createElement('canvas');
    c.width = 256; c.height = 256;
    const ctx = c.getContext('2d');
    const g = ctx.createRadialGradient(128, 128, 58, 128, 128, 128);
    if (isEarth) {
      // Cool blue atmospheric scattering ring
      g.addColorStop(0,    'rgba(30,80,200,0)');
      g.addColorStop(0.60, 'rgba(30,80,200,0)');
      g.addColorStop(0.72, 'rgba(50,120,220,0.20)');
      g.addColorStop(0.83, 'rgba(80,160,255,0.28)');
      g.addColorStop(0.92, 'rgba(120,200,255,0.10)');
      g.addColorStop(1,    'rgba(160,220,255,0)');
    } else {
      // Warm rust halo (Mars / generic)
      g.addColorStop(0,    'rgba(180,60,20,0)');
      g.addColorStop(0.62, 'rgba(180,60,20,0)');
      g.addColorStop(0.75, 'rgba(200,80,30,0.18)');
      g.addColorStop(0.86, 'rgba(220,110,50,0.22)');
      g.addColorStop(0.94, 'rgba(230,150,80,0.08)');
      g.addColorStop(1,    'rgba(240,180,100,0)');
    }
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 256, 256);
    return new THREE.CanvasTexture(c);
  }

  function addAtmosphereHalo(parentGroup, radius, isEarth = false) {
    const mat = new THREE.SpriteMaterial({
      map: createAtmosphereGlow(isEarth),
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const sprite = new THREE.Sprite(mat);
    const s = radius * 2.9;
    sprite.scale.set(s, s, 1);
    parentGroup.add(sprite);
  }

  // ── Procedural Earth textures ───────────────────────────────────────────
  function createEarthTexture() {
    const c = document.createElement('canvas');
    c.width = 2048; c.height = 1024;
    const ctx = c.getContext('2d');

    // Ocean
    const ocean = ctx.createLinearGradient(0, 0, 0, 1024);
    ocean.addColorStop(0,   '#0b2e62');
    ocean.addColorStop(0.4, '#0e4080');
    ocean.addColorStop(1,   '#07213a');
    ctx.fillStyle = ocean;
    ctx.fillRect(0, 0, 2048, 1024);

    // Helper: draw filled ellipse
    const ell = (x, y, rx, ry, rot = 0, color) => {
      ctx.save();
      ctx.fillStyle = color;
      ctx.translate(x, y);
      ctx.rotate(rot);
      ctx.beginPath();
      ctx.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    };

    // --- Continents ---
    // North America
    ell(310, 240, 170, 140, -0.15, '#2a6e2a');
    ell(290, 220, 90, 70, -0.2, '#357a35');   // Canadian shield
    ell(340, 330, 60, 50, 0.1, '#2a6e2a');    // Central America nub
    // Greenland
    ell(430, 140, 55, 80, 0.2, '#aaccbb');

    // South America
    ell(420, 560, 95, 170, 0.15, '#2a7a2a');
    ell(430, 480, 65, 60, 0, '#3a8c3a');
    ell(390, 660, 45, 55, -0.1, '#266626'); // Patagonia

    // Europe
    ell(950, 220, 100, 80, -0.1, '#3a803a');
    ell(1010, 180, 55, 45, 0, '#458045');
    ell(920, 170, 30, 25, 0, '#507050'); // Scandinavia

    // Africa
    ell(970, 460, 120, 195, 0.05, '#4a9a4a');
    ell(980, 350, 80, 60, 0, '#558855');  // North Africa top
    // Sahara desert
    ell(960, 390, 110, 60, 0, '#c8a83a');
    ell(1020, 370, 60, 40, 0, '#d4b240');
    // Nile / sub-Saharan green
    ell(990, 490, 30, 60, 0, '#3d7a3d');

    // Europe–Asia peninsula
    ell(1050, 195, 30, 22, 0.3, '#458045'); // Arabia top
    // Arabian peninsula (desert)
    ell(1080, 310, 65, 90, 0.1, '#c8a030');

    // Asia (main body)
    ell(1280, 220, 290, 160, -0.05, '#358035');
    ell(1380, 160, 180, 90, 0, '#3a8a3a');
    ell(1180, 190, 100, 70, 0, '#4a904a');
    // Gobi / central deserts
    ell(1320, 250, 130, 55, -0.1, '#b8963a');
    ell(1250, 280, 80, 40, 0, '#c4a040');
    // Indian subcontinent
    ell(1170, 380, 75, 90, 0.05, '#3a7a2a');
    // Southeast Asia
    ell(1400, 360, 80, 65, 0.1, '#2a7020');
    ell(1490, 380, 30, 40, 0, '#2a6a1a');

    // Japan
    ell(1530, 240, 18, 45, 0.35, '#336633');

    // Australia
    ell(1480, 680, 125, 90, 0.05, '#7a7a20');
    ell(1470, 670, 80, 55, 0, '#a09030');  // outback
    ell(1500, 700, 30, 25, 0, '#8a8a28');
    ell(1420, 680, 35, 30, -0.2, '#3a7a30'); // western green

    // New Zealand
    ell(1590, 750, 12, 30, 0.3, '#2a7030');

    // Antarctica (south)
    const iceS = ctx.createLinearGradient(0, 880, 0, 1024);
    iceS.addColorStop(0, 'rgba(200,220,255,0)');
    iceS.addColorStop(0.4, 'rgba(215,230,255,0.85)');
    iceS.addColorStop(1,   'rgba(230,240,255,1)');
    ctx.fillStyle = iceS;
    ctx.fillRect(0, 880, 2048, 144);

    // Arctic (north)
    const iceN = ctx.createLinearGradient(0, 0, 0, 130);
    iceN.addColorStop(0, 'rgba(225,238,255,1)');
    iceN.addColorStop(0.7, 'rgba(215,230,255,0.6)');
    iceN.addColorStop(1,   'rgba(200,220,255,0)');
    ctx.fillStyle = iceN;
    ctx.fillRect(0, 0, 2048, 130);

    // Ocean shimmer streaks
    ctx.strokeStyle = 'rgba(150,190,255,0.06)';
    ctx.lineWidth = 3;
    for (let i = 0; i < 18; i++) {
      ctx.beginPath();
      ctx.moveTo(0, 100 + i * 55);
      for (let x = 0; x < 2048; x += 8)
        ctx.lineTo(x, 100 + i * 55 + Math.sin(x * 0.012 + i) * 6);
      ctx.stroke();
    }

    return new THREE.CanvasTexture(c);
  }

  function createCloudTexture() {
    const c = document.createElement('canvas');
    c.width = 2048; c.height = 1024;
    const ctx = c.getContext('2d');
    ctx.clearRect(0, 0, 2048, 1024);

    // Deterministic pseudo-random
    const rng = (n) => (Math.sin(n * 127.1 + 311.7) * 43758.5453) % 1;
    const abs = (n) => Math.abs(rng(n));

    // Large cloud systems
    for (let i = 0; i < 120; i++) {
      const x  = abs(i * 5)    * 2048;
      const y  = abs(i * 5+1)  * 1024;
      const rx = 30 + abs(i * 5+2) * 180;
      const ry = 12 + abs(i * 5+3) * 55;
      const a  = 0.12 + abs(i * 5+4) * 0.5;
      const rot = abs(i * 3) * Math.PI;
      const g = ctx.createRadialGradient(x, y, 0, x, y, rx);
      g.addColorStop(0,   `rgba(255,255,255,${a})`);
      g.addColorStop(0.4, `rgba(255,255,255,${a * 0.7})`);
      g.addColorStop(1,   'rgba(255,255,255,0)');
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rot);
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
    return new THREE.CanvasTexture(c);
  }

  function createOceanRoughnessTexture() {
    // Roughness map: oceans smoother (dark), land rougher (bright)
    const c = document.createElement('canvas');
    c.width = 512; c.height = 256;
    const ctx = c.getContext('2d');
    ctx.fillStyle = '#1a1a1a'; // ocean = low roughness
    ctx.fillRect(0, 0, 512, 256);
    // Land blobs (same rough positions, scaled down)
    const lands = [
      [78, 60, 42, 35], [105, 138, 24, 42], [238, 55, 25, 20],
      [242, 113, 30, 48], [320, 55, 73, 40], [185, 170, 16, 11],
      [373, 170, 31, 23], [372, 90, 7, 11],
    ];
    ctx.fillStyle = '#888';
    lands.forEach(([x, y, rx, ry]) => {
      ctx.beginPath(); ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2); ctx.fill();
    });
    return new THREE.CanvasTexture(c);
  }

  // ── Fallback planet build ───────────────────────────────────────────────
  // Note: lighting + tone mapping have already been applied before loader.load()
  // is called, so createFallbackPlanet only needs to build geometry.
  function createFallbackPlanet() {
    const group = new THREE.Group();

    const earthTex = createEarthTexture();
    earthTex.colorSpace = THREE.SRGBColorSpace;

    const roughTex = createOceanRoughnessTexture();

    const earth = new THREE.Mesh(
      new THREE.SphereGeometry(1.5, 128, 128),
      new THREE.MeshStandardMaterial({
        map: earthTex,
        roughnessMap: roughTex,
        roughness: 0.75,
        metalness: 0.04,
      })
    );
    earth.rotation.z = THREE.MathUtils.degToRad(23.5);
    group.add(earth);

    // Clouds
    const cloudTex = createCloudTexture();
    cloudTex.colorSpace = THREE.SRGBColorSpace;
    const clouds = new THREE.Mesh(
      new THREE.SphereGeometry(1.53, 128, 128),
      new THREE.MeshStandardMaterial({
        map: cloudTex,
        alphaMap: cloudTex,
        transparent: true,
        opacity: 1.0,
        roughness: 1.0,
        metalness: 0.0,
        depthWrite: false,
      })
    );
    clouds.rotation.z = THREE.MathUtils.degToRad(23.5);
    group.add(clouds);

    // Thin atmosphere shell
    const atmoMat = new THREE.MeshStandardMaterial({
      color: 0x4488ff,
      transparent: true,
      opacity: 0.07,
      roughness: 1.0,
      metalness: 0.0,
      side: THREE.FrontSide,
      depthWrite: false,
    });
    group.add(new THREE.Mesh(new THREE.SphereGeometry(1.56, 64, 64), atmoMat));

    addAtmosphereHalo(group, 1.5, true /* isEarth */);

    modelGroup = group;
    scene.add(modelGroup);

    // Independent cloud drift
    (function driftClouds() {
      requestAnimationFrame(driftClouds);
      clouds.rotation.y += 0.00025;
    })();
  }

  // ── Load random planet model ────────────────────────────────────────────
  const isEarth = randomModel.includes('Earth');

  // Apply the right lighting rig immediately so scene is ready when model arrives
  if (isEarth) {
    applyEarthLighting();
    // tone mapping + exposure set inside applyEarthLighting()
  } else {
    applyGenericLighting();
    renderer.toneMappingExposure = 0.85;
  }

  console.log(`Loading planet: ${randomModel}`);
  loader.load(
    randomModel,
    (gltf) => {
      modelGroup = gltf.scene;

      modelGroup.traverse((child) => {
        if (!child.isMesh) return;
        const mats = Array.isArray(child.material) ? child.material : [child.material];
        mats.forEach(mat => {
          if (isEarth) {
            // Earth: vivid, slightly glossy oceans, clean colours
            if (mat.roughness !== undefined) mat.roughness = Math.max(0.18, mat.roughness * 0.7);
            if (mat.metalness !== undefined) mat.metalness = Math.min(0.02, mat.metalness);
          } else {
            // Other planets: keep the GLB's own PBR values, just clamp extremes
            if (mat.roughness  !== undefined) mat.roughness  = Math.max(0.25, mat.roughness);
            if (mat.metalness  !== undefined) mat.metalness  = Math.min(0.05, mat.metalness);
          }
          // Preserve city-lights emissive if the GLB has one, otherwise zero it
          if (!mat.emissiveMap) {
            mat.emissive          = new THREE.Color(0x000000);
            mat.emissiveIntensity = 0;
          } else {
            mat.emissiveIntensity = isEarth ? 0.8 : 0.6;
          }
          mat.needsUpdate = true;
        });
      });

      // Fit to scene
      const box    = new THREE.Box3().setFromObject(modelGroup);
      const size   = box.getSize(new THREE.Vector3());
      const center = box.getCenter(new THREE.Vector3());
      const scale  = 4.0 / Math.max(size.x, size.y, size.z);
      modelGroup.scale.setScalar(scale);
      modelGroup.position.set(-center.x * scale, -center.y * scale, -center.z * scale);

      addAtmosphereHalo(modelGroup, 2.0, isEarth);
      scene.add(modelGroup);
    },
    (progress) => {
      if (progress.total > 0)
        console.log(`Loading ${randomModel}: ${Math.round(progress.loaded / progress.total * 100)}%`);
    },
    (error) => {
      console.warn(`${randomModel} failed – using procedural fallback.`, error);
      if (!modelGroup) createFallbackPlanet();
    }
  );

  // ── Render loop ─────────────────────────────────────────────────────────
  function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
  }
  animate();

  function resize() {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    if (w <= 0 || h <= 0) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  resize();
  window.addEventListener('resize', resize);
}
