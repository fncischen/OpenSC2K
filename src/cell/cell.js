import tiles from './tiles';
import * as CONST from '../constants';

export default class cell {
  constructor (options) {
    this.scene  = options.scene;
    this.debug  = {};

    this.water        = options.data.water;
    this.position     = { x: options.data.x, y: options.data.y, z: options.data.z };
    this.corners      = options.data.corners;
    this.rotate       = options.data.rotate;
    this.zone         = options.data.zone.type;
    this._segmentData = options.data._segmentData;
    this.utilities    = {
      pipes: options.data.pipes,
      power: options.data.power
    };

    this._max = 127;
    if (this.x > this._max || this.y > this._max) return;

    this.sprites = [];

    this.tiles = new tiles({ cell: this, list: options.data.tiles._list });

    //this.debugLabels();
    //this.debugBox();
    
    return this;
  }


  //
  // draw a 1px box bounding box around the calculated cell position
  //
  debugBox () {
    let center = this.position.center;
    let bounds = {
      x: this.position.topLeft.x,
      y: this.position.topLeft.y,
      w: this.position.right.x - this.position.left.x,
      h: this.position.top.y - this.position.bottom.y,
    };

    this.debug.box = this.scene.add.rectangle(bounds.x, bounds.y, bounds.w, bounds.h, 0x00ff00, 0.10);
    this.debug.box.setOrigin(CONST.ORIGIN_X, CONST.ORIGIN_Y);
    this.debug.box.setDepth(this.depth + 128);
    this.debug.box.setStrokeStyle(1, 0x00ff00, 0.60);

    this.debug.center = this.scene.add.circle(center.x, center.y, 1, 0x00ff00, 0.75);
    this.debug.center.setOrigin(CONST.ORIGIN_X, CONST.ORIGIN_Y);
    this.debug.center.setDepth(this.depth + 128);
  }


  //
  // draw a text label with the cell location above all other objects
  //
  debugLabels () {
    this.debug.label = this.scene.add.text(this.position.center.x, this.position.center.y, this.x+','+this.y+','+this.z, { fontFamily: 'Verdana', fontSize: 8, color: '#ffffff' });
    this.debug.label.setDepth(this.depth + 128);
    this.debug.label.setOrigin(0.5, 0.5);
  }


  create () {
    if (this.x > this._max || this.y > this._max) return;

    this.tiles.create();
  }

  hide () {
    this.tiles.hide();
  }

  show () {
    this.tiles.show();
  }


  get surrounding () {
    let map   = this.scene.city.map;
    let cells = {};
    let cellX = 0;
    let cellY = 0;

    for (let x = -1; x < 2; x++) {
      for (let y = -1; y < 2; y++) {
        cellX = this.x + x;
        cellY = this.y + y;

        if (x == -1 && y == -1 && map.cells[cellX] && map.cells[cellX][cellY]) cells.nw = map.cells[cellX][cellY];
        if (x == -1 && y ==  0 && map.cells[cellX] && map.cells[cellX][cellY]) cells.w  = map.cells[cellX][cellY];
        if (x == -1 && y ==  1 && map.cells[cellX] && map.cells[cellX][cellY]) cells.sw = map.cells[cellX][cellY];

        if (x ==  0 && y == -1 && map.cells[cellX] && map.cells[cellX][cellY]) cells.n  = map.cells[cellX][cellY];
        if (x ==  0 && y ==  0 && map.cells[cellX] && map.cells[cellX][cellY]) cells.c  = map.cells[cellX][cellY];
        if (x ==  0 && y ==  1 && map.cells[cellX] && map.cells[cellX][cellY]) cells.s  = map.cells[cellX][cellY];

        if (x ==  1 && y == -1 && map.cells[cellX] && map.cells[cellX][cellY]) cells.ne = map.cells[cellX][cellY];
        if (x ==  1 && y ==  0 && map.cells[cellX] && map.cells[cellX][cellY]) cells.e  = map.cells[cellX][cellY];
        if (x ==  1 && y ==  1 && map.cells[cellX] && map.cells[cellX][cellY]) cells.se = map.cells[cellX][cellY];
      }
    }

    return cells;
  }

  get depth () {
    return this._position.depth;
  }

  set depth(depth) {
    this._position.depth = depth;
  }

  get rotate () {
    return this._position.rotate;
  }

