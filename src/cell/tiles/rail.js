import tile from './tile';
import * as CONST from '../../constants';

export default class rail extends tile {
  constructor (options) {
    options.type = CONST.T_RAIL;
    options.layerDepth = CONST.DEPTH_RAIL;
    super(options);
  }

  check () {
    if (!super.check()) return false;

    if (![44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,71,72,90,91,108,109,110,111].includes(this.id)) return false;

    return true;
  }

  get (id) {
    let tile = super.get(id);

    if (this.flip(tile)) this._flip = true;

    return tile;
  }

  create () {
    if (!this.draw) return;

    if (this.cell.position.underwater)
      this.offsetY -= this.cell.position.offsets.seaLevel;

    if (this.cell.tiles.has(CONST.T_TERRAIN) && this.cell.tiles.getId(CONST.T_TERRAIN) == 269)
      this.offsetY -= CONST.LAYER_OFFSET;

    super.create();

    if (this._flip) this.sprite.setFlipX(true);
  }
}