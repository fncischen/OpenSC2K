import tile from './tile';

export default class water extends tile {
  constructor (options) {
    options.type = 'water';
    super(options);
    this.depth = -31;
  }

  checkTile () {
    if (!super.checkTile()) return false;

    if (![270,271,272,273,274,275,276,277,278,279,280,281,282,283,284,285,286,287,288,289,290].includes(this.id)) return false;

    if (this.cell.water.type == 'dry') return false;

    return true;
  }

  calculatePosition () {
    this.x = this.cell.position.topLeft.x;
    this.y = this.cell.position.topLeft.y - this.cell.position.offsets.seaLevel;
  }

  create () {
    // if (this.cell.tiles.has('building'))
    //   return false;

    if (this.cell.water.type == 'waterfall')
      this.depth++;

    super.create();
  }
}