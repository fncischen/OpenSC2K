import Phaser from 'phaser';

class events {
  constructor (options) {
    this.cell = options.cell;
    this.zone = null;
    this.debug = false;
  }

  create () {
    let tiles = this.cell.tiles;
    let tile = tiles.highway || tiles.rail || tiles.road || tiles.water || tiles.terrain;

    if (!tile || !tile.tile)
      return;

    let { x, y } = this.calculatePosition(tile);

    if (this.debug) {
      this.zone = this.cell.scene.add.graphics({ x: x, y: y });
      tile.drawOutline(this.zone, 'hitbox');
    } else {
      this.zone = this.cell.scene.add.zone(x, y, this.cell.scene.common.tileWidth, this.cell.scene.common.tileHeight);
    }

    this.zone.setDepth(this.cell.depth + 1);
    this.zone.cell = this.cell;
    this.zone.setInteractive(tile.tile.hitbox, Phaser.Geom.Polygon.Contains);

    this.zone.on('pointerover', this.onPointerOver);
    this.zone.on('pointerout', this.onPointerOut);
    this.zone.on('pointermove', this.onPointerMove);
    this.zone.on('pointerdown', this.onPointerDown);
    this.zone.on('pointerup', this.onPointerUp);
  }

  calculatePosition (tile) {
    let offset = 0;

    if ((this.cell.properties.waterLevel == 'submerged' || this.cell.properties.waterLevel == 'shore') && this.cell.z < this.cell.scene.city.waterLevel)
      offset = ((this.cell.scene.city.waterLevel - this.cell.z) * this.cell.scene.common.layerOffset);

    if (tile.tileId != 256 && tile.type == 'terrain')
      offset += this.cell.scene.common.layerOffset;

    let x = this.cell.position.right.x - (this.cell.scene.common.tileWidth / 2) << 0;
    let y = this.cell.position.bottom.y - (this.cell.scene.common.tileHeight) - offset << 0;

    return { x: x, y: y };
  }

  onPointerUp (pointer) {
    // console.log(this.cell);
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

    this.cell.sprites.forEach((sprite) => {
      if (sprite.visible)
        sprite.setTint(0xaa0000);
    });
  }

  onPointerOut (pointer) {
    this.cell.sprites.forEach((sprite) => {
      if (sprite.visible)
        sprite.clearTint();
    });
  }
}

export default events;