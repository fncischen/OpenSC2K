import Phaser from 'phaser';

export default class viewport {
  constructor(options) {
    this.scene        = options.scene;
    this.camera       = this.scene.cameras.main;
    this.camera.name  = 'viewport';

    //this.camera.setBackgroundColor(new Phaser.Display.Color(55, 23, 0, 1));

    this.worldPoint = {
      x: 0,
      y: 0
    };

    let keys = this.scene.input.keyboard.addKeys({
      'up': Phaser.Input.Keyboard.KeyCodes.W,
      'down': Phaser.Input.Keyboard.KeyCodes.S,
      'left': Phaser.Input.Keyboard.KeyCodes.A,
      'right': Phaser.Input.Keyboard.KeyCodes.D,
      'zoomIn': Phaser.Input.Keyboard.KeyCodes.Q,
      'zoomOut': Phaser.Input.Keyboard.KeyCodes.E,
    });

    let controlConfig = {
      camera: this.camera,
      up: keys.up,
      down: keys.down,
      left: keys.left,
      right: keys.right,
      zoomIn: keys.zoomIn,
      zoomOut: keys.zoomOut,
      acceleration: 0.04,
      drag: 0.0005,
      maxSpeed: 1
    };

    this.controls = new Phaser.Cameras.Controls.SmoothedKeyControl(controlConfig);

    this.camera.scrollX = -691;
    this.camera.scrollY = -486;
    this.camera.zoom = 1.5;
  }

  onPointerMove (pointer) {
    let { x, y } = this.camera.getWorldPoint(pointer.x, pointer.y);

    this.worldPoint.x = x;
    this.worldPoint.y = y;
  }

  update (delta) {
    this.controls.update(delta);
  }

  resize () {
    //this.camera.setViewport(0, 0, document.documentElement.clientWidth, document.documentElement.clientHeight);
  }
}