import Phaser from 'phaser';
import cell from '../cell/cell';
import * as layers from './layers/';

export default class map {
  constructor (options) {
    this.scene        = options.scene;
    this.width        = options.width;
    this.height       = options.height;
    this.cells        = [];
    this.cellsList    = [];
    this.selectedCell = { x: 0, y: 0 };
    this.sprites      = { all: [] };
    this.layers       = {};
  }

  load () {
    for (let i = 0; i < this.scene.globals.data.cells.length; i++) {
      let c = new cell({
        scene: this.scene,
        data: this.scene.globals.data.cells[i],
      });

      if (!this.cells[c.x])      this.cells[c.x]      = [];
      if (!this.cells[c.x][c.y]) this.cells[c.x][c.y] = [];
      
      this.cells[c.x][c.y] = c;
      this.cellsList.push(c);
    }

    //this.calculateCellDepthSorting();
  }

  create () {
    // create map cells
    for (let x = 0; x < this.width; x++) {
      for (let y = 0; y < this.height; y++) {
        this.cells[x][y].create();
      }
    }

    // create layers
    this.layers.terrain   = new layers.terrain({ scene: this.scene });
    this.layers.water     = new layers.water({ scene: this.scene });
    this.layers.edge      = new layers.edge({ scene: this.scene });
    this.layers.heightmap = new layers.heightmap({ scene: this.scene });
    this.layers.zone      = new layers.zone({ scene: this.scene });
    this.layers.building  = new layers.building({ scene: this.scene });
    this.layers.road      = new layers.road({ scene: this.scene });
    this.layers.rail      = new layers.rail({ scene: this.scene });
    this.layers.power     = new layers.power({ scene: this.scene });
    this.layers.highway   = new layers.highway({ scene: this.scene });
    this.layers.subway    = new layers.subway({ scene: this.scene });
    this.layers.pipe      = new layers.pipe({ scene: this.scene });
  }

  rotateCW () {
    let cells = this.cells;
    let tempCells = [];

    for (let x = 0; x < this.width; x++) {
      for (let y = 0; y < this.height; y++) {
        if (!tempCells[x])    tempCells[x]    = [];
        if (!tempCells[x][y]) tempCells[x][y] = [];

        let newX = y;
        let newY = this.width - x - 1;

        tempCells[newX][newY] = cells[x][y];
      }
    }

    this.cells = tempCells;
  }

  rotateCCW () {
    let cells = this.cells;
    let tempCells = [];

    for (let x = 0; x < this.width; x++) {
      for (let y = 0; y < this.height; y++) {
        if (!tempCells[x])    tempCells[x]    = [];
        if (!tempCells[x][y]) tempCells[x][y] = [];

        let newX = this.width - y - 1;
        let newY = x;

        tempCells[newX][newY] = cells[x][y];
      }
    }

    this.cells = tempCells;
  }

  update () {
    //this.checkCellVisibility();
  }

  shutdown () {
    if (this.cellsList.length > 0)
      this.cellsList.forEach((cell) => {
        cell.shutdown();
      });

    if (this.sprites.all.length > 0)
      this.sprites.all.forEach((sprite) => {
        sprite.destroy();
      });
  }

  addSprite (sprite, type) {
    if (!this.sprites[type])
      this.sprites[type] = [];

    this.sprites[type].push(sprite);
    this.sprites.all.push(sprite);
  }

  getCell (x, y) {
    return this.cells[x][y];
  }

  toggleLayerVisibility (type) {
    if (this.sprites[type].length == 0)
      return;

    this.sprites[type].forEach((sprite) => {
      let visible = this.sprites[type][0].visible ? false : true;
      sprite.setVisible(visible);
    });
  }

  checkCellVisibility () {
    let worldBounds = this.scene.globals.viewport.worldBounds.rect;

    for (let x = 0; x < this.width; x++) {
      for (let y = 0; y < this.height; y++) {
        let contains = Phaser.Geom.Rectangle.Contains(worldBounds, this.cells[x][y].position.center.x, this.cells[x][y].position.center.y);

        if (contains)
          this.cells[x][y].wake();
        else
          this.cells[x][y].sleep();
      }
    }
  }

  calculateCellDepthSorting () {
    let depth = 64;

    for (let x = 0; x < this.width; x++) {
      for (let y = 0; y < this.height; y++) {
        let cell = this.getCell(x, y);
        cell.depth((x + y) * depth);
        cell.updatePosition();
      }
    }
  }
}