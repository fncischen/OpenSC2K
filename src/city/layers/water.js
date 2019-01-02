import layer from './layer';

export default class water extends layer {
  constructor (options) {
    options.type = 'water';
    super(options);
  }
}