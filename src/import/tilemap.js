import PNGImage from 'pngjs-image';
import pureImage from 'pureimage';
import tileData from '../tiles/data';
import heightmapTileData from './heightmapTileData';
import fs from 'fs';

class tilemap {
  constructor (options) {
    this.stack = options.stack;
    this.tiles = [];
    this.data = {};
    this.loadTiles();
  }


  //
  // load tile data from DB
  // creates tile image objects for each frame based on image stack data
  //
  loadTiles () {
    let tiles = tileData;

    for (let i = 0; i < tiles.length; i++) {
      if (tiles[i].importOptions && tiles[i].importOptions.skip)
        continue;

      let frames = [];

      let frameCount = this.stack[tiles[i].image + '_0'].frameCount;

      // adjust framecount for tile 251
      // to force the whole tileset to fit within 2048x2048
      if ([178,180,213,218,250].includes(tiles[i].id))
        frameCount = 1;

      if ([251,252,253,254].includes(tiles[i].id))
        frameCount = 1;

      for (let f = 0; f < frameCount; f++)
        frames[f] = this.stack[tiles[i].image + '_' + f].data;

      this.tiles.push({
        id:                tiles[i].id,
        type:              tiles[i].type,
        frames:            frameCount,
        imageName:         tiles[i].image,
        width:             this.stack[tiles[i].image + '_0'].width,
        height:            this.stack[tiles[i].image + '_0'].height,
        image:             frames || 1,
        shape:             tiles[i].shape,
        outline:           tiles[i].outline,
        heightmap:         tiles[i].heightmap,
        loaded:            false,
        heightmapLoaded:   false
      });
    }

    this.createTilemap();
  }

