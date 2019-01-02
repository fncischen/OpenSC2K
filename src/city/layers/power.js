import layer from './layer';

export default class power extends layer {
  constructor (options) {
    options.type = 'power';
    super(options);
  }
}