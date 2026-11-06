import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';

// Decoration only: project content and navigation remain ordinary HTML.
const root = document.querySelector('[data-workbench]');
const stage = root?.querySelector('[data-block-stage]');
if (stage) {
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'low-power' });
    createSculpture(root, stage, renderer);
  } catch {
    renderer?.dispose();
    renderer?.domElement.remove();
    root.classList.remove('is-3d-ready');
  }
}

function createSculpture(root, stage, renderer) {
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
  const canvas = renderer.domElement;
  canvas.setAttribute('aria-hidden', 'true');
  canvas.style.pointerEvents = 'none';
  stage.appendChild(canvas);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.6));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.VSMShadowMap;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.06;

  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-5, 5, 3, -3, .1, 50);
  camera.position.set(0, 8, 18);
  camera.lookAt(0, 2.2, 0);
  scene.fog = new THREE.Fog(0xf4f7fb, 23, 43);
  scene.add(new THREE.HemisphereLight(0xffffff, 0xb7c4dc, 3.1));
  const key = new THREE.DirectionalLight(0xffffff, 2.1);
  key.position.set(-4, 9, 7);
  key.castShadow = true;
  key.shadow.mapSize.set(1536, 1536);
  Object.assign(key.shadow.camera, { left: -6, right: 6, top: 6, bottom: -6, near: .5, far: 25 });
  key.shadow.normalBias = .025;
  key.shadow.bias = -.00008;
  key.shadow.radius = 5;
  key.shadow.blurSamples = 8;
  scene.add(key);
  const fill = new THREE.DirectionalLight(0xe6eeff, .8);
  fill.position.set(5, 4, -5);
  scene.add(fill);

  const exhibition = new THREE.Group();
  scene.add(exhibition);
  const palette = { cobalt: 0x164bfa, deep: 0x1636ae, pale: 0xb6d0ff, white: 0xf8fbff };
  const materials = Object.fromEntries(Object.entries(palette).map(([name, color]) => [name,
    new THREE.MeshPhysicalMaterial({ color, roughness: .32, metalness: 0, clearcoat: .2, clearcoatRoughness: .38 })
  ]));
  const plinthMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: .68 });
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(80, 80), new THREE.ShadowMaterial({ color: 0x71839e, opacity: .065 }));
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = -.018;
  floor.receiveShadow = true;
  scene.add(floor);

  const displays = [];
  function display(width, height, depth, x, z) {
    const group = new THREE.Group();
    const pedestal = new THREE.Mesh(new RoundedBoxGeometry(width, height, depth, 3, .035), plinthMaterial);
    pedestal.position.y = height / 2;
    pedestal.castShadow = pedestal.receiveShadow = true;
    group.add(pedestal);
    const object = new THREE.Group();
    object.position.y = height;
    group.add(object);
    group.position.set(x, 0, z);
    exhibition.add(group);
    displays.push({ group, x, z });
    return object;
  }
  function piece(parent, width, height, depth, color, x, bottom, z = 0, bevel = .045) {
    const object = new THREE.Mesh(new RoundedBoxGeometry(width, height, depth, 4,
      Math.min(bevel, height / 3)), materials[color]);
    object.position.set(x, bottom + height / 2, z);
    object.castShadow = object.receiveShadow = true;
    parent.add(object);
    return object;
  }
  function lPiece(parent, size, depth, color, x, bottom, rotation = 0) {
    const shape = new THREE.Shape();
    const gap = .018;
    shape.moveTo(-size / 2 + gap, gap);
    shape.lineTo(size / 2 - gap, gap);
    shape.lineTo(size / 2 - gap, size / 2 - gap);
    shape.lineTo(gap, size / 2 - gap);
    shape.lineTo(gap, size - gap);
    shape.lineTo(-size / 2 + gap, size - gap);
    shape.closePath();
    const geometry = new THREE.ExtrudeGeometry(shape, { depth: depth - .07, bevelEnabled: true,
      bevelSize: .025, bevelThickness: .025, bevelSegments: 3, curveSegments: 12 });
    geometry.translate(0, -size / 2, -depth / 2 + .035);
    const object = new THREE.Mesh(geometry, materials[color]);
    object.position.set(x, bottom + size / 2, 0);
    object.rotation.z = rotation;
    object.castShadow = object.receiveShadow = true;
    parent.add(object);
    return object;
  }
  function cylinder(parent, radius, height, color, bottom, thetaStart = 0, thetaLength = Math.PI * 2) {
    const geometry = new THREE.CylinderGeometry(radius, radius, height, 64, 1, false, thetaStart, thetaLength);
    const object = new THREE.Mesh(geometry, materials[color]);
    object.position.y = bottom + height / 2;
    object.castShadow = object.receiveShadow = true;
    parent.add(object);
    return object;
  }

  // Six small exhibitions, each assembled from complementary geometric parts.
  // Pedestal height and depth establish the landscape; the upper center stays empty.
  const leftRear = display(2.22, 2.75, 2.05, -6, -2.1);
  piece(leftRear, 1.64, .28, 1.28, 'deep', 0, 0);
  piece(leftRear, .51, 1.03, 1.28, 'pale', -.555, .3);
  piece(leftRear, .52, 1.03, 1.28, 'cobalt', 0, .3);
  piece(leftRear, .51, 1.03, 1.28, 'deep', .555, .3);
  piece(leftRear, 1.64, .28, 1.28, 'cobalt', 0, 1.35);
  leftRear.rotation.y = -.07;

  const centerRear = display(2.45, 1.12, 2.2, -.15, -2.35);
  lPiece(centerRear, 1.6, 1.42, 'cobalt', 0, 0);
  piece(centerRear, .75, .75, 1.42, 'pale', .415, .825);
  centerRear.rotation.y = -.18;

  const rightRear = display(2.05, 2.1, 1.95, 5.85, -1.7);
  cylinder(rightRear, .73, .22, 'pale', 0);
  cylinder(rightRear, .72, 1.16, 'cobalt', .24, 0, Math.PI);
  cylinder(rightRear, .72, 1.16, 'deep', .24, Math.PI + .025, Math.PI - .025);
  cylinder(rightRear, .73, .22, 'white', 1.42);
  rightRear.rotation.y = -.35;

  const leftFront = display(3.0, .86, 2.4, -3.7, 3.9);
  lPiece(leftFront, 1.84, 1.64, 'deep', 0, 0);
  piece(leftFront, .86, .86, 1.64, 'pale', .475, .95);
  leftFront.rotation.y = .15;

  const rightMiddle = display(2.45, 1.65, 2.15, 3.35, 2.55);
  piece(rightMiddle, .56, 1.7, 1.5, 'pale', -.585, 0);
  piece(rightMiddle, 1.12, .54, 1.5, 'cobalt', .285, 0);
  piece(rightMiddle, .54, 1.12, 1.5, 'deep', .575, .58);
  piece(rightMiddle, .54, .54, 1.5, 'white', 0, .58);
  piece(rightMiddle, .54, .54, 1.5, 'cobalt', 0, 1.16);
  rightMiddle.rotation.y = -.12;

  const centerFront = display(2.18, .26, 1.9, .1, 7.1);
  cylinder(centerFront, .79, .26, 'white', 0);
  cylinder(centerFront, .78, .53, 'cobalt', .29, 0, Math.PI);
  cylinder(centerFront, .78, .53, 'pale', .29, Math.PI + .028, Math.PI - .028);
  cylinder(centerFront, .78, .53, 'deep', .85, .9, Math.PI);
  cylinder(centerFront, .78, .53, 'cobalt', .85, Math.PI + .93, Math.PI - .028);
  cylinder(centerFront, .79, .26, 'pale', 1.41);
  centerFront.rotation.y = .25;

  function arrangeDisplays(aspect) {
    const compact = aspect < .9;
    const positions = [[-1.66, 2.5, .72], [0, 0, 0], [1.62, 3.4, .72],
      [-1.48, 6.15, .75], [0, 0, 0], [1.5, 7.7, .72]];
    displays.forEach((display, index) => {
      const [x, z, scale] = compact ? positions[index] : [display.x, display.z, 1];
      display.group.visible = scale > 0;
      display.group.position.set(x, 0, z);
      display.group.scale.setScalar(scale || 1);
    });
  }

  let frame = null;
  let visible = true;
  let lost = false;
  let desiredYaw = 0;
  let lastTime = 0;
  function requestDraw() {
    if (frame === null && visible && !document.hidden && !lost) frame = requestAnimationFrame(draw);
  }
  function draw(time) {
    frame = null;
    if (!visible || document.hidden || lost) return;
    const delta = desiredYaw - exhibition.rotation.y;
    const elapsed = Math.min(50, lastTime ? time - lastTime : 16);
    lastTime = time;
    const smoothing = 1 - Math.exp(-elapsed / 90);
    exhibition.rotation.y = motion.matches || Math.abs(delta) < .0001
      ? desiredYaw : exhibition.rotation.y + delta * smoothing;
    try {
      renderer.render(scene, camera);
      root.classList.add('is-3d-ready');
    } catch {
      lost = true;
      root.classList.remove('is-3d-ready');
      return;
    }
    if (Math.abs(desiredYaw - exhibition.rotation.y) > .0001) requestDraw();
  }
  function resize() {
    const { width, height } = stage.getBoundingClientRect();
    if (!width || !height || lost) return;
    renderer.setSize(width, height, false);
    const aspect = width / height;
    arrangeDisplays(aspect);
    const halfHeight = aspect < .9 ? 5.25 : 5.15;
    camera.left = -halfHeight * aspect;
    camera.right = halfHeight * aspect;
    camera.top = halfHeight;
    camera.bottom = -halfHeight;
    camera.updateProjectionMatrix();
    requestDraw();
  }
  root.addEventListener('pointermove', event => {
    if (motion.matches || !finePointer.matches || event.pointerType !== 'mouse') return;
    const bounds = root.getBoundingClientRect();
    const horizontal = THREE.MathUtils.clamp((event.clientX - bounds.left) / bounds.width * 2 - 1, -1, 1);
    desiredYaw = horizontal * .045; // At most 2.6 degrees, with no drag or click affordance.
    requestDraw();
  }, { passive: true });
  root.addEventListener('pointerleave', () => { desiredYaw = 0; requestDraw(); });
  motion.addEventListener('change', () => {
    desiredYaw = 0;
    if (motion.matches) exhibition.rotation.y = 0;
    requestDraw();
  });
  canvas.addEventListener('webglcontextlost', event => {
    event.preventDefault();
    lost = true;
    if (frame !== null) cancelAnimationFrame(frame);
    frame = null;
    root.classList.remove('is-3d-ready');
  });
  canvas.addEventListener('webglcontextrestored', () => { lost = false; resize(); });
  new ResizeObserver(resize).observe(stage);
  new IntersectionObserver(entries => {
    visible = entries[0].isIntersecting;
    if (visible) requestDraw();
    else if (frame !== null) { cancelAnimationFrame(frame); frame = null; }
  }, { rootMargin: '80px' }).observe(stage);
  document.addEventListener('visibilitychange', () => {
    if (document.hidden && frame !== null) { cancelAnimationFrame(frame); frame = null; }
    else requestDraw();
  });
  resize();
}
