import tile from './tile';

export default class terrain extends tile {
  constructor (options) {
    super(options);

    this.type = 'terrain';
    this.depth = -32;
  }

  checkTile () {
    if (!super.checkTile())
      return false;

    return false;

    if (![256,257,258,259,260,261,262,263,264,265,266,267,268,269].includes(this.tileId))
      return false;

    if (this.cell.properties.waterLevel != 'dry')
      return false;

    return true;
  }

  create () {
    //if (this.cell.hasBuilding() && !this.cell.building.tile.requiresTerrain)
    //  return false;
      
    super.create();


    if (this.cell.edge && (this.cell.x == 127 || this.cell.y == 127))
      this.edge();
  }

  edge () {
    return;

    // let sprites = [];
    // let bedrock = this.getTile(269);
    // let waterfall = this.getTile(284);

    // // draw water layers
    // // draw bedrock layers
    // for (let i = this.cell.z; i > 0; i--) {
    //   let offset = this.common.layerOffset * i;
    //   let sprite = this.scene.add.sprite(this.x, this.y + offset, this.common.tilemap, bedrock.textures[0]);
    //   sprite.type = 'edge';
    //   sprite.cell = this.cell;
    //   sprite.setScale(this.common.scale);
    //   sprite.setOrigin(0, 0);
    //   sprite.setDepth(this.cell.depth + this.depth - (i * 2));

    //   //this.cell.addSprite(this.sprite, 'edge');
    //   sprites.push(sprite);
    // }

    // this.edgeSprites = sprites;
  }

  // for (i = cell.z; i > 0; i--){
  //   topOffset = -game.graphics.layerOffset * i;
  //   this.graphics.drawTile(tile, cell, topOffset);
  // }

  // // draw water blocks when needed
  // if ((cell.water_level == 'submerged' || cell.water_level == 'shore') && (!this.debug.hideWater)) {
  //   tile = 284;
  //   for (i = game.waterLevel; i > 0; i--){
  //     topOffset = -(game.graphics.layerOffset * i) + (game.graphics.layerOffset * game.waterLevel);

  //     if (i > cell.z)
  //       this.graphics.drawTile(tile, cell, topOffset);
  //   }
  // }
}