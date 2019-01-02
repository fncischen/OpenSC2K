import tiles from './tiles';

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

    this.max = 127;
    if (this.x > this.max || this.y > this.max)
      return;

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
      width: this.position.right.x - this.position.left.x,
      height: this.position.top.y - this.position.bottom.y,
    };

    this.debug.box = this.scene.add.rectangle(bounds.x, bounds.y, bounds.width, bounds.height, 0x00ff00, 0.10);
    this.debug.box.setOrigin(this.scene.globals.originX, this.scene.globals.originY);
    this.debug.box.setDepth(this.depth + 50);
    this.debug.box.setStrokeStyle(1, 0x00ff00, 0.60);

    this.debug.center = this.scene.add.circle(center.x, center.y, 1, 0x00ff00, 0.75);
    this.debug.center.setOrigin(this.scene.globals.originX, this.scene.globals.originY);
    this.debug.center.setDepth(this.depth + 50);
  }


  //
  // draw a text label with the cell location above all other objects
  //
  debugLabels () {
    this.debug.label = this.scene.add.text(this.position.center.x, this.position.center.y, this.x+','+this.y+','+this.z, { fontFamily: 'Verdana', fontSize: 8, color: '#ffffff' });
    this.debug.label.setDepth(this.depth + 1000);
    this.debug.label.setOrigin(0.5, 0.5);
  }


  create () {
    if (this.x > this.max || this.y > this.max)
      return;

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
    return this._position.depth.base + this._position.depth.adjust;
  }

  set depth(depth) {
    // add constant of 1024 to depth values to prevent negative values
    this._position.depth.base = (depth.base + 1024) || 1024;
    this._position.depth.adjust = depth.adjust || 0;
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
      topLeft:     corners.topLeft,
      topRight:    corners.topRight,
      bottomLeft:  corners.bottomLeft,
      bottomRight: corners.bottomRight,
      noCorners:   corners.noCorners,
    };
  }

  get position () {
    return this._position;
  }

  set position (location) {
    let pos = this._position || {};
    let width  = this.scene.globals.tileWidth;
    let height = this.scene.globals.tileHeight;
    let layers = this.scene.globals.layerOffset;

    pos.location = {
      x: location.x,
      y: location.y,
      z: location.z,
    };

    // for ease of use
    this.x = location.x;
    this.y = location.y;
    this.z = location.z;

    let offsetX   = (pos.location.x - pos.location.y) * (width / 2);
    let offsetY   = (pos.location.y + pos.location.x) * (height / 2);
    let offsetZ   = (layers * pos.location.z) + layers;
    let seaLevel  = ((this.scene.city.waterLevel - pos.location.z) * layers);

    if (seaLevel < 0)
      seaLevel = 0;

    if ((this.water.type == 'submerged' || this.water.type == 'shore') && pos.location.z < this.scene.city.waterLevel)
      pos.underwater = true;
    else
      pos.underwater = false;

    pos.depth = {
      base: ((pos.location.x + pos.location.y) * 64) + 1024,
      adjust: 0,
    };

    pos.offsets = {
      x: offsetX,
      y: offsetY,
      z: offsetZ,
      seaLevel: seaLevel,
    };

    pos.top = {
      x: offsetX + (width / 2),
      y: offsetY - offsetZ
    };
    
    pos.right = {
      x: offsetX + width,
      y: (offsetY - offsetZ) + height - (height / 2)
    };

    pos.bottom = {
      x: offsetX + (width / 2),
      y: (offsetY - offsetZ) + height
    };

    pos.left = {
      x: offsetX,
      y: (offsetY - offsetZ) + height - (height / 2)
    };

    pos.center = {
      x: offsetX + (width / 2),
      y: (offsetY - offsetZ) - (height / 2) + height
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
    console.log(this);
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