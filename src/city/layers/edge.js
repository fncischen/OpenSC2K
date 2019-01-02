import layer from './layer';

export default class edge extends layer {
  constructor (options) {
    options.type = 'edge';
    super(options);
  }


  hide (type) {
    this.visible = false;

    this.list.forEach((tile) => {
      tile.hide(type);
    });

    this.events.emit('mapLayerHide', this.type);
  }


  show (type) {
    this.visible = true;

    this.list.forEach((tile) => {
      tile.show(type);
    });

    this.events.emit('mapLayerShow', this.type);
  }


  onHide (type) {
    if (type == 'water')   this.hide('water');
    if (type == 'terrain') this.hide('bedrock');

    if (type == 'heightmap') this.show(false);
  }


  onShow (type) {
    if (type == 'water')   this.show('water');
    if (type == 'terrain') this.show('bedrock');

    if (type == 'heightmap') this.hide(false);
  }
}