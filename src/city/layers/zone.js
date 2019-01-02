import layer from './layer';

export default class zone extends layer {
  constructor (options) {
    options.type = 'zone';
    super(options);
  }
}