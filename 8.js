import { OrbitControls } from "https://cdn.jsdelivr.net/npm/three@0.121.1/examples/jsm/controls/OrbitControls.js";

const canvas = document.querySelector(".webgl");

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

let transitionHappening = false;
let offset = 0;

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

//clouds

let makeClouds = () => {
  let clouds = new THREE.Group();

  let cloudPositions = [
    { x: -15, y: 7, z: -15 },
    { x: 5, y: 5, z: -14 },
  ];

  let cloudMaterial = new THREE.MeshBasicMaterial({ color: "white" });
  let cloudGeometry = new THREE.BoxGeometry(1, 1, 1);

  for (let i = 0; i < 2; i++) {
    let cloud = new THREE.Group();
    for (let j = 0; j < 8; j++) {
      let cubeMesh = new THREE.Mesh(cloudGeometry, cloudMaterial);
      cubeMesh.rotation.x = (Math.random() * Math.PI) / 2;
      cubeMesh.rotation.y = (Math.random() * Math.PI) / 2;
      cubeMesh.rotation.z = (Math.random() * Math.PI) / 2;
      cubeMesh.position.x = j - Math.random() * 0.1;
      let scaleRandom = Math.random();
      cubeMesh.scale.set(scaleRandom, scaleRandom, scaleRandom);
      cloud.add(cubeMesh);
    }
    cloud.position.set(
      cloudPositions[i].x,
      cloudPositions[i].y,
      cloudPositions[i].z
    );
    clouds.add(cloud);
  }
  return clouds;
};
let clouds = makeClouds();
scene.add(clouds);

// particles

let bgParticlesGeometry = new THREE.BufferGeometry();
let count = 1500;

let positions = new Float32Array(count * 3);

for (let i = 0; i < count * 3; i++) {
  positions[i] = (Math.random() - 0.5) * 15;
}

bgParticlesGeometry.setAttribute(
  "position",
  new THREE.BufferAttribute(positions, 3)
);

let bgParticlesMaterial = new THREE.PointsMaterial();

bgParticlesMaterial.size = 0.15;
bgParticlesMaterial.sizeAttenuation = true;
bgParticlesMaterial.transparent = true;
bgParticlesMaterial.alphaMap = particlesTexture;
bgParticlesMaterial.depthWrite = false;
bgParticlesMaterial.color = new THREE.Color("white");

let bgParticles = new THREE.Points(bgParticlesGeometry, bgParticlesMaterial);

scene.add(bgParticles);

//light

const directionalLight = new THREE.DirectionalLight(0xff0000, 1);
directionalLight.position.x = -5;
scene.add(directionalLight);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const hemisphereLight = new THREE.HemisphereLight(0x0000ff, 0x00ff00, 1);
scene.add(hemisphereLight);

// animation based on mouse movement

let mouseX = 0;
let mouseY = 0;
let targetX = 0;
let targetY = 0;

const windowX = window.innerWidth / 2;
const windowY = window.innerHeight / 2;

let onDocumentMouseMove = (event) => {
  mouseX = event.clientX - windowX;
  mouseY = event.clientY - windowY;
};
document.addEventListener("mousemove", onDocumentMouseMove);

// scene change based on scroll/button 6

// let viewNum = 0;
// document.getElementById("next-view").addEventListener("click", (e) => {
//   viewNum = (viewNum + 1) % 5;
//   switchAnimation();
// });

// document.getElementById("prev-view").addEventListener("click", (e) => {
//   viewNum = viewNum > 0 ? Math.abs((viewNum - 1) % 5) : -1;
//   if (viewNum != -1) {
//     switchAnimation();
//   } else {
//     viewNum = 0;
//   }
// });

let viewNum = 0;
document.getElementById("next-view").addEventListener("click", (e) => {
  if (viewNum < 4) {
    viewNum = viewNum + 1;
    switchAnimation();
  } else {
    viewNum = 4;
  }
});

document.getElementById("prev-view").addEventListener("click", (e) => {
  if (viewNum > 0) {
    viewNum = viewNum - 1;
    switchAnimation();
  } else {
    viewNum = 0;
  }
});

let scrollPercent = 0;

document.body.onscroll = () => {
  //calculate the current scroll progress as a percentage
  scrollPercent =
    ((document.documentElement.scrollTop || document.body.scrollTop) /
      ((document.documentElement.scrollHeight || document.body.scrollHeight) -
        document.documentElement.clientHeight)) *
    100;
};

// different animation view

let animateView0 = () => {
  gsap.to(camera.position, { y: 1, x: 0, z: 7 });
  camera.rotation.set(0, 0, 0);
  setTimeout(() => {
    innerObject.geometry = new THREE.IcosahedronGeometry(1, 1);
    gsap.to(innerObject.scale, { x: 1, y: 1, z: 1, duration: 1 });
    gsap.to(camera.position, { x: -2 });
    transitionHappening = false;
  }, 1000);
  gsap.to(innerObject.scale, { x: 0, y: 0, z: 0, duration: 1 });
};

