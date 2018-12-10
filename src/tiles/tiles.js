class tile {
  constructor (options) {
    this.cell           = options.cell;
    this.draw           = false;
    this.flipTile       = false;
    this.depth          = 0;
    this.x              = options.x || this.cell.position.bottom.x || 0;
    this.y              = options.y || this.cell.position.bottom.y || 0;
    this.offset         = options.offset || 0;
    this.type           = options.type;
    this.sprite         = null;
    this.debugOutline   = false;
    this.tile           = this.getTile(options.tileId);
    this.tileId         = this.tile.id;
    this.originalTileId = options.tileId;

    if (!this.checkTile())
      return;

    this.draw = true;
  }

  getTile (tileId) {
    if (!this.cell.scene.common.tiles[tileId])
      return false;

    tileId = this.cell.scene.common.tiles[tileId].rotate[this.cell.scene.city.cameraRotation];

    return this.cell.scene.common.tiles[tileId];
  }

  checkTile () {
    if (this.cell == undefined)
      return false;

    return true;
  }

  checkKeyTile () {
    if (this.tile.size == 1)
      return true;
    
    if (this.cell.scene.city.keyTile == 'bottomRight' && !this.cell.properties.cornersBottomRight)
      return false;

    if (this.cell.scene.city.keyTile == 'bottomLeft' && !this.cell.properties.cornersBottomLeft)
      return false;

    if (this.cell.scene.city.keyTile == 'topRight' && !this.cell.properties.cornersTopRight)
      return false;

    if (this.cell.scene.city.keyTile == 'topLeft' && !this.cell.properties.cornersTopLeft)
      return false;

    return true;
  }

  calculatePosition () {
    if ((this.cell.properties.waterLevel == 'submerged' || this.cell.properties.waterLevel == 'shore') && this.cell.z < this.cell.scene.city.waterLevel)
      this.offset = ((this.cell.scene.city.waterLevel - this.cell.z) * this.cell.scene.common.layerOffset);

    if (!this.cell && !this.tile) throw 'Cannot set position for cell '+this.x+', '+this.y+'; references to cell and tile are not defined';

    this.x = this.cell.position.bottom.x - (this.tile.width / 2) << 0;
    this.y = this.cell.position.bottom.y - (this.tile.height) - this.offset << 0;
  }

  setVisible (bool) {
    this.sprite.setVisible(bool);
  }
 
  flip (tile = this.tile) {
    if (!tile.flip)
      return false;
    
    if (this.cell.scene.city.cameraRotation == 1 || this.cell.scene.city.cameraRotation == 3)
      return this.cell.properties.rotate ? false : true;
    else
      return this.cell.properties.rotate;
  }

  tileLogic () {
    return;
  }

  create () {
    if (!this.draw)
      return;

    this.tileLogic();
    this.calculatePosition();

    if (this.tile.layers && this.tile.layers.base) {
      let baseTile = this.getTile(this.tile.layers.base);
      let offsetX = this.tile.width - baseTile.width;
      let offsetY = this.tile.height - baseTile.height;

      this.baseSprite = this.cell.scene.add.sprite(this.x + offsetX, this.y + offsetY, this.cell.scene.common.tilemap, baseTile.textures[0]);
      this.baseSprite.cell = this.cell;
      this.baseSprite.setScale(this.cell.scene.common.scale);
      this.baseSprite.setOrigin(0, 0);
      this.baseSprite.setDepth(this.cell.depth + this.depth);
      this.cell.addSprite(this.baseSprite, this.type);
    }

    if (this.tile.frames > 1)
      this.sprite = this.cell.scene.add.sprite(this.x, this.y, this.cell.scene.common.tilemap).play(this.tile.image);
    else
      this.sprite = this.cell.scene.add.sprite(this.x, this.y, this.cell.scene.common.tilemap, this.tile.textures[0]);

    this.sprite.cell = this.cell;
    this.sprite.type = this.type;

    this.sprite.setScale(this.cell.scene.common.scale);
    this.sprite.setOrigin(0, 0);
    this.sprite.setDepth(this.cell.depth + this.depth + (this.tile.depthAdjustment || 0));
    //this.sprite.setAlpha(.5);

    this.cell.addSprite(this.sprite, this.type);

    //if (this.tile.simulation)
    //  this.simulation();

    if (this.debugOutline)
      this.outline();
  }

  simulation () {
    return;
  }

  outline () {
    let offset = 0;

    if ((this.cell.properties.waterLevel == 'submerged' || this.cell.properties.waterLevel == 'shore') && this.cell.z < this.cell.map.city.waterLevel)
      offset = ((this.cell.scene.city.waterLevel - this.cell.z) * this.cell.scene.common.layerOffset);

    if (this.tileId != 256 && this.type == 'terrain')
      offset += this.cell.scene.common.layerOffset;

    let x = this.cell.position.right.x - (this.cell.scene.common.tileWidth / 2) << 0;
    let y = this.cell.position.bottom.y - (this.cell.scene.common.tileHeight) - offset << 0;

    this.outline = this.cell.scene.add.graphics({ x: x, y: y });
    this.outline.setDepth(this.depth + 1);

    this.drawOutline(this.outline);
  }

  drawOutline (gfx, type = 'outline') {
    let polygon;

    if (type == 'hitbox')
      polygon = this.tile.hitbox;
    else
      polygon = this.tile.outline;

    gfx.lineStyle(2, 0x00AA00);
    gfx.beginPath();
    gfx.moveTo(polygon.points[0].x, polygon.points[0].y);
    
    for (let i = 1; i < polygon.points.length; i++)
      gfx.lineTo(polygon.points[i].x, polygon.points[i].y);

    gfx.closePath();
    gfx.strokePath();
  }
}

export default tile;