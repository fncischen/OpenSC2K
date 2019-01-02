import layer from './layer';

export default class heightmap extends layer {
  constructor (options) {
    options.type = 'heightmap';
    super(options);
    this.visible = false;
  }
}