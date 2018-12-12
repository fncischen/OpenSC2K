import Phaser from 'phaser';
import tiles from './import/tiles';
import common from './common/common';
import city from './city/city';

class load extends Phaser.Scene {
  constructor () {
    super({ key: 'load' });
    this.initialized = false;
  }

  preload () {
    if (!this.sys.game.common)
      this.sys.game.common = common();

    this.common = this.sys.game.common;
    this.common.game = this.sys.game;

    this.load.atlas(this.common.tilemap, 'assets/tiles/tilemap_0.png', 'assets/tiles/tilemap_0.json');
    this.load.image('title', 'assets/images/title.png');
  }

  create () {
    this.city = new city({ scene: this });
    this.city.load.loadDefaultCity();
    this.common.load = this;
  }

  start () {
    if (this.common.game.world)
      this.common.game.world.shutdown();

    this.initialized = true;
    this.loadTiles();
    this.title = this.add.sprite(0, 0, 'title').setOrigin(0, 0);
    this.startKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    this.scene.start('world');
  }

  update () {
    if (!this.initialized)
      return;

    if(this.startKey.isDown){
      this.sys.sleep();

      this.scene.start('world');
    }
  }

  loadTiles () {
    if (!this.initialized || this.common.tiles.length > 0)
      return;

    for (let i = 0; i < tiles.length; i++) {
      let tile = tiles[i];

      if (tile.importOptions && tile.importOptions.skip)
        continue;

      tile.textures = {};

      for (let f = 0; f < tile.frames; f++)
        tile.textures[f] = tile.image + '_' + f;

      tile.height = (this.textures.getFrame(this.common.tilemap, tile.textures[0]).height * this.common.scale);
      tile.width = (this.textures.getFrame(this.common.tilemap, tile.textures[0]).width * this.common.scale);

      tile.hitbox = this.shape(tile.hitbox);
      tile.rotate = tile.rotate || [tile.id, tile.id, tile.id, tile.id];

      if (tile.frames > 1) {
        this.anims.create({
          key: tile.image,
          frames: this.anims.generateFrameNames(this.common.tilemap, {
            prefix: tile.image + '_',
            start: (tile.reverseAnimation ? tile.frames : 0),
            end: (tile.reverseAnimation ? 0 : tile.frames)
          }),
          repeat: -1,
          frameRate: tile.frameRate || 2,
          delay: tile.animationDelay || 0
        });

        this.anims.create({
          key: tile.image+'_R',
          frames: this.anims.generateFrameNames(this.common.tilemap, {
            prefix: tile.image + '_',
            start: (tile.reverseAnimation ? 0 : tile.frames),
            end: (tile.reverseAnimation ? tile.frames : 0)
          }),
          repeat: -1,
          frameRate: tile.frameRate || 2,
          delay: tile.animationDelay || 0
        });
      }

      this.common.tiles[tile.id] = tile;
    }
  }

  shape (shape) {
    if (!shape)
      return new Phaser.Geom.Polygon([new Phaser.Geom.Point(0, 0), new Phaser.Geom.Point(32, 16), new Phaser.Geom.Point(0, 32), new Phaser.Geom.Point(-32, 16), new Phaser.Geom.Point(0, 0)]);

    let polygon = [];

    shape.forEach(vector => {
      polygon.push(new Phaser.Geom.Point(vector.x, vector.y));
    });

    return new Phaser.Geom.Polygon(polygon);
  }
}

export default load;