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

  toggle () {
    if (this.visible)
      this.hide();
    else
      this.show();
  }

  hide (emitEvents = true) {
    this.visible = false;

    this.list.forEach((tile) => {
      tile.hide();
    });

    if (emitEvents) this.events.emit('mapLayerHide', this.type);
  }

  show (emitEvents = true) {
    this.visible = true;

    this.list.forEach((tile) => {
      tile.show();
    });

    if (emitEvents) this.events.emit('mapLayerShow', this.type);
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