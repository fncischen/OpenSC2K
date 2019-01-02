import layer from './layer';

export default class subway extends layer {
  constructor (options) {
    options.type = 'subway';
    super(options);
  }
}