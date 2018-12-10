import map from './map';
import save from './save';
import load from './load';
//import simulator from '../simulator/simulator';

class city {
  constructor (options) {
    this.scene = options.scene;
    this.load = new load({ scene: this.scene });
    this.save = new save({ scene: this.scene });
  }

  create () {
    this.name       = this.scene.common.data.info.name       || 'Default City';
    this.rotation   = this.scene.common.data.info.rotation   || 0;
    this.waterLevel = this.scene.common.data.info.waterLevel || 4;
    this.width      = this.scene.common.data.info.width      || 128;
    this.height     = this.scene.common.data.info.height     || 128;

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

    this._loaded = true;
  }

  update () {
    if (!this._loaded)
      return;

    this.map.update();
  }

  shutdown () {
    if (this.map)
      this.map.shutdown();
  }
}

export default city;