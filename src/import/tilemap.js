import PNGImage from 'pngjs-image';
import tileData from '../tiles/data';
import fs from 'fs';

class tilemap {
  constructor (options) {
    this.name           = options.name;
    this.dat            = options.dat;
    this.maxTextureSize = 4096;
    this.tiles          = [];
    this.data           = {};

    this.loadTiles();
  }


  //
  // load tile data from DB
  // creates tile image objects for each frame based on image dat stack data
  //
  loadTiles () {
    let tiles = tileData;

    for (let i = 0; i < tiles.length; i++) {
      let images = [];

      // skip importing certain unused tiles
      // if (tiles[i].importOptions && tiles[i].importOptions.skip)
      //   continue;

      let frameCount = this.dat.images[tiles[i].image + '_0'].frameCount;

      // force some tiles to have a single frame
      // too fit within the constraints of a single tilemap
      // if (tiles[i].importOptions && tiles[i].importOptions.frameCount)
      //   frameCount = tiles[i].importOptions.frameCount;

      for (let f = 0; f < frameCount; f++)
        images[f] = this.dat.images[tiles[i].image + '_' + f].data;

      this.tiles.push({
        id:                tiles[i].id,
        type:              tiles[i].type,
        frames:            frameCount,
        imageName:         tiles[i].image,
        width:             this.dat.images[tiles[i].image + '_0'].width,
        height:            this.dat.images[tiles[i].image + '_0'].height,
        image:             images,
        shape:             tiles[i].shape,
        outline:           tiles[i].outline,
        heightmap:         tiles[i].heightmap,
        loaded:            false
      });
    }
  }


  //
  // creates a tilemap from the extracted image file resources
  //
  createTilemap () {
    let tilemapWidth  = this.maxTextureSize;
    let tilemapHeight = this.maxTextureSize;
    let tilemap       = PNGImage.createImage(tilemapWidth, tilemapHeight);
    let tilemapId     = 0;
    let x             = 1;
    let y             = 1;
    let maxWidth      = 16;
    let maxHeight     = 8;
    let rowMaxY       = 0;
    let padding       = 1;

    // looping 128 times here to sort tiles by size
    // this shuffles the smaller tiles to the front of the tilemap
    for (let loop = 0; loop < 128; loop++) {

      // loop for each tile
      for (let i = 0; i < this.tiles.length; i++) {
        let tile = this.tiles[i];

        // skip tiles that were already flagged as loaded
        if (tile.loaded)
          continue;

        // skip anything that exceeds the current maximum
        if (tile.width > maxWidth || tile.height > maxHeight)
          continue;

        // loop on every frame
        for (let f = 0; f < tile.frames; f++) {
          // max tile height in this row
          if (tile.height > rowMaxY)
            rowMaxY = tile.height;

          // create png instance for the tile frame
          let png = PNGImage.loadImageSync(tile.image[f]);

          // exceeds tilemap width, start a new row
          if (x + tile.width > tilemapWidth) {
            x = 1;
            y += rowMaxY + padding;
            rowMaxY = 0;
          }

          // blit image on to tilemap
          png.getImage().bitblt(tilemap.getImage(), 0, 0, tile.width, tile.height, x, y);

          // add tilemap data
          this.data[tile.imageName + '_' + f] = {
            frame: { x: x, y: y, w: tile.width, h: tile.height },
            rotated: false,
            trimmed: false,
            spriteSourceSize: { x: 0, y: 0, w: tile.width, h: tile.height },
            sourceSize: { w: tile.width, h: tile.height }
          };

          // move drawing position + padding
          x += tile.width + padding;
          
          // flag tile as loaded if the frame count matches the current frame
          // or if the tile has no frames
          if (tile.frames == f + 1 || tile.frames == 1)
            tile.loaded = true;
        }
      }

      // increase tile size next loop
      maxWidth = maxWidth + 4;
      maxHeight = maxHeight + 4;
    }

    // write out png and json data to disk
    tilemap.writeImageSync(__dirname + '/../../assets/tiles/tilemap_'+tilemapId+'.png');
    fs.writeFileSync(__dirname + '/../../assets/tiles/tilemap_'+tilemapId+'.json', JSON.stringify({ frames: this.data }, null, '  '));
  }
}

export default tilemap;