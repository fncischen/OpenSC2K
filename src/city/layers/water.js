import layer from './layer';

export default class water extends layer {
  constructor (options) {
    options.type = 'water';
    super(options);
  }


  onHide (type) {
    if (type == 'heightmap') this.show(false);
  }


  onShow (type) {
    if (type == 'heightmap') this.hide(false);
  }
}