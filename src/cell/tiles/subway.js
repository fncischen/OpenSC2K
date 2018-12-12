import tile from './tile';

export default class subway extends tile {
  constructor (options) {
    super(options);

    this.type = 'subway';
    this.depth = -40;
  }

  checkTile () {
    if (!super.checkTile())
      return false;

    if (![319,320,321,322,323,324,325,326,327,328,329,330,331,332,333,349,350,352,353].includes(this.tileId))
      return false;

    return true;
  }

  calculatePosition () {
    if (!this.cell && !this.tile) throw 'Cannot set position for cell '+this.x+', '+this.y+'; references to cell and tile are not defined';

    this.x = this.cell.position.bottom.x - (this.tile.width / 2) << 0;
    this.y = this.cell.position.bottom.y - (this.tile.height) - this.offset << 0;

    this.depth = this.cell.depth || 0;
  }
  
  create () {
    super.create();

    if (this.sprite)
      this.sprite.setVisible(false); // hidden by default
  }
}