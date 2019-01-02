import tools from './tools';

export default class events {
  constructor(options) {
    this.scene = options.scene;
    this.register();
  }

  register () {
    window.onresize = () => {
      this.resize();
    };

    this.scene.input.on('pointerover', this.onPointerOver);
    this.scene.input.on('pointerout',  this.onPointerOut);
    this.scene.input.on('pointermove', this.onPointerMove);
    this.scene.input.on('pointerdown', this.onPointerDown);
    this.scene.input.on('pointerup',   this.onPointerUp);
  }

  onPointerUp (pointer) {

  }

  onPointerDown (pointer, camera) {

  }

  onPointerMove (pointer, localX, localY) {
    this.scene.viewport.onPointerMove(pointer);
  }

  onPointerOver (pointer, localX, localY) {

  }

  onPointerOut (pointer) {

  }

  resize () {
    this.scene.sys.game.resize(document.documentElement.clientWidth, document.documentElement.clientHeight);
    this.scene.sys.game.world.resize();
  }
}