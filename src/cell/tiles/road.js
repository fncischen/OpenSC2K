import tile from './tile';

export default class road extends tile {
  constructor (options) {
    options.type = 'road';
    super(options);
    this.depth = 4;
    this.traffic = null;
  }

  checkTile () {
    if (!super.checkTile())
      return false;

    if (![29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,63,64,65,66,67,68,69,70,81,82,83,84,85,86,87,88,89].includes(this.id))
      return false;

    return true;
  }

  getTile (id) {
    let tile = super.getTile(id);
    id = tile.id;

    if (this.flip(tile))
      this.flipTile = true;

    if (this.flipTile && tile.flipMode && tile.flipMode == 'alternateTile') {
      id = this.cell.scene.globals.tiles[id].rotate[this.cell.scene.city.cameraRotation];
      tile = this.cell.scene.globals.tiles[id];
    }

    return tile;
  }

  create () {
    if (!this.draw || !this.checkTile())
      return;

    if (this.cell.z < this.cell.scene.city.waterLevel)
      this.offset = (0 - (this.cell.scene.city.waterLevel - this.cell.z) * this.cell.scene.globals.layerOffset);

    if (this.cell.tiles.has('terrain') && this.cell.tiles.getId('terrain') == 269)
      this.offset += this.cell.scene.globals.layerOffset;

    if (this.tile.depthAdjustment)
      this.depth = this.depth + this.tile.depthAdjustment;

    super.create();

    if (this.flipTile)
      this.sprite.setFlipX(true);
  }

  simulation () {
    if (!this.cell.microSims || !this.cell.microSims.simulators || !this.cell.microSims.simulators.traffic)
      return;

    let density = this.cell.microSims.simulators.traffic.getTrafficDensity();

    if (!density)
      return;

    let tile = this.getTile(this.tile.traffic[density]);

    // position at the bottom right x/y of the tile
    // when the size of the tiles differ
    let offsetX = this.tile.width - tile.width;
    let offsetY = this.tile.height - tile.height;

    this.traffic = this.scene.add.sprite(this.x + offsetX, this.y + offsetY, this.cell.scene.globals.tilemap).play(tile.image);
    this.traffic.cell = this.cell;
    this.traffic.setScale(this.cell.scene.globals.scale);
    this.traffic.setOrigin(this.cell.scene.globals.originX, this.cell.scene.globals.originY);
    this.traffic.setDepth(this.cell.depth + this.depth + 1);

    if (this.flipTile)
      this.traffic.setFlipX(true);

    //this.scene.add.graphics().lineStyle(1, 0xff0000).strokeRectShape(this.traffic.getBounds()).setDepth(99999999);
    //this.scene.add.graphics().lineStyle(1, 0x00ff00).strokeRectShape(this.sprite.getBounds()).setDepth(99999999);

    this.cell.addSprite(this.traffic, 'traffic');
    this.cell.microSims.simulators.traffic.addSprite(this.traffic);
  }
}