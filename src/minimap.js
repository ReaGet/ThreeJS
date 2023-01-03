import * as THREE from "three";

export default class Minimap {
  constructor(options) {
    this.enabled = true;
    this.renderer = options.renderer;
    this.width = options.size.width || 240;
    this.height = options.size.height || 160;
    this.scene = options.scene;
    this.mainCamera = options.camera;
    this.camera = this.createCamera();
    this.zoom = options.zoom || 2;
    this.position =  new THREE.Vector3();
    this.rotation = new THREE.Vector3();

    this.miniMap = this.createMap();
    this.angle = 0;
 
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
    mapCamera.up = new THREE.Vector3(0,0,-1);
    mapCamera.lookAt( new THREE.Vector3(0,-1,0) );
    mapCamera.name = "cameraTop";
    
    this.scene.add(mapCamera);
    return mapCamera;
  }
  calcAspect() {
    return this.width / this.height;
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

    arrow.style.position = "absolute";
    arrow.style.width = "20px";
    arrow.style.height = "20px";
    arrow.style.backgroundImage = `url(../public/img/arrow2.svg)`;
    arrow.style.backgroundRepeat = "no-repeat";
    arrow.style.backgroundSize = "contain";

    miniMap.appendChild(arrow);
    document.body.appendChild(miniMap);
    
    return {
      container: miniMap,
      arrow: arrow,
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

    this.mainCamera.updateMatrixWorld();
    this.position.setFromMatrixPosition(this.mainCamera.matrixWorld);
    this.position.project(this.camera);

    this.position.x = Math.round( (   this.position.x + 1 ) * window.innerWidth  / 2 );
    this.position.y = Math.round( ( - this.position.y + 1 ) * window.innerHeight / 2 );

    const angle = new THREE.Vector2(this.position.x, this.position.y).angle() * 180 / Math.PI;
    // console.log(angle);
    // translate(10px, 13px) rotate(-97deg)
    // translate(120px, 80px) rotate(322deg)
    // this.angle++;

    this.miniMap.arrow.style.transform = `
      translate(
        ${this.position.x * scale.x}px,
        ${this.position.y * scale.y}px
      )
      rotate(${angle}deg)
    `;
  }
  render() {
    if (!this.enabled) {
      return;
    }
    this.renderer.setViewport( 10, 10, this.width, this.height );
    this.renderer.render(this.scene, this.camera );
  }
}