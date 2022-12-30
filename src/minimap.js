import * as THREE from "three";

export default class Minimap {
  constructor(options) {
    this.renderer = options.renderer;
    this.width = options.size.width;
    this.height = options.size.height;
    this.scene = options.scene;
    this.mainCamera = options.camera;
    this.camera = this.createCamera();
    this.zoom = options.zoom || 2;
    this.position =  { x: 0, y: 0, };

    this.miniMap = this.createMap();

    // this.mainCamera.add(this.camera);
    
    // this.camera.setViewOffset(window.innerWidth, window.innerHeight, 0, 0, 64, 64);
    // this.renderTarget = new THREE.WebGLRenderTarget(32, 32);
    // this.renderer.setRenderTarget(this.renderTarget);
    
    // this.renderer.render(options.scene, this.camera);
    // this.renderer.setRenderTarget(null);

    console.log(this.scene);

    this.enabled = true;
  }
  setEnabled(enabled) {
    this.enabled = enabled;
    this.miniMap.style.display = `${ enabled ? "block" : "none" }`;
  }
  createCamera() {
    const aspect = this.calcAspect();
    const camera = new THREE.PerspectiveCamera(90, aspect, 0.01, 3000);

    camera.position.set(0, 1500, 0);
    camera.lookAt(0, 0, 0);
    camera.name = "cameraTop";

    return camera;
  }
  calcAspect() {
    return window.innerWidth / window.innerHeight;
  }
  createMap() {
    const miniMap = document.createElement("div");
    miniMap.style.width = `${this.width}px`;
    miniMap.style.height = `${this.height}px`;
    miniMap.style.position = "fixed";
    miniMap.style.bottom = "0";
    miniMap.style.left = "0";
    miniMap.style.display = "none";
    miniMap.style.border = "2px solid #fff";
    // miniMap.style.backgroundImage = `url("data:image/svg+xml;base64,PCEtLSBVcGxvYWRlZCB0bzogU1ZHIFJlcG8sIHd3dy5zdmdyZXBvLmNvbSwgVHJhbnNmb3JtZWQgYnk6IFNWRyBSZXBvIE1peGVyIFRvb2xzIC0tPgo8c3ZnIHdpZHRoPSI4MDBweCIgaGVpZ2h0PSI4MDBweCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8cGF0aCBkPSJNMTIgMjEuNzVDMTAuMDcxNiAyMS43NSA4LjE4NjU3IDIxLjE3ODIgNi41ODMxOSAyMC4xMDY4QzQuOTc5ODEgMTkuMDM1NSAzLjczMDEzIDE3LjUxMjcgMi45OTIxNyAxNS43MzEyQzIuMjU0MjIgMTMuOTQ5NiAyLjA2MTEzIDExLjk4OTIgMi40MzczNCAxMC4wOTc5QzIuODEzNTUgOC4yMDY1NSAzLjc0MjE0IDYuNDY5MjcgNS4xMDU3MSA1LjEwNTcxQzYuNDY5MjcgMy43NDIxNCA4LjIwNjU1IDIuODEzNTUgMTAuMDk3OSAyLjQzNzM0QzExLjk4OTIgMi4wNjExMyAxMy45NDk2IDIuMjU0MjIgMTUuNzMxMiAyLjk5MjE3QzE3LjUxMjcgMy43MzAxMyAxOS4wMzU1IDQuOTc5ODEgMjAuMTA2OCA2LjU4MzE5QzIxLjE3ODIgOC4xODY1NyAyMS43NSAxMC4wNzE2IDIxLjc1IDEyQzIxLjc0NzMgMTQuNTg1IDIwLjcxOTMgMTcuMDYzNSAxOC44OTE0IDE4Ljg5MTRDMTcuMDYzNSAyMC43MTkzIDE0LjU4NSAyMS43NDczIDEyIDIxLjc1Wk0xMiAzLjc1QzEwLjM2ODMgMy43NSA4Ljc3MzI1IDQuMjMzODUgNy40MTY1NCA1LjE0MDM3QzYuMDU5ODQgNi4wNDY4OSA1LjAwMjQxIDcuMzM1MzcgNC4zNzc5OSA4Ljg0Mjg2QzMuNzUzNTcgMTAuMzUwMyAzLjU5MDE5IDEyLjAwOTEgMy45MDg1MiAxMy42MDk1QzQuMjI2ODUgMTUuMjA5OCA1LjAxMjU4IDE2LjY3OTggNi4xNjYzNyAxNy44MzM2QzcuMzIwMTUgMTguOTg3NCA4Ljc5MDE2IDE5Ljc3MzEgMTAuMzkwNSAyMC4wOTE1QzExLjk5MDggMjAuNDA5OCAxMy42NDk2IDIwLjI0NjQgMTUuMTU3MSAxOS42MjJDMTYuNjY0NiAxOC45OTc2IDE3Ljk1MzEgMTcuOTQwMiAxOC44NTk2IDE2LjU4MzVDMTkuNzY2MSAxNS4yMjY3IDIwLjI1IDEzLjYzMTcgMjAuMjUgMTJDMjAuMjQ3NCA5LjgxMjc3IDE5LjM3NzMgNy43MTU4OSAxNy44MzA3IDYuMTY5MjlDMTYuMjg0MSA0LjYyMjY5IDE0LjE4NzIgMy43NTI2NCAxMiAzLjc1WiIgZmlsbD0iI2ZmZiIvPgo8cGF0aCBkPSJNMTIgOS4yNUMxMS44MDE5IDkuMjQ3NDEgMTEuNjEyNiA5LjE2NzU2IDExLjQ3MjUgOS4wMjc0N0MxMS4zMzI0IDguODg3MzcgMTEuMjUyNiA4LjY5ODExIDExLjI1IDguNVYzLjVDMTEuMjUgMy4zMDEwOSAxMS4zMjkgMy4xMTAzMiAxMS40Njk3IDIuOTY5NjdDMTEuNjEwMyAyLjgyOTAyIDExLjgwMTEgMi43NSAxMiAyLjc1QzEyLjE5ODkgMi43NSAxMi4zODk3IDIuODI5MDIgMTIuNTMwMyAyLjk2OTY3QzEyLjY3MSAzLjExMDMyIDEyLjc1IDMuMzAxMDkgMTIuNzUgMy41VjguNUMxMi43NDc0IDguNjk4MTEgMTIuNjY3NiA4Ljg4NzM3IDEyLjUyNzUgOS4wMjc0N0MxMi4zODc0IDkuMTY3NTYgMTIuMTk4MSA5LjI0NzQxIDEyIDkuMjVaIiBmaWxsPSIjZmZmIi8+CjxwYXRoIGQ9Ik0xMiAyMS4yNUMxMS44MDE5IDIxLjI0NzQgMTEuNjEyNiAyMS4xNjc2IDExLjQ3MjUgMjEuMDI3NUMxMS4zMzI0IDIwLjg4NzQgMTEuMjUyNiAyMC42OTgxIDExLjI1IDIwLjVWMTUuNUMxMS4yNSAxNS4zMDExIDExLjMyOSAxNS4xMTAzIDExLjQ2OTcgMTQuOTY5N0MxMS42MTAzIDE0LjgyOSAxMS44MDExIDE0Ljc1IDEyIDE0Ljc1QzEyLjE5ODkgMTQuNzUgMTIuMzg5NyAxNC44MjkgMTIuNTMwMyAxNC45Njk3QzEyLjY3MSAxNS4xMTAzIDEyLjc1IDE1LjMwMTEgMTIuNzUgMTUuNVYyMC41QzEyLjc0NzQgMjAuNjk4MSAxMi42Njc2IDIwLjg4NzQgMTIuNTI3NSAyMS4wMjc1QzEyLjM4NzQgMjEuMTY3NiAxMi4xOTgxIDIxLjI0NzQgMTIgMjEuMjVaIiBmaWxsPSIjZmZmIi8+CjxwYXRoIGQ9Ik04LjUgMTIuNzVIMy41QzMuMzAxMDkgMTIuNzUgMy4xMTAzMiAxMi42NzEgMi45Njk2NyAxMi41MzAzQzIuODI5MDIgMTIuMzg5NyAyLjc1IDEyLjE5ODkgMi43NSAxMkMyLjc1IDExLjgwMTEgMi44MjkwMiAxMS42MTAzIDIuOTY5NjcgMTEuNDY5N0MzLjExMDMyIDExLjMyOSAzLjMwMTA5IDExLjI1IDMuNSAxMS4yNUg4LjVDOC42OTg5MSAxMS4yNSA4Ljg4OTY4IDExLjMyOSA5LjAzMDMzIDExLjQ2OTdDOS4xNzA5OCAxMS42MTAzIDkuMjUgMTEuODAxMSA5LjI1IDEyQzkuMjUgMTIuMTk4OSA5LjE3MDk4IDEyLjM4OTcgOS4wMzAzMyAxMi41MzAzQzguODg5NjggMTIuNjcxIDguNjk4OTEgMTIuNzUgOC41IDEyLjc1WiIgZmlsbD0iI2ZmZiIvPgo8cGF0aCBkPSJNMjAuNSAxMi43NUgxNS41QzE1LjMwMTEgMTIuNzUgMTUuMTEwMyAxMi42NzEgMTQuOTY5NyAxMi41MzAzQzE0LjgyOSAxMi4zODk3IDE0Ljc1IDEyLjE5ODkgMTQuNzUgMTJDMTQuNzUgMTEuODAxMSAxNC44MjkgMTEuNjEwMyAxNC45Njk3IDExLjQ2OTdDMTUuMTEwMyAxMS4zMjkgMTUuMzAxMSAxMS4yNSAxNS41IDExLjI1SDIwLjVDMjAuNjk4OSAxMS4yNSAyMC44ODk3IDExLjMyOSAyMS4wMzAzIDExLjQ2OTdDMjEuMTcxIDExLjYxMDMgMjEuMjUgMTEuODAxMSAyMS4yNSAxMkMyMS4yNSAxMi4xOTg5IDIxLjE3MSAxMi4zODk3IDIxLjAzMDMgMTIuNTMwM0MyMC44ODk3IDEyLjY3MSAyMC42OTg5IDEyLjc1IDIwLjUgMTIuNzVaIiBmaWxsPSIjZmZmIi8+Cjwvc3ZnPg==")`;
    miniMap.style.backgroundRepeat = "no-repeat";
    miniMap.style.backgroundSize = "20px";
    miniMap.style.backgroundPosition = "center";

    document.body.appendChild(miniMap);
    return miniMap;
  }
  update(position) {
    // this.position = position;
  }
  calcY() {
    let check = this.position.y - this.size;
    let y = window.innerHeight - (this.position.y - this.radius);
    if (check < this.radius) {
      y = window.innerHeight - (this.position.y + this.size + this.radius);
    }
    return y;
  }
  render() {
    // if (!this.enabled) {
    //   return;
    // }
    this.renderer.setScissorTest(true);
    // const x = this.position.x - this.radius;
    // const times = this.zoom; // scale of magnifier
    // const y = this.calcY();
    // const offsetX = this.position.x - this.radius / times;
    // const offsetY = this.position.y - this.radius / times;

    // this.camera.setViewOffset(
    //   window.innerWidth,
    //   window.innerHeight,
    //   offsetX,
    //   offsetY,
    //   this.size / times,
    //   this.size / times
    // );
    
    this.renderer.setViewport(0, 0, this.width, this.height);
    // this.renderer.setScissor(x, y, this.size, this.size);
    // this.renderer.render(this.scene, this.camera);
    this.renderer.render(this.scene, this.camera);
    this.renderer.setScissorTest(false);
  }
}