import layer from './layer';

export default class road extends layer {
  constructor (options) {
    options.type = 'road';
    super(options);
  }
}