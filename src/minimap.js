import * as THREE from "three";

export default class Minimap {
  constructor(options) {
    this.enabled = true;
    this.renderer = options.renderer;
    this.width = options.size.width || 240;
    this.height = options.size.height || 160;
    this.scene = options.scene;
    this.mainCamera = options.camera;
    this.zoom = options.zoom || 2;
    this.position =  new THREE.Vector3();
    this.rotation = new THREE.Vector3();
    
    this.miniMap = this.createMap();
    this.camera = this.createCamera();
    // this.miniMap.scene = new THREE.Scene();
    this.angle = 0;
  }
  setScene() {
    const scene = this.scene.clone();
    scene.background = new THREE.Color( 0x7e6955 );
    const material = new THREE.MeshStandardMaterial( { wireframe: true } );
    // console.log(scene.children);
    // scene.children.forEach((object) => {
    //   // if (object.isGroup =)
    //   // item.material = ;
    // });
    this.changeMaterial(scene, material);

    return scene;
  }
  changeMaterial(object, material) {
    if (object.children && object.children.length === 0) {
      object.material = material;
      return object;
    } else {
      object.children.forEach((child) => {
        child = this.changeMaterial(child, material);
      });
    }
  }
  setEnabled(enabled) {
    this.enabled = enabled;
    this.miniMap.container.style.display = `${ this.enabled ? "block" : "none" }`;
  }
  createCamera() {
    const mapCamera = new THREE.OrthographicCamera(
      window.innerWidth / -2,		// Left
      window.innerWidth / 2,		// Right
      window.innerHeight / 2,		// Top
      window.innerHeight / -2,	// Bottom
      -5000,            			// Near 
      10000 );           			// Far 
    mapCamera.zoom = 1;
    mapCamera.up = new THREE.Vector3(0,0,-1);
    mapCamera.lookAt( new THREE.Vector3(0,-1,0) );
    mapCamera.name = "cameraTop";
    
    mapCamera.aspect = window.innerWidth / window.innerHeight;
    mapCamera.updateProjectionMatrix();
    
    this.miniMap.scene.add(mapCamera);
    return mapCamera;
  }
  createMap() {
    const miniMap = document.createElement("div");
    const arrow = document.createElement("div");
    miniMap.style.width = `${this.width}px`;
    miniMap.style.height = `${this.height}px`;
    miniMap.style.position = "fixed";
    miniMap.style.bottom = "10px";
    miniMap.style.left = "10px";
    miniMap.style.display = "block";
    miniMap.style.border = "2px solid #fff";
    miniMap.style.overflow = "hidden";

    const arrowSize = this.width / 12;
    arrow.style.position = "absolute";
    arrow.style.width = `${arrowSize}px`;
    arrow.style.height = `${arrowSize}px`;
    arrow.style.backgroundImage = `url(../public/img/arrow2.svg)`;
    arrow.style.backgroundRepeat = "no-repeat";
    arrow.style.backgroundSize = "contain";

    miniMap.appendChild(arrow);
    document.body.appendChild(miniMap);
    
    return {
      container: miniMap,
      arrow: arrow,
      scene: this.setScene(),
    };
  }
  getRotation() {
    // this.rotation
    // this.mainCamera.getWorldDirection( this.rotation );
    // this.rotation.applyQuaternion( this.mainCamera.quaternion );
    // const angle = this.rotation.angleTo( new THREE.Vector3(0, 0, 0) );
    // console.log(angle.angle());
    return 0;
  }
  update() {
    const scale = {
      x: this.width / window.innerWidth,
      y: this.height / window.innerHeight,
    };

    this.position.setFromMatrixPosition(this.mainCamera.matrixWorld);
    this.position.project(this.camera);

    this.position.x = Math.round( (   this.position.x + 1 ) * window.innerWidth  / 2 );
    this.position.y = Math.round( ( - this.position.y + 1 ) * window.innerHeight / 2 );

    const vector = this.mainCamera.getWorldDirection(new THREE.Vector3(0, 0, 0));
    const theta = Math.atan2(vector.x, -vector.z);

    this.miniMap.arrow.style.transform = `
      translate(
        ${this.position.x * scale.x}px,
        ${this.position.y * scale.y}px
      )
      rotate(${theta*180/Math.PI}deg)
    `;
  }
  render() {
    if (!this.enabled) {
      return;
    }
    this.renderer.setViewport(10, 10, this.width, this.height);
    this.renderer.setScissor(10, 10, this.width, this.height);
    this.renderer.setScissorTest(true);
    // this.renderer.setViewport( 10, 10, this.width, this.height );
    this.renderer.render(this.miniMap.scene, this.camera );
  }
}