import Phaser from 'phaser';
import world from './world';
import './styles/global.css';

var config = {
  gameTitle: 'OpenSC2K',
  gameURL: 'https://github.com/rage8885/OpenSC2K',
  type: Phaser.WEBGL,
  parent: 'content',
  width: window.innerWidth,
  height: window.innerHeight,
  resolution: 1,
  autoResize: true,
  disableContextMenu: true,
  banner: false,
  audio: {
    noAudio: true,
  },
  render: {
    antialias: false,
    pixelArt: true,
    batchSize: 10000
  },
  scene: [
    world
  ]
};

window.game = new Phaser.Game(config);