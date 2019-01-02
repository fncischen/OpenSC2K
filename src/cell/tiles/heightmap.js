import tile from './tile';
import Phaser from 'phaser';

export default class heightmap extends tile {
  constructor (options) {
    if (!options.id)
      options.id = options.cell.water.id;

    options.type = 'heightmap';
    super(options);
    
    this.depth = 64;
    this.polygon = {};
    this.colorType = 'terrain';
  }

  getTile (id) {
    let tile = super.getTile(id);

    if (tile.heightmap && tile.heightmap.reference) {
      tile = super.getTile(tile.heightmap.reference);
      this.id = tile.id;
      this.colorType = 'water';
    }

    return tile;
  }

  checkTile () {
    if (!super.checkTile())
      return false;

    return true;
  }

  // calculatePosition () {
  //   this.x = this.cell.position.topLeft.x - (this.tile.width / 2) << 0;
  //   this.y = this.cell.position.topLeft.y - (this.tile.height) - this.offset << 0;

  //   this.px = this.cell.position.center.x - (this.tile.width / 2) << 0;
  //   this.py = this.cell.position.center.y - (this.tile.height) - this.offset << 0;

  //   this.depth = this.cell.depth || 0;
  // }

  create () {
    if (!this.draw)
      return;

    if (!this.cell.scene.globals.tiles[this.id].heightmap)
      return;

    let heightmap = this.cell.scene.globals.tiles[this.id].heightmap;
    
    this.calculatePosition();

    let baseColor      = Phaser.Display.Color.ObjectToColor(this.color(this.cell.z, this.colorType));
    let baseColorUpper = Phaser.Display.Color.ObjectToColor(this.color(this.cell.z + 1, this.colorType));
    let alpha = 1;

    let strokeColor = baseColor.clone().darken(60).color;

    let lower     = baseColor.clone().color;
    let upper     = baseColorUpper.clone().color;

    let south     = baseColor.clone().darken(10).color;
    let east      = baseColor.clone().darken(20).color;
    let west      = baseColor.clone().darken(30).color;

    let southEast = baseColor.clone().lighten(10).color;
    let southWest = baseColor.clone().darken(25).color;
    let northEast = baseColor.clone().darken(40).color;
    let northWest = baseColor.clone().darken(40).color;

    // rock faces
    let rockTop       = baseColor.clone().color;
    let rockSouthWest = baseColor.clone().darken(50).color;
    let rockSouthEast = baseColor.clone().darken(50).color;


    if (heightmap.upper) {
      this.polygon.upper = this.cell.scene.add.polygon(this.x, this.y, heightmap.upper, upper, alpha);
      this.polygon.upper.setStrokeStyle(1, strokeColor, alpha);
      this.polygon.upper.setOrigin(this.cell.scene.globals.originX, this.cell.scene.globals.originY);
      this.polygon.upper.setDepth(this.depth);
    }

    if (heightmap.lower) {
      this.polygon.lower = this.cell.scene.add.polygon(this.x, this.y, heightmap.lower, lower, alpha);
      this.polygon.lower.setStrokeStyle(1, strokeColor, alpha);
      this.polygon.lower.setOrigin(this.cell.scene.globals.originX, this.cell.scene.globals.originY);
      this.polygon.lower.setDepth(this.depth);
    }

    if (heightmap.south) {
      this.polygon.south = this.cell.scene.add.polygon(this.x, this.y, heightmap.south, south, alpha);
      this.polygon.south.setStrokeStyle(1, strokeColor, alpha);
      this.polygon.south.setOrigin(this.cell.scene.globals.originX, this.cell.scene.globals.originY);
      this.polygon.south.setDepth(this.depth);
    }

    if (heightmap.east) {
      this.polygon.east = this.cell.scene.add.polygon(this.x, this.y, heightmap.east, east, alpha);
      this.polygon.east.setStrokeStyle(1, strokeColor, alpha);
      this.polygon.east.setOrigin(this.cell.scene.globals.originX, this.cell.scene.globals.originY);
      this.polygon.east.setDepth(this.depth);
    }

    if (heightmap.west) {
      this.polygon.west = this.cell.scene.add.polygon(this.x, this.y, heightmap.west, west, alpha);
      this.polygon.west.setStrokeStyle(1, strokeColor, alpha);
      this.polygon.west.setOrigin(this.cell.scene.globals.originX, this.cell.scene.globals.originY);
      this.polygon.west.setDepth(this.depth);
    }

    if (heightmap.southEast) {
      this.polygon.southEast = this.cell.scene.add.polygon(this.x, this.y, heightmap.southEast, southEast, alpha);
      this.polygon.southEast.setStrokeStyle(1, strokeColor, alpha);
      this.polygon.southEast.setOrigin(this.cell.scene.globals.originX, this.cell.scene.globals.originY);
      this.polygon.southEast.setDepth(this.depth);
    }

    if (heightmap.southWest) {
      this.polygon.southWest = this.cell.scene.add.polygon(this.x, this.y, heightmap.southWest, southWest, alpha);
      this.polygon.southWest.setStrokeStyle(1, strokeColor, alpha);
      this.polygon.southWest.setOrigin(this.cell.scene.globals.originX, this.cell.scene.globals.originY);
      this.polygon.southWest.setDepth(this.depth);
    }

    if (heightmap.northEast) {
      this.polygon.northEast = this.cell.scene.add.polygon(this.x, this.y, heightmap.northEast, northEast, alpha);
      this.polygon.northEast.setStrokeStyle(1, strokeColor, alpha);
      this.polygon.northEast.setOrigin(this.cell.scene.globals.originX, this.cell.scene.globals.originY);
      this.polygon.northEast.setDepth(this.depth);
    }

    if (heightmap.northWest) {
      this.polygon.northWest = this.cell.scene.add.polygon(this.x, this.y, heightmap.northWest, northWest, alpha);
      this.polygon.northWest.setStrokeStyle(1, strokeColor, alpha);
      this.polygon.northWest.setOrigin(this.cell.scene.globals.originX, this.cell.scene.globals.originY);
      this.polygon.northWest.setDepth(this.depth);
    }

    if (heightmap.rockTop) {
      this.polygon.rockTop = this.cell.scene.add.polygon(this.x, this.y, heightmap.rockTop, rockTop, alpha);
      this.polygon.rockTop.setStrokeStyle(1, strokeColor, alpha);
      this.polygon.rockTop.setOrigin(this.cell.scene.globals.originX, this.cell.scene.globals.originY);
      this.polygon.rockTop.setDepth(this.depth);
    }

    if (heightmap.rockSouthWest) {
      this.polygon.rockSouthWest = this.cell.scene.add.polygon(this.x, this.y, heightmap.rockSouthWest, rockSouthWest, alpha);
      this.polygon.rockSouthWest.setStrokeStyle(1, strokeColor, alpha);
      this.polygon.rockSouthWest.setOrigin(this.cell.scene.globals.originX, this.cell.scene.globals.originY);
      this.polygon.rockSouthWest.setDepth(this.depth);
    }

    if (heightmap.rockSouthEast) {
      this.polygon.rockSouthEast = this.cell.scene.add.polygon(this.x, this.y, heightmap.rockSouthEast, rockSouthEast, alpha);
      this.polygon.rockSouthEast.setStrokeStyle(1, strokeColor, alpha);
      this.polygon.rockSouthEast.setOrigin(this.cell.scene.globals.originX, this.cell.scene.globals.originY);
      this.polygon.rockSouthEast.setDepth(this.depth);
    }
  }


