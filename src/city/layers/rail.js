import layer from './layer';

export default class rail extends layer {
  constructor (options) {
    options.type = 'rail';
    super(options);
  }
}