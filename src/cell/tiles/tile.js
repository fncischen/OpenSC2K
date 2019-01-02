import Phaser from 'phaser';

export default class tile {
  constructor (options) {
    this.cell           = options.cell;
    this.type           = options.type;
    this.map            = options.cell.scene.city.map;
    this.draw           = false;
    this.flipTile       = false;
    this.depth          = 0;
    this.x              = options.x || this.cell.position.topLeft.x || 0;
    this.y              = options.y || this.cell.position.topLeft.y || 0;
    this.offsetY        = 0;
    this.offsetX        = 0;
    this.offset         = options.offset || 0;
    this.sprite         = null;
    this.tile           = this.getTile(options.id);
    this.id             = options.id;
    this.originalId     = options.id;
    this.debug          = {};

    if (!this.checkTile())
      return;

    this.draw = true;
  }

  getTile (id) {
    if (!this.cell.scene.globals.tiles[id])
      return false;

    id = this.cell.scene.globals.tiles[id].rotate[this.cell.scene.city.cameraRotation];

    return this.cell.scene.globals.tiles[id];
  }

  checkTile () {
    if (this.cell == undefined)
      return false;

    return true;
  }

  checkKeyTile () {
    if (this.tile.size == 1 || this.cell.corners.noCorners)
      return true;

    return this.cell.corners[this.cell.scene.city.keyTile];
  }

  hide () {
    if (!this.draw)
      return;

    if (this.sprite && this.sprite.visible) {
      this.sprite.setVisible(false);
    }
  }

  show () {
    if (!this.draw)
      return;

    if (this.sprite && !this.sprite.visible) {
      this.sprite.setVisible(true);
    }
  }

  refresh () {
    this.hide();
    this.show();
  }

  flip (tile = this.tile) {
    if (!tile.flip)
      return false;
    
    if (this.cell.scene.city.cameraRotation == 1 || this.cell.scene.city.cameraRotation == 3)
      return this.cell.rotate ? false : true;
    else
      return this.cell.rotate;
  }

  tileLogic () {
    return;
  }

  calculatePosition () {
    this.x = this.cell.position.topLeft.x - (this.tile.width / 2);
    this.y = this.cell.position.topLeft.y - (this.tile.height);
  }

  create () {
    if (!this.draw)
      return;

    this.tileLogic();
    this.calculatePosition();

    //    if (this.tile.layers && this.tile.layers.base) {
    //      let baseTile = this.getTile(this.tile.layers.base);
    //      let offsetX = this.tile.width - baseTile.width;
    //      let offsetY = this.tile.height - baseTile.height;
    //
    //      this.baseSprite = this.cell.scene.add.sprite(this.x + offsetX, this.y + offsetY, this.cell.scene.globals.tilemap, baseTile.textures[0]);
    //      this.baseSprite.cell = this.cell;
    //      this.baseSprite.setScale(this.cell.scene.globals.scale);
    //      this.baseSprite.setOrigin(this.cell.scene.globals.originX, this.cell.scene.globals.originY);
    //      this.baseSprite.setDepth(this.cell.depth + this.depth);
    //      this.cell.addSprite(this.baseSprite, this.type);
    //    }

    if (this.tile.frames > 1)
      this.sprite = this.cell.scene.add.sprite(this.x, this.y, this.cell.scene.globals.tilemap).play(this.tile.image);
    else
      this.sprite = this.cell.scene.add.sprite(this.x, this.y, this.cell.scene.globals.tilemap, this.tile.textures[0]);

    this.sprite.cell = this.cell;
    this.sprite.type = this.type;

    this.sprite.setScale(this.cell.scene.globals.scale);
    this.sprite.setOrigin(this.cell.scene.globals.originX, this.cell.scene.globals.originY);

    // set tile sprite depth
    this.depth = this.cell.depth + this.depth + (this.tile.depthAdjustment || 0);
    this.sprite.setDepth(this.depth);


    this.cell.tiles.addSprite(this.sprite, this.type);
    this.cell.tiles.addTile(this);


    this.events();
    //this.debugBox();
    this.debugHitbox();
  }

  events () {
    if (!this.sprite)
      return;

    this.hitbox = this.tile.hitbox;

    this.sprite.setInteractive(this.hitbox, Phaser.Geom.Polygon.Contains);
    this.sprite.on('pointerover', this.cell.onPointerOver, this.cell);
    this.sprite.on('pointerout',  this.cell.onPointerOut,  this.cell);
    this.sprite.on('pointermove', this.cell.onPointerMove, this.cell);
    this.sprite.on('pointerdown', this.cell.onPointerDown, this.cell);
    this.sprite.on('pointerup',   this.cell.onPointerUp,   this.cell);
  }

  simulation () {
    return;
  }

  debugBox () {
    let bounds = this.sprite.getBounds();
    let center = this.sprite.getCenter();

    this.debug.box = this.cell.scene.add.rectangle(bounds.x, bounds.y, bounds.width, bounds.height, 0x00ffff, 0.10);
    this.debug.box.setOrigin(this.cell.scene.globals.originX, this.cell.scene.globals.originY);
    this.debug.box.setDepth(this.depth + 2);
    this.debug.box.setStrokeStyle(1, 0x00ffff, 0.75);

    this.debug.center = this.cell.scene.add.circle(center.x, center.y, 1, 0x00ffff, 0.75);
    this.debug.center.setOrigin(this.cell.scene.globals.originX, this.cell.scene.globals.originY);
    this.debug.center.setDepth(this.depth + 2);
  }

  debugHitbox () {
    this.debug.hitbox = this.cell.scene.add.polygon(this.x, this.y, this.hitbox.points, 0xff00ff, 0.15);
    this.debug.hitbox.setDepth(this.depth + 10);
    this.debug.hitbox.setScale(this.cell.scene.globals.scale);
    this.debug.hitbox.setOrigin(this.cell.scene.globals.originX, this.cell.scene.globals.originY);
    this.debug.hitbox.setStrokeStyle(1, 0xff00ff, 0.60);
  }
}