class center {
  constructor (options) {
    this.scene = options.scene;
    this.common = options.scene.common;

    this.enabled = false;
  }

  onPointerUp (pointer) {
    if (!this.enabled)
      return;

    console.log('onPointerUp', pointer);
  }

  onPointerDown (pointer, camera) {
    if (!this.enabled)
      return;

    console.log('onPointerDown', pointer);
  }

  onPointerMove (pointer, localX, localY) {
    if (!this.enabled)
      return;

    console.log('onPointerMove', pointer);
  }

  onPointerOver (pointer, localX, localY) {
    if (!this.enabled)
      return;

    console.log('onPointerOver', pointer);
  }

  onPointerOut (pointer) {
    if (!this.enabled)
      return;

    console.log('onPointerOut', pointer);
  }
}

export default center;