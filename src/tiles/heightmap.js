import tile from './tiles';
import Phaser from 'phaser';

class heightmap extends tile {
  constructor (options) {
    if (!options.tileId)
      options.tileId = options.cell.water.tileId;

    super(options);

    this.type = 'heightmap';
    this.depth = 64;
  }

  getTile (tileId) {
    if (this.cell.properties.waterLevel == 'surface' && tileId != 284)
      tileId = 256;

    if (tileId == 284)
      tileId = 269;

    return super.getTile(tileId);
  }

  checkTile () {
    if (!super.checkTile())
      return false;

    // todo: remove this later
    // skip water for now
    if ([270,271,272,273,274,275,276,277,278,279,280,281,282,283,284,285,286,287,288,289,290].includes(this.tileId))
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

    this.calculatePosition();

    //let texture = this.tile.textures[0].replace('_0', '_V_' + this.cell.z);
    //this.sprite = this.cell.scene.add.sprite(this.x, this.y, this.cell.scene.common.tilemap, texture);
    //this.sprite.cell = this.cell;
    //this.sprite.type = this.type;
    //this.sprite.setScale(this.cell.scene.common.scale);
    //this.sprite.setOrigin(0, 0);
    //this.sprite.setDepth(this.depth);
    // hidden by default
    //this.sprite.setVisible(false);
    //this.cell.addSprite(this.sprite, this.type);
    
    let color = this.color(this.cell.z);
    let shape = this.cell.scene.common.tiles[this.tileId].shape;

    if (!shape)
      return;

    this.polygon = this.cell.scene.add.polygon(this.x, this.y, shape, color, .3);
    this.polygon.setStrokeStyle(1, color, 1);
    this.polygon.setOrigin(0, 0);
    this.polygon.setScale(this.cell.scene.common.scale);
    this.polygon.setDepth(this.depth);
  }

  color (height) {
    let heightmap = [];
    let color = new Phaser.Display.Color();
    
    heightmap[0] =  { red: 0,   green: 4,   blue: 255, alpha: 1 };
    heightmap[1] =  { red: 0,   green: 37,  blue: 255, alpha: 1 };
    heightmap[2] =  { red: 0,   green: 68,  blue: 255, alpha: 1 };
    heightmap[3] =  { red: 0,   green: 99,  blue: 255, alpha: 1 };
    heightmap[4] =  { red: 0,   green: 131, blue: 255, alpha: 1 };
    heightmap[5] =  { red: 0,   green: 163, blue: 255, alpha: 1 };
    heightmap[6] =  { red: 0,   green: 195, blue: 255, alpha: 1 };
    heightmap[7] =  { red: 3,   green: 227, blue: 255, alpha: 1 };
    heightmap[8] =  { red: 0,   green: 255, blue: 251, alpha: 1 };
    heightmap[9] =  { red: 9,   green: 255, blue: 219, alpha: 1 };
    heightmap[10] = { red: 11,  green: 255, blue: 187, alpha: 1 };
    heightmap[11] = { red: 12,  green: 255, blue: 155, alpha: 1 };
    heightmap[12] = { red: 14,  green: 255, blue: 123, alpha: 1 };
    heightmap[13] = { red: 14,  green: 255, blue: 91,  alpha: 1 };
    heightmap[14] = { red: 16,  green: 255, blue: 58,  alpha: 1 };
    heightmap[15] = { red: 16,  green: 255, blue: 25,  alpha: 1 };
    heightmap[16] = { red: 19,  green: 255, blue: 0,   alpha: 1 };
    heightmap[17] = { red: 41,  green: 255, blue: 0,   alpha: 1 };
    heightmap[18] = { red: 70,  green: 255, blue: 0,   alpha: 1 };
    heightmap[19] = { red: 101, green: 255, blue: 0,   alpha: 1 };
    heightmap[20] = { red: 132, green: 255, blue: 0,   alpha: 1 };
    heightmap[21] = { red: 164, green: 255, blue: 0,   alpha: 1 };
    heightmap[22] = { red: 195, green: 255, blue: 0,   alpha: 1 };
    heightmap[23] = { red: 227, green: 255, blue: 0,   alpha: 1 };
    heightmap[24] = { red: 255, green: 251, blue: 0,   alpha: 1 };
    heightmap[25] = { red: 255, green: 219, blue: 0,   alpha: 1 };
    heightmap[26] = { red: 255, green: 187, blue: 0,   alpha: 1 };
    heightmap[27] = { red: 255, green: 155, blue: 0,   alpha: 1 };
    heightmap[28] = { red: 255, green: 123, blue: 0,   alpha: 1 };
    heightmap[29] = { red: 255, green: 91,  blue: 0,   alpha: 1 };
    heightmap[30] = { red: 255, green: 59,  blue: 0,   alpha: 1 };
    heightmap[31] = { red: 255, green: 26,  blue: 0,   alpha: 1 };

    color.setTo(heightmap[height].red, heightmap[height].green, heightmap[height].blue, heightmap[height].alpha);
    return color.color;
  }
}

export default heightmap;