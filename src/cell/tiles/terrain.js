import tile from './tile';

export default class terrain extends tile {
  constructor (options) {
    options.type = 'terrain';
    super(options);
    this.depth = -32;
  }


  checkTile () {
    if (!super.checkTile()) return false;

    if (![256,257,258,259,260,261,262,263,264,265,266,267,268,269].includes(this.id)) return false;

    return true;
  }


  show () {
    if (!this.sprite && this.sprite.visible)
      return;

    if (this.cell.water.type == 'dry' || this.map.layers[this.type].showUnderwater)
      this.sprite.setVisible(true);
  }


  create () {
    //if (this.cell.hasdwBuilding() && !this.cell.building.tile.requiresTerrain)
    //  return false;

    super.create();

    if (this.cell.water.type != 'dry')
      this.sprite.setVisible(false);
  }
}