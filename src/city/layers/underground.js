import layer from './layer';

export default class underground extends layer {
  constructor (options) {
    options.type = 'underground';
    super(options);
  }
}