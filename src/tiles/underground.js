import tile from './tiles';

class underground extends tile {
  constructor (options) {
    super(options);

    this.type = 'underground';
    this.depth = -38;
  }

  checkTile () {
    if (!super.checkTile())
      return false;

    if (![305,306,307,308,309,310,311,312,313,314,315,316,317,318].includes(this.tileId))
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

export default underground;