import * as tile from '../tiles/';

class tiles {
  constructor (options) {
    this.cell = options.cell;

    // loop through available tile types and initialize
    Object.keys(tile).forEach(data => {
      this[data] = null;

      if (this.cell.data.tiles[data])
        this.set(data, this.cell.data.tiles[data]);
    });
  }

  list () {
    let list = [];

    Object.keys(tile).forEach(type => {
      if (this[type])
        list.push(this[type]);
    });

    return list;
  }

  get sprites () {
    let sprites = [];

    Object.keys(tile).forEach(type => {
      if (this[type] && this[type].sprite)
        sprites.push(this[type].sprite);
    });

    return sprites;
  }

  getId (type) {
    return this.get(type, true);
  }
  
  get (type, id = false) {
    if (!this[type])
      if (!id)
        return;
      else
        return 0;

    if (this[type])
      if (id)
        return this[type].tileId;
      else
        return this[type];
  }

  has (type) {
    if (this[type] && this[type].draw)
      return true;

    return false;
  }

  set (type, tileId) {
    this[type] = new tile[type]({
      cell: this.cell,
      tileId: tileId
    });
  }

  create () {
    Object.keys(tile).forEach(data => {
      if (this[data])
        this[data].create();
    });
  }
}

export default tiles;