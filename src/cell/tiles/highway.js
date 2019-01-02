import tile from './tile';

export default class highway extends tile {
  constructor (options) {
    options.type = 'highway';
    super(options);
    this.depth = +2;
    this.onramp = false;
  }

  checkTile () {
    if (!super.checkTile())
      return false;

    if (![73,74,75,76,77,78,79,80,93,94,95,96,97,98,99,100,101,102,103,104,105,106,107].includes(this.id))
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

    if (tile.highwayOnramp && id < 400)
      this.onramp = true;

    return tile;
  }

  create () {
    if ((!this.checkKeyTile() && ![93,94,95,96].includes(this.id)) || !this.draw || !this.checkTile())
      return;

    if (this.tile.size == 2) this.depth--;
    
    if (this.cell.z < this.scene.city.waterLevel)
      this.offset = (0 - (this.scene.city.waterLevel - this.cell.z) * this.globals.layerOffset);

    super.create();

    if (this.flipTile)
      this.sprite.setFlipX(true);
  }

  simulation () {
    let tile;
    let animationKey;

    if (!this.cell.microSims || !this.cell.microSims.simulators || !this.cell.microSims.simulators.highwayTraffic)
      return;

    let density = this.cell.microSims.simulators.highwayTraffic.getTrafficDensity();

    if (!density)
      return;
    
    let trafficTile = this.tile.traffic[density];

    if (!trafficTile)
      return;

    if (typeof trafficTile === 'number')
      tile = this.getTile(trafficTile);
    else
      tile = this.getTile(trafficTile[0]);

    if (!tile)
      return;

    // position at the bottom right x/y of the tile
    // when the size of the tiles differ
    let offsetX = this.tile.width - tile.width;
    let offsetY = this.tile.height - tile.height;
    
    // set traffic direction
    if (this.cell.microSims.simulators.highwayTraffic.calculateTrafficDirection())
      animationKey = tile.image;
    else
      animationKey = tile.image+'_R';

    this.highwayTraffic = this.scene.add.sprite(this.x + offsetX, this.y + offsetY, this.globals.tilemap).play(animationKey);
    this.highwayTraffic.cell = this.cell;
    this.highwayTraffic.setScale(this.globals.scale);
    this.highwayTraffic.setOrigin(this.cell.scene.globals.originX, this.cell.scene.globals.originY);
    this.highwayTraffic.setDepth(this.cell.depth + this.depth + 1);

    if (this.tile.traffic.flip)
      this.highwayTraffic.setFlipX(true);

    if (this.flipTile)
      this.highwayTraffic.setFlipX(true);

    this.cell.addSprite(this.highwayTraffic, 'highwayTraffic');
    this.cell.microSims.simulators.highwayTraffic.addSprite(this.highwayTraffic);
  }
}