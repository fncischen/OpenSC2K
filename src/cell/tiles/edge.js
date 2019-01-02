import tile from './tile';

export default class edge extends tile {
  constructor (options) {
    options.type = 'edge';
    super(options);
    this.depth = -64;
  }

  checkTile () {
    if (!super.checkTile())
      return false;

    if (this.cell.x != 127 && this.cell.y != 127)
      return false;

    return true;
  }

  hide (type) {
    if (this.sprite.length > 0) {
      this.sprite.forEach((sprite) => {
        if (!sprite.visible || (type && sprite.subtype != type)) return;

        sprite.setVisible(false);
      });
    }
  }

  show (type) {
    if (this.sprite.length > 0) {
      this.sprite.forEach((sprite) => {
        if (sprite.visible || (type && sprite.subtype != type)) return;

        sprite.setVisible(true);
      });
    }
  }

  calculatePosition () {
    this.x = this.cell.position.topLeft.x;
    this.y = this.cell.position.topLeft.y;

    if ((this.cell.water.type == 'submerged' || this.cell.water.type == 'shore') && this.cell.z < this.cell.scene.city.waterLevel)
      this.y -= this.cell.position.offsets.seaLevel;
  }

  create () {
    this.calculatePosition();

    let sprites = [];
    let waterDepth = this.cell.scene.city.waterLevel - this.cell.z;

    // water
    if (this.cell.water.type != 'dry') {
      for (let i = 0; i < waterDepth; i++) {
        let offset = Math.abs((this.cell.scene.globals.layerOffset * i) - this.cell.position.offsets.seaLevel);
        let sprite = this.cell.scene.add.sprite(this.x, this.y + offset, this.cell.scene.globals.tilemap).play(this.getTile(284).image);
        sprite.type = this.type;
        sprite.subtype = 'water';
        sprite.cell = this.cell;
        sprite.setScale(this.cell.scene.globals.scale);
        sprite.setOrigin(this.cell.scene.globals.originX, this.cell.scene.globals.originY);
        sprite.setDepth(this.cell.depth + this.depth + (i * 2) + 32);

        this.cell.tiles.addSprite(sprite, this.type);
        sprites.push(sprite);
      }
    }

    // bedrock
    for (let i = 0; i < this.cell.z; i++) {
      let offset = this.cell.scene.globals.layerOffset * (i + 1);

      if (this.cell.water.type != 'dry')
        offset = this.cell.scene.globals.layerOffset * (i + waterDepth + 1);

      let sprite = this.cell.scene.add.sprite(this.x, this.y + offset, this.cell.scene.globals.tilemap, this.getTile(269).textures[0]);
      sprite.type = this.type;
      sprite.subtype = 'bedrock';
      sprite.cell = this.cell;
      sprite.setScale(this.cell.scene.globals.scale);
      sprite.setOrigin(this.cell.scene.globals.originX, this.cell.scene.globals.originY);
      sprite.setDepth(this.cell.depth + this.depth + (this.cell.z - i * 2));

      this.cell.tiles.addSprite(sprite, this.type);
      sprites.push(sprite);
    }

    this.sprite = sprites;
  }
}