  set rotate (rotate) {
    this._position.rotate = rotate;
  }

  get corners () {
    return this._position.corners;
  }

  set corners (corners) {
    this._position.corners = {
      top:    corners.top,
      right:  corners.right,
      bottom: corners.bottom,
      left:   corners.left,
      none:   corners.none,
    };
  }

  get position () {
    return this._position;
  }

  set position (location) {
    let pos = this._position || {};

    pos.location = {
      x: location.x,
      y: location.y,
      z: location.z,
    };

    // for ease of use
    this.x = location.x;
    this.y = location.y;
    this.z = location.z;

    let offsetX   = (pos.location.x - pos.location.y) * (CONST.TILE_WIDTH / 2);
    let offsetY   = (pos.location.y + pos.location.x) * (CONST.TILE_HEIGHT / 2);
    let offsetZ   = (CONST.LAYER_OFFSET * pos.location.z) + CONST.LAYER_OFFSET;
    let seaLevel  = ((this.scene.city.waterLevel - pos.location.z) * CONST.LAYER_OFFSET);

    if (seaLevel < 0)
      seaLevel = 0;

    if ((this.water.type == CONST.TERRAIN_SUBMERGED || this.water.type == CONST.TERRAIN_SHORE) && pos.location.z < this.scene.city.waterLevel)
      pos.underwater = true;
    else
      pos.underwater = false;

    pos.depth = (pos.location.x + pos.location.y) * 64;

    pos.offsets = {
      x: offsetX,
      y: offsetY,
      z: offsetZ,
      seaLevel: seaLevel,
    };

    pos.top = {
      x: offsetX + (CONST.TILE_WIDTH / 2),
      y: offsetY - offsetZ
    };
    
    pos.right = {
      x: offsetX + CONST.TILE_WIDTH,
      y: (offsetY - offsetZ) + CONST.TILE_HEIGHT - (CONST.TILE_HEIGHT / 2)
    };

    pos.bottom = {
      x: offsetX + (CONST.TILE_WIDTH / 2),
      y: (offsetY - offsetZ) + CONST.TILE_HEIGHT
    };

    pos.left = {
      x: offsetX,
      y: (offsetY - offsetZ) + CONST.TILE_HEIGHT - (CONST.TILE_HEIGHT / 2)
    };

    pos.center = {
      x: offsetX + (CONST.TILE_WIDTH / 2),
      y: (offsetY - offsetZ) - (CONST.TILE_HEIGHT / 2) + CONST.TILE_HEIGHT
    };

    pos.bottomLeft = {
      x: pos.left.x,
      y: pos.bottom.y,
    };

    pos.bottomRight = {
      x: pos.right.x,
      y: pos.bottom.y,
    };

    pos.topLeft = {
      x: pos.left.x,
      y: pos.top.y,
    };

    pos.topRight = {
      x: pos.right.x,
      y: pos.top.y,
    };

    this._position = pos;
  }


  onPointerUp (pointer) {

  }


  onPointerDown (pointer, camera) {
    //console.log(this);
  }


  onPointerMove (pointer, localX, localY) {
    // todo: change this reference to "this"
    this.scene.city.map.selectedCell.x = this.x;
    this.scene.city.map.selectedCell.y = this.y;
  }


  onPointerOver (pointer, localX, localY) {
    this.scene.city.map.selectedCell.x = this.x;
    this.scene.city.map.selectedCell.y = this.y;

    this.tiles.sprites.forEach((sprite) => {
      if (sprite.visible)
        sprite.setTint(0xaa0000);
    });

    if (this.tiles.heightmap) {
      if (this.tiles.heightmap.polygon.top){
        this.tiles.heightmap.polygon.top.fillAlpha = 0.5;
      }
      if (this.tiles.heightmap.polygon.slope){
        this.tiles.heightmap.polygon.slope.fillAlpha = 0.5;
      }
    }
  }


  onPointerOut (pointer) {
    this.tiles.sprites.forEach((sprite) => {
      if (sprite.visible)
        sprite.clearTint();
    });

    if (this.tiles.heightmap) {
      if (this.tiles.heightmap.polygon.top){
        this.tiles.heightmap.polygon.top.fillAlpha = 1;
      }
      if (this.tiles.heightmap.polygon.slope){
        this.tiles.heightmap.polygon.slope.fillAlpha = 1;
      }
    }
  }
}