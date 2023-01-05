import * as THREE from "three";

import {
  OrbitControls
} from "three/addons/OrbitControls.js";


import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { FlyControls } from "three/addons/FlyControls.js";

import Minimap from "./minimap.js";

let currentCamera;
let scene, renderer, orbit;
let miniMap = null;
let cubeMesh = null;
let flyControls = null;
let clock = null;

init();
// render();

function init() {
  const pixelRatio = window.devicePixelRatio;
  {
  const aspect = window.innerWidth / window.innerHeight;

  currentCamera = new THREE.PerspectiveCamera(50, aspect, 0.01, 3000);

  currentCamera.position.set(500, 200, 1000);
  currentCamera.lookAt(500, 200, 1000);
  currentCamera.name = "MainCam";

  scene = new THREE.Scene();
  scene.add(new THREE.GridHelper(1000, 10, 0x888888, 0x444444));


  const light = new THREE.DirectionalLight(0xffffff, 2);
  light.position.set(1, 1, 1);
  scene.add(light);

  renderer = new THREE.WebGLRenderer();
  renderer.setPixelRatio(pixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);
  
  const texture = new THREE.TextureLoader().load("textures/crate.gif");
  texture.anisotropy = renderer.capabilities.getMaxAnisotropy();

  const cubeGeometry = new THREE.BoxGeometry(200, 200, 200);
  // const cubeMaterial = new THREE.MeshBasicMaterial( { color: 0xff0000} );

  const cubeMaterial = new THREE.MeshLambertMaterial({
    map: texture,
    transparent: true
  });
  // Если материал перекрывает точки, то указываем такие значения
  cubeMaterial.polygonOffset = true;
  cubeMaterial.polygonOffsetUnits = 1;
  cubeMaterial.polygonOffsetFactor = 1;

  const sphereGeometry = new THREE.SphereGeometry(100, 32, 16);
  const sphereMaterial = new THREE.MeshBasicMaterial( { color: 0xcccc00} );
  sphereMaterial.polygonOffset = true;
  sphereMaterial.polygonOffsetUnits = 1;
  sphereMaterial.polygonOffsetFactor = 1;

  const loader = new GLTFLoader();
  let car = null;
  // Загружаем модель и добавляем на сцену
  // Потом, если мы хотим ее перемещать, мы должны каждый раз при нажатии
  // на модель создавать бокс (строка 158 для примера). 
  loader.load(`./assets/car2/source/car.glb`, function (object) {
    car = object.scene;
    car.scale.set(200, 200, 200);
    car.position.x = -290;
    car.position.y = 0;
    car.position.z = -320;

    scene.add(car);
    // render();
  }, function (xhr) {
  }, function (error) {
      console.log("error")
  })

  // orbit = new OrbitControls(currentCamera, renderer.domElement);
  // orbit.enableDamping = true;
  // orbit.update();
  // orbit.addEventListener("change", render);

  cubeMesh = new THREE.Mesh(cubeGeometry, cubeMaterial);
  cubeMesh.position.z = 200;
  cubeMesh.rotateX(45 * Math.PI / 180);
  // Добавляем атрибут interactive "true" элементам, которые хотим передвигать
  cubeMesh.userData.interactive = true;
  // Добавляем атрибут scale для того, чтобы флип мог работать
  cubeMesh.userData.scale = Object.assign({}, cubeMesh.scale);
  scene.add(cubeMesh);

  const cubeMesh2 = new THREE.Mesh(cubeGeometry, cubeMaterial);
  cubeMesh2.position.z = 300;
  cubeMesh2.scale.set(0.5, 0.5, 0.5);
  cubeMesh2.position.x = 400;
  scene.add(cubeMesh2);

  const sphereMesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
  sphereMesh.position.z = -200;
  sphereMesh.position.x = 200;
  // Добавляем атрибут interactive "true" элементам, которые хотим передвигать
  sphereMesh.userData.interactive = true;

  // Добавляем атрибут scale для того, чтобы флип мог работать
  cubeMesh.userData.scale = Object.assign({}, cubeMesh.scale);
  scene.add(sphereMesh);

  const planeGeometry = new THREE.PlaneGeometry(2000, 2000, 8, 8);
  const planeMaterial = new THREE.MeshBasicMaterial({ color: 0xb5b5b5, side: THREE.DoubleSide });
  planeMaterial.polygonOffset = true;
  planeMaterial.polygonOffsetUnits = 1;
  planeMaterial.polygonOffsetFactor = 1;
  const plane = new THREE.Mesh(planeGeometry, planeMaterial);
  plane.rotateX( - Math.PI / 2);
  plane.position.setY(-100);
  scene.add(plane);

  window.addEventListener("resize", onWindowResize);
  }

  clock = new THREE.Clock();
  flyControls = new FlyControls( currentCamera, renderer.domElement );

  flyControls.movementSpeed = 1000;
  flyControls.domElement = renderer.domElement;
  flyControls.rollSpeed = Math.PI / 24;
  flyControls.autoForward = false;
  flyControls.dragToLook = true;
  
	renderer.setClearColor( 0x000000, 1 );
	renderer.autoClear = false;

  scene.add(currentCamera);

  miniMap = new Minimap({
    scene: scene,
    camera: currentCamera,
    renderer: renderer,
    size: {
      width: 240,
      height: 160,
    },
  });
  
}

const keyPressed = {};

document.addEventListener("mousedown", (event) => {

});

document.addEventListener("mouseup", (event) => {

});

function onWindowResize() {

  const aspect = window.innerWidth / window.innerHeight;

  currentCamera.aspect = aspect;
  currentCamera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);

  render();
}

let x = 0;

function update() {
  // orbit.update();
  miniMap.update();
  
  // x++;
  cubeMesh.position.setX(x);
}

function render() {  
  renderer.setViewport(0, 0, window.innerWidth, window.innerHeight);
  renderer.clear();
  renderer.render(scene, currentCamera);
  miniMap.render();
  const delta = clock.getDelta();
  
  flyControls.update( delta );
}

function animate() {
  requestAnimationFrame(animate);
  update();
  render();
}

animate();