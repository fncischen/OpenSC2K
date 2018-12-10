import tile from './tiles';

class highway extends tile {
  constructor (options) {
    super(options);

    this.type = 'highway';
    this.depth = +2;
    this.onramp = false;
  }

  checkTile () {
    if (!super.checkTile())
      return false;

    if (![73,74,75,76,77,78,79,80,93,94,95,96,97,98,99,100,101,102,103,104,105,106,107].includes(this.tileId))
      return false;

    return true;
  }

  getTile (tileId) {
    let tile = super.getTile(tileId);
    tileId = tile.id;

    if (this.flip(tile))
      this.flipTile = true;

    if (this.flipTile && tile.flipMode && tile.flipMode == 'alternateTile') {
      tileId = this.common.tiles[tileId].rotate[this.scene.city.cameraRotation];
      tile = this.common.tiles[tileId];
    }

    if (tile.highwayOnramp && tileId < 400)
      this.onramp = true;

    return tile;
  }

  create () {
    if ((!this.checkKeyTile() && ![93,94,95,96].includes(this.tileId)) || !this.draw || !this.checkTile())
      return;

    if (this.tile.size == 2) this.depth--;
    
    if (this.cell.z < this.scene.city.waterLevel)
      this.offset = (0 - (this.scene.city.waterLevel - this.cell.z) * this.common.layerOffset);

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

    this.highwayTraffic = this.scene.add.sprite(this.x + offsetX, this.y + offsetY, this.common.tilemap).play(animationKey);
    this.highwayTraffic.cell = this.cell;
    this.highwayTraffic.setScale(this.common.scale);
    this.highwayTraffic.setOrigin(0, 0);
    this.highwayTraffic.setDepth(this.cell.depth + this.depth + 1);

    if (this.tile.traffic.flip)
      this.highwayTraffic.setFlipX(true);

    if (this.flipTile)
      this.highwayTraffic.setFlipX(true);

    //this.scene.add.graphics().lineStyle(1, 0xff0000).strokeRectShape(this.highwayTraffic.getBounds()).setDepth(99999999);
    //this.scene.add.graphics().lineStyle(1, 0x00ff00).strokeRectShape(this.sprite.getBounds()).setDepth(99999999);

    this.cell.addSprite(this.highwayTraffic, 'highwayTraffic');
    this.cell.microSims.simulators.highwayTraffic.addSprite(this.highwayTraffic);
  }
}

export default highway;