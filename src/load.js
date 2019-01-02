import Phaser from 'phaser';
import city from './city/city';
import palette from './import/palette';
import artwork from './import/artwork';

export default class load extends Phaser.Scene {
  constructor () {
    super({ key: 'load' });
  }


  preload () {
    this.globals = this.sys.game.globals;

    // load binary game assets from original SC2K
    this.load.binary('PAL_MSTR_BMP', '/assets/import/PAL_MSTR.BMP');
    this.load.binary('LARGE_DAT', '/assets/import/LARGE.DAT');

    // start import once files are loaded
    this.load.once('loadcomplete', () => {
      this.palette = new palette({ scene: this });
      this.artwork = new artwork({ scene: this });
      this.globals.tiles = this.artwork.tiles;
    });
  }


  create () {
    // create a global reference to this scene
    this.globals.load = this;

    // load default city
    this.city = new city({ scene: this });
    
    this.city.load.loadDefaultCity().then(() => {
      this.start();
    });
  }

  start () {
    if (this.game.world)
      this.game.world.shutdown();

    this.scene.start('world');
  }


  update () {
    return;
  }

}