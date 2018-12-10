import jszip from 'jszip';
import sc2 from '../import/sc2';

class load {
  constructor (options) {
    this.scene = options.scene;
    this.common = this.scene.sys.game.common;
    this.sc2 = new sc2({ scene: this.scene });

    this.path = '/assets/cities/';
    this.file = 'Default.sc2';
  }

  loadDefaultCity () {
    this.file = 'CAPEQUES.SC2'; //r3
    //this.file = 'BAYVIEW.SC2'; //r2, bridges
    //this.file = 'EGYPTFAL.SC2'; //r1
    //this.file = 'NEWCITY.SC2'; //r0
    //this.file = 'TOKYO.SC2'; // rails
    //this.file = 'TEST1.SC2';

    let xhr = new XMLHttpRequest();

    xhr.open('GET', this.path + this.file);
    xhr.responseType = 'blob';
    xhr.onload = () => {
      this.load(xhr.response);
    };

    xhr.send();
  }

  open () {
    if (!document.querySelector('#fileOpen')) {
      let input = document.createElement('input');

      input.id = 'fileOpen';
      input.type = 'file';
      input.onchange = (event) => {
        this.file = event.target.files[0].name;
        this.load(event.target.files[0]);
      };

      document.body.appendChild(input);
    }

    let event = new MouseEvent('click', {
      view: window,
      bubbles: true
    });

    let fileOpen = document.querySelector('#fileOpen');
    fileOpen.dispatchEvent(event);
  }

  async load (file) {
    let zip = new jszip();
    let reader = new FileReader();

    reader.onload = async event => {
      let bytes = new Uint8Array(event.target.result);
      let { valid, type } = this.check(bytes);

      if (!valid)
        throw 'File is not a valid SimCity 2000 or OpenSC2K saved city.';

      if (type == 'opensc2k')
        await zip.loadAsync(file).then(async content => {
          this.common.data = await JSON.parse(await content.file('data.json').async('string'));
        });

      if (type == 'sc2')
        this.common.data = await this.sc2.import(bytes);
      
      if (!this.common.data)
        throw 'Could not load save';

      this.common.load.start();
    };

    reader.readAsArrayBuffer(file);
  }

  check (bytes) {
    // check IFF and sc2k header
    if (bytes[0] === 0x46 && bytes[1] === 0x4F && bytes[2] === 0x52 && bytes[3] === 0x4D && bytes[8] === 0x53 && bytes[9] === 0x43 && bytes[10] === 0x44 && bytes[11] === 0x48)
      return { valid: true, type: 'sc2' };

    // check to see if this is a OpenSC2K save file
    if (bytes[0] === 0x50 && bytes[1] === 0x4B && bytes[2] === 0x03 && bytes[3] === 0x04)
      return { valid: true, type: 'opensc2k' };

    return { valid: false, type: null };
  }

}

export default load;