import layer from './layer';

export default class terrain extends layer {
  constructor (options) {
    options.type = 'terrain';
    super(options);
    this.showUnderwater = false;
  }


  onHide (type) {
    if (type == 'water') {
      this.showUnderwater = true;
      this.show();
    }
  }


  onShow (type) {
    if (type == 'water') {
      this.showUnderwater = false;
      this.hide();
    }
  }
}