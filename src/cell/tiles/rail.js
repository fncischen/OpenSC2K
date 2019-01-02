import tile from './tile';

export default class rail extends tile {
  constructor (options) {
    options.type = 'rail';
    super(options);
    this.depth = 0;
  }

  checkTile () {
    if (!super.checkTile())
      return false;

    if (![44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,71,72,90,91,108,109,110,111].includes(this.id))
      return false;

    return true;
  }

  getTile (id) {
    let tile = super.getTile(id);
    id = tile.id;

    if (this.flip(tile))
      this.flipTile = true;

    return tile;
  }

  create () {
    if (!this.draw)
      return;

    if (this.cell.z < this.scene.city.waterLevel)
      this.offset = (0 - (this.scene.city.waterLevel - this.cell.z) * this.globals.layerOffset);

    if (this.cell.tiles.getId('terrain') == 269)
      this.offset += this.globals.layerOffset;

    super.create();

    if (this.flipTile)
      this.sprite.setFlipX(true);
  }
}