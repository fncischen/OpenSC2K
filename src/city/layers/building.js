import layer from './layer';

export default class building extends layer {
  constructor (options) {
    options.type = 'building';
    super(options);
  }
}