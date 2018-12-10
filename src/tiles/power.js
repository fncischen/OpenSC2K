import tile from './tiles';

class power extends tile {
  constructor (options) {
    super(options);

    this.type = 'power';
    this.depth = 5;
  }

  checkTile () {
    if (!super.checkTile())
      return false;

    if (![14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,92].includes(this.tileId))
      return false;

    return true;
  }

  getTile (tileId) {
    let tile = super.getTile(tileId);
    tileId = tile.id;

    if (this.flip(tile))
      this.flipTile = true;

    if (this.flipTile && tile.flipMode && tile.flipMode == 'alternateTile') {
      tileId = this.common.tiles[tileId].rotate[this.scene.city.cameraRotation];
      tile = this.common.tiles[tileId];
    }

    return tile;
  }

  create () {
    if (!this.draw || !this.checkTile())
      return;

    if (this.cell.z < this.scene.city.waterLevel)
      this.offset = (0 - (this.scene.city.waterLevel - this.cell.z) * this.common.layerOffset);

    if (this.cell.tiles.getId('terrain') == 269)
      this.offset += this.common.layerOffset;

    super.create();

    if (this.flip())
      this.sprite.setFlipX(true);
  }
}

export default power;