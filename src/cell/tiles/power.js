import tile from './tile';

export default class power extends tile {
  constructor (options) {
    options.type = 'power';
    super(options);
    this.depth = 5;
  }

  checkTile () {
    if (!super.checkTile())
      return false;

    if (![14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,92].includes(this.id))
      return false;

    return true;
  }

  getTile (id) {
    let tile = super.getTile(id);
    id = tile.id;

    if (this.flip(tile))
      this.flipTile = true;

    if (this.flipTile && tile.flipMode && tile.flipMode == 'alternateTile') {
      id = this.globals.tiles[id].rotate[this.scene.city.cameraRotation];
      tile = this.globals.tiles[id];
    }

    return tile;
  }

  create () {
    if (!this.draw || !this.checkTile())
      return;

    if (this.cell.z < this.scene.city.waterLevel)
      this.offset = (0 - (this.scene.city.waterLevel - this.cell.z) * this.globals.layerOffset);

    if (this.cell.tiles.getId('terrain') == 269)
      this.offset += this.globals.layerOffset;

    super.create();

    if (this.flip())
      this.sprite.setFlipX(true);
  }
}