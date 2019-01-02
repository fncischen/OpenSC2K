import Phaser from 'phaser';

export default class events {
  constructor (options) {
    this.cell   = options.cell;
    this.layers = this.cell.scene.city.map.layers;
    this.debug  = {};
  }


  create () {
    this.tile = this.cell.tiles.topTile().tile;

    this.calculatePosition();
    this.createZone();
    //this.debugBox();
  }


  //
  // destroy current zone and re-create it
  //
  refresh () {
    if (this.zone)
      this.zone.destroy();

    // if (this.debug.hitbox)
    //   this.debug.hitbox.destroy();

    this.create();
  }


  //
  // updates x/y and depth of the zone
  // also provides the hitbox
  //
  calculatePosition () {
    let waterType = this.cell.water.type;

    if (this.layers.water && !this.layers.water.visible)
      waterType = 'dry';

    this.x = this.cell.position.bottom.x - (this.tile.width / 2);
    this.y = this.cell.position.bottom.y - (this.tile.height);
    this.depth = this.cell.depth + 1;
    this.hitbox = this.tile.hitbox;
    
    if (waterType != 'dry') {
      this.hitbox = this.cell.scene.globals.tiles[256].hitbox;
      this.y -= this.cell.position.offsets.seaLevel;
    }
  }


  //
  // creates the interactive zone object
  //
  createZone () {
    this.zone = this.cell.scene.add.zone(this.x, this.y, this.cell.scene.globals.tileWidth, this.cell.scene.globals.tileHeight);
    this.zone.cell = this.cell;
    this.zone.setDepth(this.depth);
    this.zone.setOrigin(this.cell.scene.globals.originX, this.cell.scene.globals.originY);
    this.zone.setInteractive(this.hitbox, Phaser.Geom.Polygon.Contains);

    this.zone.on('pointerover', this.onPointerOver);
    this.zone.on('pointerout',  this.onPointerOut);
    this.zone.on('pointermove', this.onPointerMove);
    this.zone.on('pointerdown', this.onPointerDown);
    this.zone.on('pointerup',   this.onPointerUp);
  }


  //
  // draw a 1 box bounding box around the calculated cell position
  //
  debugBox () {
    this.debug.hitbox = this.cell.scene.add.polygon(this.x, this.y, this.hitbox.points, 0xff00ff, 0.15);
    this.debug.hitbox.setDepth(this.depth + 10);
    this.debug.hitbox.setOrigin(this.cell.scene.globals.originX, this.cell.scene.globals.originY);
    this.debug.hitbox.setStrokeStyle(1, 0xff00ff, 0.60);
  }


  onPointerUp (pointer) {

  }


  onPointerDown (pointer, camera) {
    console.log(this.cell);
  }


  onPointerMove (pointer, localX, localY) {
    this.cell.scene.city.map.selectedCell.x = this.cell.x;
    this.cell.scene.city.map.selectedCell.y = this.cell.y;
  }


  onPointerOver (pointer, localX, localY) {
    this.cell.scene.city.map.selectedCell.x = this.cell.x;
    this.cell.scene.city.map.selectedCell.y = this.cell.y;

    this.cell.tiles.sprites.forEach((sprite) => {
      if (sprite.visible)
        sprite.setTint(0xaa0000);
    });

    if (this.cell.tiles.heightmap) {
      if (this.cell.tiles.heightmap.polygon.top){
        this.cell.tiles.heightmap.polygon.top.fillAlpha = 0.5;
      }
      if (this.cell.tiles.heightmap.polygon.slope){
        this.cell.tiles.heightmap.polygon.slope.fillAlpha = 0.5;
      }
    }
  }


  onPointerOut (pointer) {
    this.cell.tiles.sprites.forEach((sprite) => {
      if (sprite.visible)
        sprite.clearTint();
    });

    if (this.cell.tiles.heightmap) {
      if (this.cell.tiles.heightmap.polygon.top){
        this.cell.tiles.heightmap.polygon.top.fillAlpha = 1;
      }
      if (this.cell.tiles.heightmap.polygon.slope){
        this.cell.tiles.heightmap.polygon.slope.fillAlpha = 1;
      }
    }
  }
}