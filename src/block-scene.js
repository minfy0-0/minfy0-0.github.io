import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';

const root = document.querySelector('[data-block-hero]');
if (root) initialize(root);

function initialize(root) {
  const stage = root.querySelector('[data-block-stage]');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'low-power' });
  } catch {
    // The illustrated bridge and the complete introduction remain usable without WebGL.
    return;
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.15;
  renderer.setClearColor(0x000000, 0);
  renderer.domElement.setAttribute('role', 'button');
  renderer.domElement.setAttribute('aria-describedby', 'block-hint');
  renderer.domElement.tabIndex = 0;
  stage.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-6, 6, 5, -5, 0.1, 100);
  camera.position.set(10, 9.5, 13);
  camera.lookAt(0, 1.6, 0);
  const sculpture = new THREE.Group();
  scene.add(sculpture);
  scene.add(new THREE.HemisphereLight(0xffffff, 0xc3c4b6, 2.4));
  const key = new THREE.DirectionalLight(0xfff4df, 4.6);
  key.position.set(-5, 10, 6);
  key.castShadow = true;
  key.shadow.mapSize.set(2048, 2048);
  Object.assign(key.shadow.camera, { left: -9, right: 9, top: 9, bottom: -9, near: 0.5, far: 30 });
  key.shadow.normalBias = 0.035;
  key.shadow.bias = -0.00008;
  key.shadow.radius = 4;
  scene.add(key);
  const fill = new THREE.DirectionalLight(0xdfe8ff, 1.4);
  fill.position.set(6, 4, -6);
  scene.add(fill);
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(80, 80), new THREE.ShadowMaterial({ color: 0x6d715f, opacity: 0.17 }));
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = -0.045;
  floor.receiveShadow = true;
  scene.add(floor);

  const palette = { blue: 0x3453d6, yellow: 0xf6bc30, coral: 0xe2644e, mint: 0x7da899, cream: 0xe8e5d8 };
  const materials = Object.fromEntries(Object.entries(palette).map(([name, color]) => [name, new THREE.MeshStandardMaterial({ color, metalness: 0, roughness: 0.31 })]));
  const unit = 0.66;
  const studProfile = [new THREE.Vector2(0,0), new THREE.Vector2(.224,0), new THREE.Vector2(.245,.018), new THREE.Vector2(.245,.135), new THREE.Vector2(.23,.16), new THREE.Vector2(0,.16)];
  const studGeometry = new THREE.LatheGeometry(studProfile, 28);
  const specs = [
    [2,2,'blue'], [2,2,'coral'], [2,2,'cream'], [2,2,'mint'],
    [8,2,'yellow'], [4,2,'blue'], [2,2,'coral'], [2,2,'cream'],
    [4,2,'mint'], [2,2,'yellow'],
  ];
  const bricks = specs.map(([columns, rows, color]) => {
    const group = new THREE.Group();
    const body = new THREE.Mesh(new RoundedBoxGeometry(columns*unit-.035, .72, rows*unit-.035, 3, .055), materials[color]);
    body.castShadow = body.receiveShadow = true;
    group.add(body);
    for (let x=0; x<columns; x++) for (let z=0; z<rows; z++) {
      const stud = new THREE.Mesh(studGeometry, materials[color]);
      stud.position.set((x-(columns-1)/2)*unit, .36, (z-(rows-1)/2)*unit);
      stud.castShadow = stud.receiveShadow = true;
      group.add(stud);
    }
    sculpture.add(group);
    return group;
  });

  // x, body-center height, z, yaw. All arrangements reuse exactly the same ten pieces.
  const layouts = [
    [
      [-1.98,.36,0,0], [1.98,.36,0,0], [-1.98,1.12,0,0], [1.98,1.12,0,0],
      [0,1.88,0,0], [-.66,2.64,0,0], [0,3.40,0,0], [1.32,2.64,0,0],
      [-2.7,.36,2.3,-.25], [2.6,.36,2.25,.28],
    ],
    [
      [-2.2,.36,0,0], [2.2,.36,0,0], [-2.2,1.12,0,0], [2.2,1.12,0,0],
      [0,.36,-1.75,0], [-1.65,1.88,0,0], [2.2,1.88,0,0], [2.2,2.64,0,0],
      [0,.36,2.1,0], [0,.36,.15,.08],
    ],
    [
      [-1.98,1.12,0,0], [1.98,1.12,0,0], [-.66,1.12,0,0], [.66,1.12,0,0],
      [0,.36,0,0], [.66,1.88,0,0], [1.32,2.64,0,0], [1.32,3.40,0,0],
      [-2.3,.36,2.2,-.35], [2.7,.36,1.9,.2],
    ],
  ];
  const hint = root.querySelector('.assembly-hint');
  const shapeNames = ['다리', '열린 공간', '계단'];
  function describe(index) {
    renderer.domElement.setAttribute('aria-label', `${shapeNames[index]} 모양 블록. Enter 또는 스페이스로 조합 변경, 좌우 방향키로 회전`);
  }
  let selected = 0;
  let transition = null;
  let frame = null;
  let visible = true;
  let lost = false;
  let desiredRotation = -.12;
  sculpture.rotation.y = desiredRotation;
  let drag = null;

  function snap(index) {
    bricks.forEach((brick,i) => {
      const [x,y,z,yaw] = layouts[index][i];
      brick.position.set(x,y,z);
      brick.rotation.y = yaw;
    });
  }
  function draw(now) {
    frame = null;
    if (!visible || document.hidden || lost) return;
    let animating = false;
    if (transition) {
      const raw = Math.min(1, (now-transition.time)/1050);
      const eased = raw < .5 ? 4*raw*raw*raw : 1-Math.pow(-2*raw+2,3)/2;
      bricks.forEach((brick,i) => {
        const from = transition.from[i];
        const to = layouts[selected][i];
        const lift = Math.sin(Math.PI*raw)*(.7+i*.06);
        brick.position.set(THREE.MathUtils.lerp(from[0],to[0],eased), THREE.MathUtils.lerp(from[1],to[1],eased)+lift, THREE.MathUtils.lerp(from[2],to[2],eased));
        brick.rotation.y = THREE.MathUtils.lerp(from[3],to[3],eased);
      });
      if (raw >= 1) transition = null;
      else animating = true;
    }
    const delta = desiredRotation-sculpture.rotation.y;
    if (Math.abs(delta)>.001) {
      sculpture.rotation.y += reducedMotion.matches ? delta : delta*.15;
      animating = !reducedMotion.matches || animating;
    }
    renderer.render(scene,camera);
    if (animating) requestDraw();
  }
  function requestDraw() {
    if (frame===null && visible && !document.hidden && !lost) frame=requestAnimationFrame(draw);
  }
  function select(index) {
    if (index===selected) return;
    selected=index;
    if (reducedMotion.matches) { transition=null; snap(index); }
    else transition={time:performance.now(), from:bricks.map(b=>[b.position.x,b.position.y,b.position.z,b.rotation.y])};
    describe(index);
    requestDraw();
  }
  const raycaster = new THREE.Raycaster();
  function hitBlock(event) {
    const bounds=renderer.domElement.getBoundingClientRect();
    const pointer=new THREE.Vector2((event.clientX-bounds.left)/bounds.width*2-1, -(event.clientY-bounds.top)/bounds.height*2+1);
    raycaster.setFromCamera(pointer,camera);
    return raycaster.intersectObjects(bricks,true).length>0;
  }
  renderer.domElement.addEventListener('keydown', event=>{
    if (event.key==='ArrowLeft' || event.key==='ArrowRight') {
      event.preventDefault();desiredRotation+=(event.key==='ArrowLeft'?-1:1)*Math.PI/6;requestDraw();
    } else if(event.key==='Enter' || event.key===' ') {
      event.preventDefault();select((selected+1)%layouts.length);
    }
  });
  renderer.domElement.addEventListener('pointerdown',event=>{
    if (event.pointerType==='mouse' && event.button!==0) return;
    drag={id:event.pointerId,x:event.clientX,y:event.clientY,distance:0};
    renderer.domElement.focus({preventScroll:true});
    renderer.domElement.setPointerCapture(event.pointerId);
  });
  renderer.domElement.addEventListener('pointermove',event=>{
    if (!drag || event.pointerId!==drag.id) return;
    drag.distance+=Math.hypot(event.clientX-drag.x,event.clientY-drag.y);
    desiredRotation+=(event.clientX-drag.x)*.009;drag.x=event.clientX;drag.y=event.clientY;requestDraw();
  });
  const endDrag=()=>{drag=null;};
  renderer.domElement.addEventListener('pointerup',event=>{
    if(drag && event.pointerId===drag.id && drag.distance<8 && hitBlock(event))select((selected+1)%layouts.length);
    endDrag();
  });
  renderer.domElement.addEventListener('pointercancel',endDrag);
  renderer.domElement.addEventListener('lostpointercapture',endDrag);
  renderer.domElement.addEventListener('webglcontextlost',event=>{
    event.preventDefault();lost=true;
    if(frame!==null)cancelAnimationFrame(frame);frame=null;
    root.classList.remove('is-3d-ready');
    renderer.domElement.tabIndex=-1;renderer.domElement.setAttribute('aria-hidden','true');hint.hidden=true;
  });
  renderer.domElement.addEventListener('webglcontextrestored',()=>{
    lost=false;selected=0;transition=null;snap(0);
    root.classList.add('is-3d-ready');renderer.domElement.tabIndex=0;renderer.domElement.removeAttribute('aria-hidden');hint.hidden=false;describe(0);requestDraw();
  });
  function resize() {
    const {width,height}=stage.getBoundingClientRect();
    if(!width || !height)return;
    renderer.setSize(width,height,false);
    const aspect=width/height;
    const halfWidth=4.95;
    const halfHeight=halfWidth/aspect;
    camera.left=-halfWidth;camera.right=halfWidth;camera.top=halfHeight;camera.bottom=-halfHeight;
    camera.updateProjectionMatrix();requestDraw();
  }
  const observer=new ResizeObserver(resize);observer.observe(stage);
  const intersection=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;if(visible)requestDraw();},{rootMargin:'80px'});intersection.observe(root);
  document.addEventListener('visibilitychange',requestDraw);
  reducedMotion.addEventListener('change',()=>{if(reducedMotion.matches){transition=null;snap(selected);sculpture.rotation.y=desiredRotation;}requestDraw();});
  snap(0);resize();
  renderer.render(scene,camera);
  hint.hidden=false;describe(0);
  root.classList.add('is-3d-ready');
}
