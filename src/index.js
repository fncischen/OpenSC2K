import Phaser from 'phaser';
import load from './load';
import world from './world';
import globals from './globals';
import './styles/global.css';

var config = {
  gameTitle: 'OpenSC2K',
  gameURL: 'https://github.com/rage8885/OpenSC2K',
  type: Phaser.WEBGL,
  parent: 'content',
  width: window.innerWidth,
  height: window.innerHeight,
  resolution: window.devicePixelRatio,
  disableContextMenu: false,
  render: {
    autoResize: true,
    antialias: false,
    pixelArt: true,
  },
  scene: [
    load,
    world
  ]
};

window.game = new Phaser.Game(config);

window.game.globals = globals;