let animateView1 = () => {
  transitionHappening = true;
  gsap.to(camera.position, { y: 8, x: 1, z: 0 });

  gsap.to(camera.position, { y: 5, x: 0, z: 3, delay: 1, duration: 1 });

  setTimeout(() => {
    innerObject.geometry = new THREE.TorusGeometry(0.75, 0.2, 16, 100);

    gsap.to(innerObject.scale, { x: 1, y: 1, z: 1, duration: 1 });
  }, 1000);
  gsap.to(innerObject.scale, { x: 0, y: 0, z: 0, duration: 1 });
};

let animateView2 = () => {
  transitionHappening = true;
  gsap.to(camera.position, { y: 5, x: 0, z: -6 });
  gsap.to(camera.position, { y: 1, x: 0, z: -3, delay: 1, duration: 1 });

  setTimeout(() => {
    innerObject.geometry = new THREE.SphereGeometry(
      1,
      4,
      9,
      0,
      Math.PI * 2,
      Math.PI * 2,
      Math.PI * 2
    );

    gsap.to(innerObject.scale, { x: 1, y: 1, z: 1, duration: 1 });
  }, 1000);
  gsap.to(innerObject.scale, { x: 0, y: 0, z: 0, duration: 1 });
};

let animateView3 = () => {
  transitionHappening = true;
  gsap.to(camera.position, { y: 2, x: -1.3, z: 2 });
  gsap.to(camera.position, { y: 1, x: -2, z: 5, delay: 1, duration: 1 });

  setTimeout(() => {
    innerObject.geometry = new THREE.OctahedronGeometry(1, 1);

    gsap.to(innerObject.scale, { x: 1, y: 1, z: 1, duration: 1 });
  }, 1000);
  gsap.to(innerObject.scale, { x: 0, y: 0, z: 0, duration: 1 });
};

let animateView4 = () => {
  gsap.to(camera.position, { y: 1, x: 0, z: 7 });

  setTimeout(() => {
    innerObject.geometry = new THREE.IcosahedronGeometry(1, 1);

    gsap.to(innerObject.scale, { x: 1, y: 1, z: 1, duration: 1 });

    transitionHappening = false;

    gsap.to(camera.position, { y: 1, x: 2 - offset, z: 7 });
  }, 1500);
  gsap.to(innerObject.scale, { x: 0, y: 0, z: 0, duration: 1 });
};

// switch animation view

let switchAnimation = () => {
  if (viewNum == 0) {
    console.log(viewNum);
    animateView0();
  } else if (viewNum == 1) {
    console.log(viewNum);
    animateView1();
  } else if (viewNum == 2) {
    console.log(viewNum);
    animateView2();
  } else if (viewNum == 3) {
    console.log(viewNum);
    animateView3();
  } else if (viewNum == 4) {
    console.log(viewNum);
    animateView4();
  }
};

//animate

const clock = new THREE.Clock();
let rotationMode = true;

let animate = () => {
  let elapsedTime = clock.getElapsedTime();

  //default animation

  //main object rotation

  mainObject.position.y = (1 + Math.sin(elapsedTime)) * 0.25;

  let factor = 1 * mainObject.position.y;
  if (mainObject.position.y > 0.5) {
    factor += 0.1;
  }
  if (mainObject.position.y <= 0.000008) {
    rotationMode = !rotationMode;
  }
  if (rotationMode) {
    innerObject.rotation.y += factor * 5 * 0.05;
    outerObject.rotation.z += -1 * factor * 0.1;
    outerObject.rotation.y += -1 * factor * 0.1;
  } else {
    innerObject.rotation.y -= factor * 5 * 0.05;
    outerObject.rotation.z -= -1 * factor * 0.1;
    outerObject.rotation.y -= -1 * factor * 0.1;
  }
  //transition happening

  if (transitionHappening) {
    camera.lookAt(mainObject.position);
  }

  //cloud animation
  clouds.position.x = Math.sin(elapsedTime * 0.5);
  clouds.position.z = Math.cos(elapsedTime * 0.1);

  //shadow animation
  mainObjectShadow.material.opacity = 0.7 - mainObject.position.y;

  // particles rotation

  bgParticles.rotation.z += 0.005;
  bgParticles.rotation.x += 0.005;

  targetX = mouseX * 0.001;
  targetY = mouseY * 0.001;
  bgParticles.rotation.y += 0.5 * (targetX - bgParticles.rotation.y);

  renderer.render(scene, camera);
  requestAnimationFrame(animate);
};

let listenScroll = () => {
  if (scrollPercent > 0 && scrollPercent < 15 && viewNum != 0) {
    viewNum = 0;
    switchAnimation();
  } else if (scrollPercent > 20 && scrollPercent < 35 && viewNum != 1) {
    viewNum = 1;
    switchAnimation();
  } else if (scrollPercent > 45 && scrollPercent < 60 && viewNum != 2) {
    viewNum = 2;
    switchAnimation();
  } else if (scrollPercent > 60 && scrollPercent < 80 && viewNum != 3) {
    viewNum = 3;
    switchAnimation();
  } else if (scrollPercent > 85 && scrollPercent < 100 && viewNum != 4) {
    viewNum = 4;
    switchAnimation();
  }
};

setInterval(() => {
  listenScroll();
}, 500);

animate();
