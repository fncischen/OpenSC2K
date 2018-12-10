import cell from '../cell/cell';
import Phaser from 'phaser';

class map {
  constructor (options) {
    this.scene        = options.scene;
    this.width        = options.width;
    this.height       = options.height;
    this.cells        = [];
    this.cellsList    = [];
    this.selectedCell = { x: 0, y: 0 };
    this.sprites      = { all: [] };
  }

  load () {
    for (let i = 0; i < this.scene.common.data.cells.length; i++) {
      let mapCell = new cell({
        scene: this.scene,
        data: this.scene.common.data.cells[i],
      });

      if (!this.cells[mapCell.x]) this.cells[mapCell.x] = [];
      if (!this.cells[mapCell.x][mapCell.y]) this.cells[mapCell.x][mapCell.y] = [];
      
      this.cells[mapCell.x][mapCell.y] = mapCell;
      this.cellsList.push(mapCell);
    }

    this.calculateCellDepthSorting();
  }

  create () {
    for (let x = 0; x < this.width; x++) {
      for (let y = 0; y < this.height; y++) {
        this.cells[x][y].create();
      }
    }
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
    if (!this.cells[x]) throw 'Invalid cell reference x: '+x+', y: '+y;
    if (!this.cells[x][y]) throw 'Invalid cell reference x: '+x+', y: '+y;

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
    let worldBounds = this.scene.common.viewport.worldBounds.rect;

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
        let mapCell = this.getCell(x, y);
        mapCell.setDepth((x + y) * depth);
        mapCell.updatePosition();
      }
    }
  }

}

export default map;