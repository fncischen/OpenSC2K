import layer from './layer';

export default class edge extends layer {
  constructor (options) {
    options.type = 'edge';
    super(options);
  }
}