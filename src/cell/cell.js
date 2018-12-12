import tiles from './tiles';
import events from './events';
//import microSims from './microSims';
//import trains from '../simulator/actors/trains';

class cell {
  constructor (options) {
    this.scene  = options.scene;
    this.data   = options.data;

    this.tileWidth   = this.scene.common.tileWidth;
    this.tileHeight  = this.scene.common.tileHeight;
    this.layerOffset = this.scene.common.layerOffset;
    
    this.x = this.data.x || 0;
    this.y = this.data.y || 0;
    this.z = this.data.z || 0;

    this.edge = false;
    this.calculatePosition();

    this.depth       = (this.data.x + this.data.y) * 64;
    this.initialized = false;
    this.hitbox      = null;
    this.sleeping    = false;

    this.properties = {
      conductive:          this.data.conductive          || false,
      powered:             this.data.powered             || false,
      piped:               this.data.piped               || false,
      watered:             this.data.watered             || false,
      rotate:              this.data.rotate              || false,
      landValueMask:       this.data.landValueMask       || false,
      saltWater:           this.data.saltWater           || false,
      waterCovered:        this.data.waterCovered        || false,
      missileSilo:         this.data.missileSilo         || false,
      cornersTopLeft:      this.data.cornersTopLeft      || false,
      cornersTopRight:     this.data.cornersTopRight     || false,
      cornersBottomLeft:   this.data.cornersBottomLeft   || false,
      cornersBottomRight:  this.data.cornersBottomRight  || false,
      waterLevel:          this.data.waterLevel          || 'dry',
      altWaterCovered:     this.data.altWaterCovered     || false,
      terrainWaterLevel:   this.data.terrainWaterLevel   || null,
    };

    this.tiles = new tiles({ cell: this });
    this.events = new events({ cell: this });
    //this.microSims = new microSims({ cell: this });
    
    return this;
  }

  create () {
    //this.microSims.create();
    this.tiles.create();
    this.events.create();
    this.initialized = true;

    //if (this.x == 71 && this.y == 26) {
    //  this.actor = new trains({ scene: this.scene });
    //  this.actor.spawn(this);
    //}

  }

  get sprites () {
    return this.tiles.sprites;
  }

  get surrounding () {
    let cells = {};
    let cellX = 0;
    let cellY = 0;

    for (let x = -1; x < 2; x++) {
      for (let y = -1; y < 2; y++) {
        cellX = this.x + x;
        cellY = this.y + y;

        if (x == -1 && y == -1 && this.scene.city.map.cells[cellX] && this.scene.city.map.cells[cellX][cellY]) cells.nw = this.scene.city.map.cells[cellX][cellY];
        if (x == -1 && y ==  0 && this.scene.city.map.cells[cellX] && this.scene.city.map.cells[cellX][cellY]) cells.w  = this.scene.city.map.cells[cellX][cellY];
        if (x == -1 && y ==  1 && this.scene.city.map.cells[cellX] && this.scene.city.map.cells[cellX][cellY]) cells.sw = this.scene.city.map.cells[cellX][cellY];

        if (x ==  0 && y == -1 && this.scene.city.map.cells[cellX] && this.scene.city.map.cells[cellX][cellY]) cells.n  = this.scene.city.map.cells[cellX][cellY];
        if (x ==  0 && y ==  0 && this.scene.city.map.cells[cellX] && this.scene.city.map.cells[cellX][cellY]) cells.c  = this.scene.city.map.cells[cellX][cellY];
        if (x ==  0 && y ==  1 && this.scene.city.map.cells[cellX] && this.scene.city.map.cells[cellX][cellY]) cells.s  = this.scene.city.map.cells[cellX][cellY];

        if (x ==  1 && y == -1 && this.scene.city.map.cells[cellX] && this.scene.city.map.cells[cellX][cellY]) cells.ne = this.scene.city.map.cells[cellX][cellY];
        if (x ==  1 && y ==  0 && this.scene.city.map.cells[cellX] && this.scene.city.map.cells[cellX][cellY]) cells.e  = this.scene.city.map.cells[cellX][cellY];
        if (x ==  1 && y ==  1 && this.scene.city.map.cells[cellX] && this.scene.city.map.cells[cellX][cellY]) cells.se = this.scene.city.map.cells[cellX][cellY];
      }
    }

    return cells;
  }

  updatePosition () {
    this.calculatePosition();
    //this.tiles.updatePosition();

    if (this.hitbox) {
      this.hitbox.destroy();
      this.setInteractive();
    }
  }

  calculatePosition () {
    let offsetX = (this.x - this.y) * (this.tileWidth / 2);
    let offsetY = (this.y + this.x) * (this.tileHeight / 2);
    let offsetZ = (this.z > 1 ? (this.layerOffset * this.z) + this.layerOffset : 0);

    // edge tile?
    if (this.x == 0 || this.x == 127 || this.y == 0 || this.y == 127)
      this.edge = true;

    this.position = {
      offsets: {
        x: offsetX,
        y: offsetY,
        z: offsetZ,
      },
      top: {
        x: offsetX + (this.tileWidth / 2),
        y: offsetY - offsetZ
      },
      right: {
        x: offsetX + this.tileWidth,
        y: (offsetY - offsetZ) + this.tileHeight - (this.tileHeight / 2)
      },
      bottom: {
        x: offsetX + (this.tileWidth / 2),
        y: (offsetY - offsetZ) + this.tileHeight
      },
      left: {
        x: offsetX,
        y: (offsetY - offsetZ) + this.tileHeight - (this.tileHeight / 2)
      },
      center: {
        x: offsetX + (this.tileWidth / 2),
        y: (offsetY - offsetZ) - (this.tileHeight / 2)
      }
    };
  }

  setDepth (depth) {
    this.depth = depth;

    // todo: code to look at each sprite and set depth
  }

  sleep () {
    this.sleeping = true;
    this.sprites.forEach((sprite) => {
      sprite.setVisible(false);
      sprite.setActive(false);
    });

    this.hitbox.setActive(false);
  }

  wake () {
    this.sleeping = false;
    this.sprites.forEach((sprite) => {
      sprite.setVisible(true);
      sprite.setActive(true);
    });

    this.hitbox.setActive(true);
  }

  shutdown () {
    if (this.hitbox)
      this.hitbox.destroy();

    if (this.sprites.length > 0)
      this.sprites.forEach((sprite) => {
        sprite.destroy();
      });
  }

  addSprite (sprite, type) {
    this.sprites.push(sprite);
    this.scene.city.map.addSprite(sprite, type);
  }

}

export default cell;