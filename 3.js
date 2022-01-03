import { OrbitControls } from "https://cdn.jsdelivr.net/npm/three@0.121.1/examples/jsm/controls/OrbitControls.js";

const canvas = document.querySelector(".webgl");

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

//textures

let textureLoader = new THREE.TextureLoader();
let shadowTexture = textureLoader.load("./textures/simpleShadow.jpg");
let particlesTexture = textureLoader.load("./textures/star_01.png");
//renderer

const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  alpha: true,
});
renderer.setSize(sizes.width, sizes.height);

//scene

const scene = new THREE.Scene();
scene.background;

//camera
//fov aspects ratio near far
const camera = new THREE.PerspectiveCamera(
  45,
  sizes.width / sizes.height,
  0.1,
  100
);

camera.position.z = 7;
camera.position.x = -2;

//Element
let innerObjectGeometry = new THREE.IcosahedronGeometry(1, 1);
let outerObjectGeometry = new THREE.IcosahedronGeometry(1, 1);

let innerObjectMaterial = new THREE.MeshStandardMaterial({
  color: 0xffffff,
  flatShading: true,
});

let outerObjectMaterial = new THREE.MeshStandardMaterial({
  color: 0xffffff,
  wireframe: true,
  side: THREE.DoubleSide,
});

let innerObject = new THREE.Mesh(innerObjectGeometry, innerObjectMaterial);
let outerObject = new THREE.Mesh(outerObjectGeometry, outerObjectMaterial);

outerObject.scale.set(0, 0, 0);
setTimeout(() => {
  gsap.to(outerObject.scale, { x: 1.25, y: 1.25, z: 1.25, duration: 1 });
}, 2500);

gsap.to(outerObject.scale, { x: 1.75, y: 1.75, z: 1.75, duration: 2.5 });

let mainObject = new THREE.Group();
mainObject.add(innerObject);
mainObject.add(outerObject);

scene.add(mainObject);

// plane

const geometry = new THREE.PlaneGeometry(100, 15);
const material = new THREE.MeshBasicMaterial({
  color: 0x222222,
  side: THREE.DoubleSide,
  transparent: true,
});
const plane = new THREE.Mesh(geometry, material);
plane.rotation.x = Math.PI / 2;
plane.position.y = -1.5;
plane.position.z = 0;

scene.add(plane);

// shadow

const mainObjectShadow = new THREE.Mesh(
  new THREE.PlaneGeometry(1.5, 1.5),
  new THREE.MeshBasicMaterial({
    color: 0x000000,
    transparent: true,
    opacity: 1,
    alphaMap: shadowTexture,
  })
);
mainObjectShadow.rotation.x = -Math.PI * 0.5;
mainObjectShadow.position.y = plane.position.y + 0.02;
// mainObjectShadow.position.x = 0;
scene.add(mainObjectShadow);

//light

const directionalLight = new THREE.DirectionalLight(0xff0000, 1);
directionalLight.position.x = -5;
scene.add(directionalLight);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const hemisphereLight = new THREE.HemisphereLight(0x0000ff, 0x00ff00, 1);
scene.add(hemisphereLight);

//animate

const clock = new THREE.Clock();

let animate = () => {
  let elapsedTime = clock.getElapsedTime();
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
};

animate();
