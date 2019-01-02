import layer from './layer';

export default class pipe extends layer {
  constructor (options) {
    options.type = 'pipe';
    super(options);
  }
}