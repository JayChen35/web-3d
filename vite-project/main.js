import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

// Setup always requires a scene, camera, and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({
  antialias: true,
  canvas: document.querySelector('#bg'),
});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(30);
camera.position.setX(-3);
// Render the scene and camera!
renderer.render(scene, camera);


// Add torus geometry
// Translation (axes): y axis is upward, z axis is backward, and x axis is to the right
const geometry = new THREE.TorusKnotGeometry(6, 1.5, 92, 7);
const material = new THREE.MeshStandardMaterial({ 
  color: 0x666162, 
  wireframe: true,
  blendAlpha: true,
  roughness: 0.4,
  metalness: 1,
});
const torus = new THREE.Mesh(geometry, material);
// torus.translateZ(-30); torus.translateX(-10);
scene.add(torus);

// Lights
const pointLight = new THREE.PointLight(0xffffff, 3000.0);
pointLight.position.set(-10, 30, -25);
const ambientLight = new THREE.AmbientLight(0xffffff, 2.0);
scene.add(pointLight, ambientLight);

const lightHelper = new THREE.PointLightHelper(pointLight)
// const gridHelper = new THREE.GridHelper(200, 50);
scene.add(lightHelper)

// Orbit controls
// const controls = new OrbitControls(camera, renderer.domElement);

// Adding random points (stars)
function addStar() {
  const geometry = new THREE.SphereGeometry(0.1, 100, 100);
  const material = new THREE.MeshStandardMaterial({ color: 0xffffff });
  const star = new THREE.Mesh(geometry, material);

  const [x, y, z] = Array(3)
    .fill()
    .map(() => THREE.MathUtils.randFloatSpread(150));

  star.position.set(x, y, z);
  scene.add(star);
}

Array(300).fill().forEach(addStar);

// Background
// const targetAspect = window.innerWidth / window.innerHeight;
// const imageAspect = 3840 / 2160;
// const factor = imageAspect / targetAspect;
// When factor larger than 1, that means texture 'wilder' than target。 
// we should scale texture height to target height and then 'map' the center  of texture to target， and vice versa.
const spaceTexture = new THREE.TextureLoader().load('/earth_render_4k.png');
spaceTexture.colorSpace = THREE.SRGBColorSpace;
const space = new THREE.Mesh(
  new THREE.BoxGeometry(196,132,1),
  new THREE.MeshStandardMaterial({ map: spaceTexture })
);
space.translateZ(-200); space.translateX(-110);
space.rotateY(Math.PI/6);
scene.add(space);
// scene.background = spaceTexture;
// scene.background.colorSpace = THREE.SRGBColorSpace;
// scene.background.offset.x = factor > 1 ? (1 - 1 / factor) / 2 : 0;
// scene.background.repeat.x = factor > 1 ? 1 / factor : 1;
// scene.background.offset.y = factor > 1 ? 0 : (1 - factor) / 2;
// scene.background.repeat.y = factor > 1 ? 1 : factor;


function moveCamera() {
  const t = document.body.getBoundingClientRect().top;

  camera.position.z = t * -0.01;
  // camera.position.x = t * -0.0001;
  // camera.rotation.y = t * -0.0001;
  torus.position.x = -20 + t * 0.07;
  torus.position.y = -5 + t * 0.02;
  torus.position.z = -40 + t * 0.1;
}

document.body.onscroll = moveCamera;
moveCamera();


// Animation Loop
function animate() {
  requestAnimationFrame(animate);
  torus.rotation.x += 0.005;
  // torus.rotation.y += 0.005;
  // torus.rotation.z += 0.01;

  // controls.update();
  renderer.render(scene, camera);
}

animate();

