import tile from './tile';
import Phaser from 'phaser';

export default class heightmap extends tile {
  constructor (options) {
    if (!options.tileId)
      options.tileId = options.cell.water.tileId;

    super(options);

    this.type = 'heightmap';
    this.depth = 64;
    this.polygon = {};
    this.colorType = 'terrain';
  }

  getTile (tileId) {
    let tile = super.getTile(tileId);

    if (tile.heightmap && tile.heightmap.reference) {
      tile = super.getTile(tile.heightmap.reference);
      this.tileId = tile.id;
      this.colorType = 'water';
    }

    return tile;
  }

  checkTile () {
    if (!super.checkTile())
      return false;

    return true;
  }

  calculatePosition () {
    if (!this.cell && !this.tile) throw 'Cannot set position for cell '+this.x+', '+this.y+'; references to cell and tile are not defined';

    this.x = this.cell.position.bottom.x - (this.tile.width / 2) << 0;
    this.y = this.cell.position.bottom.y - (this.tile.height) - this.offset << 0;

    this.px = this.cell.position.center.x - (this.tile.width / 2) << 0;
    this.py = this.cell.position.center.y - (this.tile.height) - this.offset << 0;

    this.depth = this.cell.depth || 0;
  }

  create () {
    if (!this.draw)
      return;

    if (!this.cell.scene.common.tiles[this.tileId].heightmap)
      return;

    let heightmap = this.cell.scene.common.tiles[this.tileId].heightmap;
    
    this.calculatePosition();

    let strokeColor = this.color(this.cell.z, this.colorType).darken(40).color;
    let topColor    = this.color(this.cell.z, this.colorType).color;
    let slopeColor  = this.color(this.cell.z, this.colorType).darken(15).color;
    let rightColor  = this.color(this.cell.z, this.colorType).darken(35).color;
    let leftColor   = this.color(this.cell.z, this.colorType).darken(30).lighten(15).color;

    let alphaChannel = 1;

    // top (flat)
    if (heightmap.top) {
      this.polygon.top = this.cell.scene.add.polygon(this.x, this.y, heightmap.top, topColor, alphaChannel);
      this.polygon.top.setStrokeStyle(1, strokeColor, alphaChannel);
      this.polygon.top.setOrigin(0, 0);
      this.polygon.top.setDepth(this.depth);
    }

    // top (slope)
    if (heightmap.slope) {
      this.polygon.slope = this.cell.scene.add.polygon(this.x, this.y, heightmap.slope, slopeColor, alphaChannel);
      this.polygon.slope.setStrokeStyle(1, strokeColor, alphaChannel);
      this.polygon.slope.setOrigin(0, 0);
      this.polygon.slope.setDepth(this.depth);
    }

    // left
    if (heightmap.left) {
      this.polygon.left = this.cell.scene.add.polygon(this.x, this.y, heightmap.left, leftColor, alphaChannel);
      this.polygon.left.setStrokeStyle(1, strokeColor, alphaChannel);
      this.polygon.left.setOrigin(0, 0);
      this.polygon.left.setDepth(this.depth);
    }

    // right
    if (heightmap.right) {
      this.polygon.right = this.cell.scene.add.polygon(this.x, this.y, heightmap.right, rightColor, alphaChannel);
      this.polygon.right.setStrokeStyle(1, strokeColor, alphaChannel);
      this.polygon.right.setOrigin(0, 0);
      this.polygon.right.setDepth(this.depth);
    }
  }


