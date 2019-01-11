import tile from './tile';
import * as CONST from '../../constants';

export default class power extends tile {
  constructor (options) {
    options.type = CONST.T_POWER;
    options.layerDepth = CONST.DEPTH_POWER;
    super(options);
  }

  check () {
    if (!super.check()) return false;

    if (![14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,67,68,92].includes(this.id))
      return false;

    return true;
  }

  get (id) {
    let tile = super.get(id);

    if (this.flip(tile)) this._flip = true;

    if (this._flip && tile.flipMode && tile.flipMode == CONST.ALTERNATE_TILE)
      tile = this.cell.scene.tiles[this.cell.scene.tiles[tile.id].rotate[this.cell.scene.city.cameraRotation]];

    return tile;
  }

  create () {
    if (!this.draw || !this.check()) return;

    if (this.cell.position.underwater)
      this.offsetY -= this.cell.position.offsets.seaLevel;

    if (this.cell.tiles.has(CONST.T_TERRAIN) && this.cell.tiles.getId(CONST.T_TERRAIN) == 269)
      this.offsetY -= CONST.LAYER_OFFSET;

    super.create();

    if (this.flip()) this.sprite.setFlipX(true);
  }
}