  color (height, type) {
    if (height > 31)
      height = 31;

    if (height < 0)
      height = 0;

    let terrain = [];
    terrain[0]  = { r:   0, g: 255, b: 0,   a: 1 };
    terrain[1]  = { r:  15, g: 240, b: 0,   a: 1 };
    terrain[2]  = { r:  23, g: 232, b: 0,   a: 1 };
    terrain[3]  = { r:  31, g: 224, b: 0,   a: 1 };
    terrain[4]  = { r:  39, g: 216, b: 0,   a: 1 };
    terrain[5]  = { r:  47, g: 208, b: 0,   a: 1 };
    terrain[6]  = { r:  55, g: 200, b: 0,   a: 1 };
    terrain[7]  = { r:  63, g: 192, b: 0,   a: 1 };
    terrain[8]  = { r:  71, g: 184, b: 0,   a: 1 };
    terrain[9]  = { r:  79, g: 176, b: 0,   a: 1 };
    terrain[10] = { r:  87, g: 168, b: 0,   a: 1 };
    terrain[11] = { r:  95, g: 160, b: 0,   a: 1 };
    terrain[12] = { r: 103, g: 152, b: 0,   a: 1 };
    terrain[13] = { r: 111, g: 144, b: 0,   a: 1 };
    terrain[14] = { r: 119, g: 136, b: 0,   a: 1 };
    terrain[15] = { r: 127, g: 128, b: 0,   a: 1 };
    terrain[16] = { r: 135, g: 120, b: 0,   a: 1 };
    terrain[17] = { r: 143, g: 112, b: 0,   a: 1 };
    terrain[18] = { r: 151, g: 104, b: 0,   a: 1 };
    terrain[19] = { r: 159, g:  96, b: 0,   a: 1 };
    terrain[20] = { r: 167, g:  88, b: 0,   a: 1 };
    terrain[21] = { r: 175, g:  80, b: 0,   a: 1 };
    terrain[22] = { r: 183, g:  72, b: 0,   a: 1 };
    terrain[23] = { r: 191, g:  64, b: 0,   a: 1 };
    terrain[24] = { r: 199, g:  56, b: 0,   a: 1 };
    terrain[25] = { r: 207, g:  48, b: 0,   a: 1 };
    terrain[26] = { r: 215, g:  40, b: 0,   a: 1 };
    terrain[27] = { r: 223, g:  32, b: 0,   a: 1 };
    terrain[28] = { r: 231, g:  24, b: 0,   a: 1 };
    terrain[29] = { r: 239, g:  16, b: 0,   a: 1 };
    terrain[30] = { r: 247, g:   8, b: 0,   a: 1 };
    terrain[31] = { r: 255, g:   0, b: 0,   a: 1 };

    let water = [];
    water[0]    = { r: 7,   g: 28,  b: 151, a: 1 };
    water[1]    = { r: 7,   g: 35,  b: 164, a: 1 };
    water[2]    = { r: 7,   g: 42,  b: 177, a: 1 };
    water[3]    = { r: 7,   g: 49,  b: 190, a: 1 };
    water[4]    = { r: 7,   g: 56,  b: 203, a: 1 };
    water[5]    = { r: 7,   g: 63,  b: 216, a: 1 };
    water[6]    = { r: 7,   g: 70,  b: 229, a: 1 };
    water[7]    = { r: 7,   g: 77,  b: 242, a: 1 };
    water[8]    = { r: 7,   g: 84,  b: 255, a: 1 };
    water[9]    = { r: 7,   g: 91,  b: 268, a: 1 };
    water[10]   = { r: 7,   g: 98,  b: 281, a: 1 };
    water[11]   = { r: 7,   g: 105, b: 294, a: 1 };
    water[12]   = { r: 7,   g: 112, b: 307, a: 1 };
    water[13]   = { r: 7,   g: 119, b: 320, a: 1 };
    water[14]   = { r: 7,   g: 126, b: 333, a: 1 };
    water[15]   = { r: 7,   g: 133, b: 346, a: 1 };
    water[16]   = { r: 7,   g: 140, b: 359, a: 1 };
    water[17]   = { r: 7,   g: 147, b: 372, a: 1 };
    water[18]   = { r: 7,   g: 154, b: 385, a: 1 };
    water[19]   = { r: 7,   g: 161, b: 398, a: 1 };
    water[20]   = { r: 7,   g: 168, b: 411, a: 1 };
    water[21]   = { r: 7,   g: 175, b: 424, a: 1 };
    water[22]   = { r: 7,   g: 182, b: 437, a: 1 };
    water[23]   = { r: 7,   g: 189, b: 450, a: 1 };
    water[24]   = { r: 7,   g: 196, b: 463, a: 1 };
    water[25]   = { r: 7,   g: 203, b: 476, a: 1 };
    water[26]   = { r: 7,   g: 210, b: 489, a: 1 };
    water[27]   = { r: 7,   g: 217, b: 502, a: 1 };
    water[28]   = { r: 7,   g: 224, b: 515, a: 1 };
    water[29]   = { r: 7,   g: 231, b: 528, a: 1 };
    water[30]   = { r: 7,   g: 238, b: 541, a: 1 };
    water[31]   = { r: 20,  g: 192, b: 255, a: 1 };


    heightmap[0]  = { r: 0,   g: 4,   b: 255, a: 1 };
    heightmap[1]  = { r: 0,   g: 37,  b: 255, a: 1 };
    heightmap[2]  = { r: 0,   g: 68,  b: 255, a: 1 };
    heightmap[3]  = { r: 0,   g: 99,  b: 255, a: 1 };
    heightmap[4]  = { r: 0,   g: 131, b: 255, a: 1 };
    heightmap[5]  = { r: 0,   g: 163, b: 255, a: 1 };
    heightmap[6]  = { r: 0,   g: 195, b: 255, a: 1 };
    heightmap[7]  = { r: 3,   g: 227, b: 255, a: 1 };
    heightmap[8]  = { r: 0,   g: 255, b: 251, a: 1 };
    heightmap[9]  = { r: 9,   g: 255, b: 219, a: 1 };
    heightmap[10] = { r: 11,  g: 255, b: 187, a: 1 };
    heightmap[11] = { r: 12,  g: 255, b: 155, a: 1 };
    heightmap[12] = { r: 14,  g: 255, b: 123, a: 1 };
    heightmap[13] = { r: 14,  g: 255, b: 91,  a: 1 };
    heightmap[14] = { r: 16,  g: 255, b: 58,  a: 1 };
    heightmap[15] = { r: 16,  g: 255, b: 25,  a: 1 };
    heightmap[16] = { r: 19,  g: 255, b: 0,   a: 1 };
    heightmap[17] = { r: 41,  g: 255, b: 0,   a: 1 };
    heightmap[18] = { r: 70,  g: 255, b: 0,   a: 1 };
    heightmap[19] = { r: 101, g: 255, b: 0,   a: 1 };
    heightmap[20] = { r: 132, g: 255, b: 0,   a: 1 };
    heightmap[21] = { r: 164, g: 255, b: 0,   a: 1 };
    heightmap[22] = { r: 195, g: 255, b: 0,   a: 1 };
    heightmap[23] = { r: 227, g: 255, b: 0,   a: 1 };
    heightmap[24] = { r: 255, g: 251, b: 0,   a: 1 };
    heightmap[25] = { r: 255, g: 219, b: 0,   a: 1 };
    heightmap[26] = { r: 255, g: 187, b: 0,   a: 1 };
    heightmap[27] = { r: 255, g: 155, b: 0,   a: 1 };
    heightmap[28] = { r: 255, g: 123, b: 0,   a: 1 };
    heightmap[29] = { r: 255, g: 91,  b: 0,   a: 1 };
    heightmap[30] = { r: 255, g: 59,  b: 0,   a: 1 };
    heightmap[31] = { r: 255, g: 26,  b: 0,   a: 1 };
    
    //return type == 'water' ? water[height] : terrain[height];
    return heightmap[height];
  }
}