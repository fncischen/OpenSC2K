import Phaser from 'phaser';
import city from './city/city';
import viewport from './world/viewport';
import events from './world/events';
import debug from './debug/debug';
//import ui from './ui/';

class world extends Phaser.Scene {
  constructor () {
    super({ key: 'world' });
    this.initialized = false;
  }

  preload () {
    this.sys.game.world = this;
    this.common = this.sys.game.common;
    this.city = new city({ scene: this });
  }

  create () {
    this.viewport = new viewport({ scene: this });
    this.worldEvents = new events({ scene: this });

    this.city.create();

    //this.ui = new ui({ scene: this });
    this.debug = new debug({ scene: this });

    this.initialized = true;
  }

  reload () {
    this.city.shutdown();
  }

  update (time, delta) {
    if (!this.initialized)
      return;

    this.viewport.update(delta);
    this.city.update();
  }

  resize () {
    this.viewport.resize();
  }

  shutdown () {
    this.initialized = false;

    if (this.debug)
      this.debug.shutdown();

    if (this.city)
      this.city.shutdown();

    this.scene.destroy();
  }
}

export default world;