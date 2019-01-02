import Phaser from 'phaser';
import city from './city/city';
import viewport from './world/viewport';
import events from './world/events';
import debug from './debug/debug';

export default class world extends Phaser.Scene {
  constructor () {
    super({ key: 'world' });
  }
  

  preload () {
    // create references to game world
    this.sys.game.world = this;
    this.globals        = this.sys.game.globals;
    this.globals.world  = this;

    // initialize city
    this.city = new city({ scene: this });
  }
  

  create () {
    this.viewport = new viewport({ scene: this });
    this.worldEvents = new events({ scene: this });

    this.city.create();

    //this.ui = new ui({ scene: this });
    this.debug = new debug({ scene: this });
  }
  

  reload () {
    this.city.shutdown();
  }
  

  update (time, delta) {
    this.viewport.update(delta);
    this.city.update();
  }
  

  resize () {
    this.viewport.resize();
  }
  

  shutdown () {
    //if (this.debug)
    //  this.debug.shutdown();

    if (this.city)
      this.city.shutdown();

    this.scene.destroy();
  }
}