import layer from './layer';

export default class highway extends layer {
  constructor (options) {
    options.type = 'highway';
    super(options);
  }
}