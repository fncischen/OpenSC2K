export default class layer {
  constructor (options) {
    this.scene   = options.scene;
    this.type    = options.type;
    this.map     = options.scene.city.map;
    this.events  = options.scene.events;
    this.visible = options.visible || true;
    this.list    = [];

    this.map.cellsList.forEach((cell) => {
      if (!cell || !cell.tiles)
        return;

      if (cell.tiles[this.type])
        this.list.push(cell.tiles[this.type]);
    });

    this.events.on('mapLayerHide', this.onHide, this);
    this.events.on('mapLayerShow', this.onShow, this);
  }

  hide () {
    this.visible = false;

    this.list.forEach((tile) => {
      tile.hide();
    });

    this.events.emit('mapLayerHide', this.type);
  }

  show () {
    this.visible = true;

    this.list.forEach((tile) => {
      tile.show();
    });

    this.events.emit('mapLayerShow', this.type);
  }

  refresh () {
    this.hide();
    this.show();
  }

  onHide (type) {
    return;
  }

  onShow (type) {
    return;
  }
}