  //
  // creates a tilemap from the extracted image file resources
  //
  createTilemap () {
    let tilemapWidth = 2048;
    let tilemapHeight = 2048;
    let tilemap = PNGImage.createImage(tilemapWidth, tilemapHeight);
    let tilemapId = 0;

    let x = 1;
    let y = 1;
    let w = 0;
    let h = 0;

    let maxWidth = 16;
    let maxHeight = 8;
    let rowMaxY = 0;
    let padding = 1;

    // draw line based tiles used for heightmaps
    // looping 32 times to draw each layer of the heightmap
    for (let layer = 0; layer < heightmapTileData.length; layer++) {
        
      // loop for each tile (256 through 269 only for now)
      for (let i = 0; i < this.tiles.length; i++) {
        let tile = this.tiles[i];

        if (!tile.heightmap)
          continue;

        // get image dimensions
        w = tile.width;
        h = tile.height;

        // max tile height in this row
        if (h > rowMaxY)
          rowMaxY = h;

        // exceeds tilemap width, start a new row
        if (x + w > tilemapWidth) {
          y += rowMaxY + padding;
          rowMaxY = 0;
          x = 1;
        }

        // draw vector tile to png bitmap
        let png = this.drawTile(tile, layer);

        // blit image on to tilemap
        png.getImage().bitblt(tilemap.getImage(), 0, 0, w, h, x, y);

        // add tilemap data
        this.addTilemapData(tile.imageName + '_V_' + layer, x, y, w, h);

        // move drawing position + padding
        x += w + padding;
      }
    }

    // looping 128 times here to sort tiles by size
    // this shuffles the smaller tiles to the front of the tilemap
    for (let loop = 0; loop < 128; loop++) {

      // loop for each tile
      for (let i = 0; i < this.tiles.length; i++) {
        let tile = this.tiles[i];

        // check tile type
        //if (!['traffic', 'building', 'power', 'road', 'rail', 'highway', 'terrain', 'water', 'zone', 'overlay', 'underground', 'subway', 'pipe'].includes(tile.type))
        //  continue;

        //'actor', 'sign', 'monster', 'explosion', 'fire', 'traffic'

        // skip tiles that were already flagged as loaded
        if (tile.loaded)
          continue;

        // get image dimensions
        w = tile.width;
        h = tile.height;

        // skip anything that exceeds the current maximum
        if (w > maxWidth || h > maxHeight)
          continue;

        // loop on every frame
        for (let f = 0; f < tile.frames; f++) {
          // max tile height in this row
          if (h > rowMaxY)
            rowMaxY = h;

          // create png instance for the tile frame
          let png = PNGImage.loadImageSync(tile.image[f]);

          // exceeds tilemap width, start a new row
          if (x + w > tilemapWidth) {
            x = 1;
            y += rowMaxY + padding;
            rowMaxY = 0;
          }

          // exceeds tilemap height
          if (y + h > tilemapHeight) {
            // write png to disk
            tilemap.writeImageSync(__dirname + '/../../assets/tiles/tilemap_'+tilemapId+'.png');

            // write data to disk
            fs.writeFileSync(__dirname + '/../../assets/tiles/tilemap_'+tilemapId+'.json', JSON.stringify({ frames: this.data }, null, '  '));
            this.data = {};

            // start a new tilemap
            y = 0;
            x = 1;
            rowMaxY = 0;
            tilemapId += 1;
            tilemap = PNGImage.createImage(tilemapWidth, tilemapHeight);
          }
          
          // blit image on to tilemap
          png.getImage().bitblt(tilemap.getImage(), 0, 0, w, h, x, y);

          // if (f === 0)
          //   png.writeImageSync(__dirname + '/../../test/'+tile.imageName+'_'+f+'.png');

          // add tilemap data
          this.addTilemapData(tile.imageName + '_' + f, x, y, w, h);

          // move drawing position + padding
          x += w + padding;
          
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

    tilemap.writeImageSync(__dirname + '/../../assets/tiles/tilemap_'+tilemapId+'.png');
    fs.writeFileSync(__dirname + '/../../assets/tiles/tilemap_'+tilemapId+'.json', JSON.stringify({ frames: this.data }, null, '  '));
  }


  //
  // add tilemap json data
  //
  addTilemapData (tileId, x, y, width, height) {
    this.data[tileId] = {
      frame: { x: x, y: y, w: width, h: height },
      rotated: false,
      trimmed: false,
      spriteSourceSize: { x: 0, y: 0, w: width, h: height },
      sourceSize: { w: width, h: height }
    };
  }


  //
  // draws a "vector" tile shape to a canvas context
  //
  drawTile (tile, layer) {
    let x = 0;
    let y = 0;
    let scale = 1;
    let polygon = tile.shape;
    let heightmap = heightmapTileData[layer];

    let image = pureImage.make(tile.width * scale, tile.height * scale);
    let context = image.getContext('2d');

    context.clearRect(0, 0, tile.width * scale, tile.height * scale);
    context.globalAlpha = 0.8;

    // draw original tile first to assist with placement of lines
    //let background = pureImage.make(tile.width, tile.height);
    //background.data = PNGImage.loadImageSync(tile.image[0]).getBlob();
    //context.drawImage(background, 0, 0, tile.width, tile.height, 0, 0, tile.width * scale, tile.height * scale);

    for (let i = 0; i < polygon.length; i++) {
      if (!polygon[i].line)
        continue;

      context.strokeStyle = heightmap.lines;
      context.lineWidth = .6 * scale;
      context.beginPath();
      context.moveTo(Math.floor(polygon[i].x1 * scale), Math.floor(polygon[i].y1 * scale));
      context.lineTo(Math.floor(polygon[i].x2 * scale), Math.floor(polygon[i].y2 * scale));
      context.stroke();
      context.closePath();
    }

    context.fillStyle =  heightmap.fill;
    context.strokeStyle = heightmap.stroke;
    context.lineWidth = 1 * scale;
    context.beginPath();
    context.moveTo(polygon[0].x * scale, polygon[0].y * scale);

    for (let i = 1; i < polygon.length; i++) {
      if (polygon[i].line)
        continue;

      x = polygon[i].x * scale;
      y = polygon[i].y * scale;
      context.lineTo(x, y);
    }

    context.stroke();
    context.fill();
    context.closePath();

    let png = PNGImage.createImage(tile.width * scale, tile.height * scale);

    for (let i = 0; i < (tile.width * scale); i++) {
      for (let j = 0; j < (tile.height * scale); j++) {
        let rgba = image.getPixelRGBA(i, j);
        let color = {
          red: (rgba >>> (8 * (3 - 0))) & 0xff,
          green: (rgba >>> (8 * (3 - 1))) & 0xff,
          blue: (rgba >>> (8 * (3 - 2))) & 0xff,
          alpha: (rgba >>> (8 * (3 - 3))) & 0xff,
        };
        
        png.setAt(i, j, color);
      }
    }

    // workaround for pureimage issue
    png.setAt(0, 0, { red: 0, green: 0, blue: 0, alpha: 0 });
    //png.writeImageSync(__dirname + '/../../test/'+tile.imageName+'_V'+layer+'.png');

    return png;
  }
}

export default tilemap;