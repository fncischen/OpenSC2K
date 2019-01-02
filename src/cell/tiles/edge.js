import tile from './tile';

export default class edge extends tile {
  constructor (options) {
    options.type = 'edge';
    super(options);
    this.depth = -64;
    this.submergedOffset = 0;
  }

  checkTile () {
    if (!super.checkTile())
      return false;

    if (this.cell.x != 127 && this.cell.y != 127)
      return false;

    if (!this.cell.edge)
      return false;

    return true;
  }

  // calculatePosition () {
  //   if ((this.cell.water.type == 'submerged' || this.cell.water.type == 'shore') && this.cell.z < this.cell.scene.city.waterLevel)
  //     this.submergedOffset = ((this.cell.scene.city.waterLevel - this.cell.z) * this.cell.scene.globals.layerOffset);

  //   if (this.id == 256)
  //     this.offset = 24;

  //   if (this.id == 260 || this.id == 266 || this.id == 268)
  //     this.offset = 16;

  //   this.x = this.cell.position.topLeft.x - (this.tile.width / 2) << 0;
  //   this.y = this.cell.position.topLeft.y - (this.tile.height) - this.offset << 0;
  // }

  create () {
    if (!this.cell.edge)
      return;

    this.calculatePosition();

    let sprites = [];

    // submerged tiles
    let tile = this.getTile(284);

    if (this.cell.water.type != 'dry') {
      let waterDepth = this.cell.scene.city.waterLevel - this.cell.z;

      for (let i = waterDepth; i > 0; i--) {
        let sprite = null;
        let offset = (this.cell.scene.globals.layerOffset * i) - this.submergedOffset;

        if (tile.frames > 1)
          sprite = this.cell.scene.add.sprite(this.x, this.y + offset, this.cell.scene.globals.tilemap).play(tile.image);
        else
          sprite = this.cell.scene.add.sprite(this.x, this.y + offset, this.cell.scene.globals.tilemap, tile.textures[0]);

        sprite.type = this.type;
        sprite.cell = this.cell;
        sprite.setScale(this.cell.scene.globals.scale);
        sprite.setOrigin(this.cell.scene.globals.originX, this.cell.scene.globals.originY);
        sprite.setDepth(this.cell.depth + this.depth - (i * 2) + 32);

        this.cell.addSprite(sprite, this.type);

        sprites.push(sprite);
      }
    }


    // bedrock
    tile = this.getTile(269);

    for (let i = this.cell.z; i > 0; i--) {
      let sprite = null;
      let offset = this.cell.scene.globals.layerOffset * i;

      if (tile.frames > 1)
        sprite = this.cell.scene.add.sprite(this.x, this.y + offset, this.cell.scene.globals.tilemap).play(tile.image);
      else
        sprite = this.cell.scene.add.sprite(this.x, this.y + offset, this.cell.scene.globals.tilemap, tile.textures[0]);

      sprite.type = this.type;
      sprite.cell = this.cell;
      sprite.setScale(this.cell.scene.globals.scale);
      sprite.setOrigin(this.cell.scene.globals.originX, this.cell.scene.globals.originY);
      sprite.setDepth(this.cell.depth + this.depth - (i * 2));

      this.cell.addSprite(sprite, this.type);

      sprites.push(sprite);
    }

    this.sprite = sprites;
  }
}