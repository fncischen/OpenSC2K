import * as tool from './tools/';

class tools {
  constructor (options) {
    this.scene = options.scene;
    this.common = options.scene.common;

    console.log('called');
    console.log(tool);

    //tool.forEach(type => {
    //  this[type] = new tool[type]({ scene: this.scene });
    //});
  }

  // set active (type) {
  //   tool.forEach(type => {
  //     if (this[type])
  //       this[type].enabled = false;
  //   });

  //   this[type].enabled = true;
  // }

  // get active () {
  //   tool.forEach(type => {
  //     if (this[type].enabled)
  //       return type;
  //   });

  //   return null;
  // }
}

export default tools;