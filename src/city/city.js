import map from './map';
import save from './save';
import load from './load';
//import simulator from '../simulator/simulator';

export default class city {
  constructor (options) {
    this.scene = options.scene;
    this.load = new load({ scene: this.scene });
    this.save = new save({ scene: this.scene });
  }

  create () {
    this.name       = this.scene.globals.data.info.name       || 'Default City';
    this.rotation   = this.scene.globals.data.info.rotation   || 0;
    this.waterLevel = this.scene.globals.data.info.waterLevel || 4;
    this.width      = this.scene.globals.data.info.width      || 128;
    this.height     = this.scene.globals.data.info.height     || 128;

    if (this.rotation == 3)
      this.keyTile = 'bottomRight';

    if (this.rotation == 2)
      this.keyTile = 'topRight';

    if (this.rotation == 1)
      this.keyTile = 'topLeft';

    if (this.rotation == 0)
      this.keyTile = 'bottomLeft';
    
    this.cameraRotation = 0;

    this.map = new map({
      scene: this.scene,
      width: this.width,
      height: this.height
    });

    this.map.load();
    this.map.create();
    //this.simulator = new simulator({ scene: this.scene });

    this.initialized = true;
  }

  update () {
    if (!this.initialized)
      return;

    this.map.update();
  }

  shutdown () {
    this.initialized = false;

    if (this.map)
      this.map.shutdown();
  }
}