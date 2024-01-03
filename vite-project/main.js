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
const geometry = new THREE.TorusGeometry(10, 3, 16, 100);
const material = new THREE.MeshStandardMaterial({ color: 0xff6347 });
const torus = new THREE.Mesh(geometry, material);
scene.add(torus);

// Lights
const pointLight = new THREE.PointLight(0xffffff, 100.0);
pointLight.position.set(10, 1, 5);
const ambientLight = new THREE.AmbientLight(0xffffff);
scene.add(pointLight, ambientLight);

// const lightHelper = new THREE.PointLightHelper(pointLight)
const gridHelper = new THREE.GridHelper(200, 50);
scene.add(gridHelper)

// Orbit controls
const controls = new OrbitControls(camera, renderer.domElement);

// Adding random points (stars)
function addStar() {
  const geometry = new THREE.SphereGeometry(0.1, 100, 100);
  const material = new THREE.MeshStandardMaterial({ color: 0xffffff });
  const star = new THREE.Mesh(geometry, material);

  const [x, y, z] = Array(3)
    .fill()
    .map(() => THREE.MathUtils.randFloatSpread(100));

  star.position.set(x, y, z);
  scene.add(star);
}

Array(200).fill().forEach(addStar);

// Background
const targetAspect = window.innerWidth / window.innerHeight;
const imageAspect = 3840 / 2160;
const factor = imageAspect / targetAspect;
// When factor larger than 1, that means texture 'wilder' than target。 
// we should scale texture height to target height and then 'map' the center  of texture to target， and vice versa.
const spaceTexture = new THREE.TextureLoader().load('/earth_render_4k.png');
scene.background = spaceTexture;
scene.background.offset.x = factor > 1 ? (1 - 1 / factor) / 2 : 0;
scene.background.repeat.x = factor > 1 ? 1 / factor : 1;
scene.background.offset.y = factor > 1 ? 0 : (1 - factor) / 2;
scene.background.repeat.y = factor > 1 ? 1 : factor;


// Animation Loop
function animate() {
  requestAnimationFrame(animate);
  torus.rotation.x += 0.01;
  torus.rotation.y += 0.005;
  torus.rotation.z += 0.01;

  controls.update();
  renderer.render(scene, camera);
}

animate();