  color (height, type) {
    let terrain = [];
    let water = [];
    let color = new Phaser.Display.Color();

    terrain[0]  = { red:   0, green: 255, blue: 0,   alpha: 1 };
    terrain[1]  = { red:  15, green: 240, blue: 0,   alpha: 1 };
    terrain[2]  = { red:  23, green: 232, blue: 0,   alpha: 1 };
    terrain[3]  = { red:  31, green: 224, blue: 0,   alpha: 1 };
    terrain[4]  = { red:  39, green: 216, blue: 0,   alpha: 1 };
    terrain[5]  = { red:  47, green: 208, blue: 0,   alpha: 1 };
    terrain[6]  = { red:  55, green: 200, blue: 0,   alpha: 1 };
    terrain[7]  = { red:  63, green: 192, blue: 0,   alpha: 1 };
    terrain[8]  = { red:  71, green: 184, blue: 0,   alpha: 1 };
    terrain[9]  = { red:  79, green: 176, blue: 0,   alpha: 1 };
    terrain[10] = { red:  87, green: 168, blue: 0,   alpha: 1 };
    terrain[11] = { red:  95, green: 160, blue: 0,   alpha: 1 };
    terrain[12] = { red: 103, green: 152, blue: 0,   alpha: 1 };
    terrain[13] = { red: 111, green: 144, blue: 0,   alpha: 1 };
    terrain[14] = { red: 119, green: 136, blue: 0,   alpha: 1 };
    terrain[15] = { red: 127, green: 128, blue: 0,   alpha: 1 };
    terrain[16] = { red: 135, green: 120, blue: 0,   alpha: 1 };
    terrain[17] = { red: 143, green: 112, blue: 0,   alpha: 1 };
    terrain[18] = { red: 151, green: 104, blue: 0,   alpha: 1 };
    terrain[19] = { red: 159, green:  96, blue: 0,   alpha: 1 };
    terrain[20] = { red: 167, green:  88, blue: 0,   alpha: 1 };
    terrain[21] = { red: 175, green:  80, blue: 0,   alpha: 1 };
    terrain[22] = { red: 183, green:  72, blue: 0,   alpha: 1 };
    terrain[23] = { red: 191, green:  64, blue: 0,   alpha: 1 };
    terrain[24] = { red: 199, green:  56, blue: 0,   alpha: 1 };
    terrain[25] = { red: 207, green:  48, blue: 0,   alpha: 1 };
    terrain[26] = { red: 215, green:  40, blue: 0,   alpha: 1 };
    terrain[27] = { red: 223, green:  32, blue: 0,   alpha: 1 };
    terrain[28] = { red: 231, green:  24, blue: 0,   alpha: 1 };
    terrain[29] = { red: 239, green:  16, blue: 0,   alpha: 1 };
    terrain[30] = { red: 247, green:   8, blue: 0,   alpha: 1 };
    terrain[31] = { red: 255, green:   0, blue: 0,   alpha: 1 };

    water[0]    = { red: 7,   green: 28,  blue: 151, alpha: 1 };
    water[1]    = { red: 7,   green: 35,  blue: 164, alpha: 1 };
    water[2]    = { red: 7,   green: 42,  blue: 177, alpha: 1 };
    water[3]    = { red: 7,   green: 49,  blue: 190, alpha: 1 };
    water[4]    = { red: 7,   green: 56,  blue: 203, alpha: 1 };
    water[5]    = { red: 7,   green: 63,  blue: 216, alpha: 1 };
    water[6]    = { red: 7,   green: 70,  blue: 229, alpha: 1 };
    water[7]    = { red: 7,   green: 77,  blue: 242, alpha: 1 };
    water[8]    = { red: 7,   green: 84,  blue: 255, alpha: 1 };
    water[9]    = { red: 7,   green: 91,  blue: 268, alpha: 1 };
    water[10]   = { red: 7,   green: 98,  blue: 281, alpha: 1 };
    water[11]   = { red: 7,   green: 105, blue: 294, alpha: 1 };
    water[12]   = { red: 7,   green: 112, blue: 307, alpha: 1 };
    water[13]   = { red: 7,   green: 119, blue: 320, alpha: 1 };
    water[14]   = { red: 7,   green: 126, blue: 333, alpha: 1 };
    water[15]   = { red: 7,   green: 133, blue: 346, alpha: 1 };
    water[16]   = { red: 7,   green: 140, blue: 359, alpha: 1 };
    water[17]   = { red: 7,   green: 147, blue: 372, alpha: 1 };
    water[18]   = { red: 7,   green: 154, blue: 385, alpha: 1 };
    water[19]   = { red: 7,   green: 161, blue: 398, alpha: 1 };
    water[20]   = { red: 7,   green: 168, blue: 411, alpha: 1 };
    water[21]   = { red: 7,   green: 175, blue: 424, alpha: 1 };
    water[22]   = { red: 7,   green: 182, blue: 437, alpha: 1 };
    water[23]   = { red: 7,   green: 189, blue: 450, alpha: 1 };
    water[24]   = { red: 7,   green: 196, blue: 463, alpha: 1 };
    water[25]   = { red: 7,   green: 203, blue: 476, alpha: 1 };
    water[26]   = { red: 7,   green: 210, blue: 489, alpha: 1 };
    water[27]   = { red: 7,   green: 217, blue: 502, alpha: 1 };
    water[28]   = { red: 7,   green: 224, blue: 515, alpha: 1 };
    water[29]   = { red: 7,   green: 231, blue: 528, alpha: 1 };
    water[30]   = { red: 7,   green: 238, blue: 541, alpha: 1 };
    water[31]   = { red: 20,  green: 192, blue: 255, alpha: 1 };

    if (type == 'water')
      return color.setTo(water[height].red, water[height].green, water[height].blue, water[height].alpha);
    else
      return color.setTo(terrain[height].red, terrain[height].green, terrain[height].blue, terrain[height].alpha);

  }
}