import { OrbitControls } from "https://cdn.jsdelivr.net/npm/three@0.121.1/examples/jsm/controls/OrbitControls.js";

const canvas = document.querySelector(".webgl");

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

//renderer

const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  alpha: true,
});
renderer.setSize(sizes.width, sizes.height);

//scene

const scene = new THREE.Scene();

//camera
//fov aspects ratio near far
const camera = new THREE.PerspectiveCamera(
  45,
  sizes.width / sizes.height,
  0.1,
  100
);

camera.position.z = 7;

//Element
let objectGeometry = new THREE.IcosahedronGeometry(1, 1);

let objectMaterial = new THREE.MeshStandardMaterial({
  color: 0xff0000,
});

let object = new THREE.Mesh(objectGeometry, objectMaterial);
scene.add(object);

//light

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

renderer.render(scene, camera);
