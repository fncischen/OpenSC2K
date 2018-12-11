import PNG from 'pngjs-image';
import math from 'mathjs';
import data from '../tiles/data';

class dat {
  constructor (options) {
    this.data    = options.data;
    this.palette = options.palette;
    this.tiles   = data;
    this.frames  = [];
    this.images  = {};
    this.parse();
  }


  //
  // parse dat file into separate png images
  //
  parse () {
    let view = new DataView(this.data.buffer);
    let imageCount = view.getUint16(0x00);
    let imageData = new DataView(this.data.buffer, 2, imageCount * 10);

    // calculate image ids, offsets and dimensions
    // each image header is stored as a 10 byte chunk
    // only store unique images (1204 and 1183 are duplicated)
    for (let offset = 0; offset < imageCount * 10; offset += 10) {
      let id = imageData.getUint16(offset);

      this.frames[id] = {
        id:         imageData.getUint16(offset),
        startBytes: imageData.getUint32(offset + 2),
        height:     imageData.getUint16(offset + 6),
        width:      imageData.getUint16(offset + 8)
      };

      // get the next ID in sequence
      if (offset + 10 <= imageData.byteLength - 2)
        this.frames[id].next = imageData.getUint16(offset + 10);
    }


    // calculate image ending offset
    // separate loop so we can easily get the end byte of the following frame
    this.frames.forEach((frame, id) => {
      let endBytes = 0;

      // use the offset start of the next frame to determine the end of this frame
      if (this.frames[frame.next] !== undefined)
        endBytes = this.frames[frame.next].startBytes;
      else
        endBytes = this.data.byteLength;

      this.frames[id].endBytes = endBytes;
      this.frames[id].size     = endBytes - frame.startBytes;
    });

    // convert to png - this is done as a separate loop to ensure we've parsed
    // all tile images first; as some tiles are used as a base (tile 1256 for example) for earlier tiles
    this.frames.forEach((frame) => {
      this.decode(frame);
    });

    // clean up
    delete this.frames;
    delete this.data;
    delete this.tiles;
  }


  //
  // get the lowest common multiplier for all palette animation sequences
  //
  getFrameCount (image) {
    let frames = [];

    for (let y = 0; y < image.block.length; y++)
      for (let x = 0; x < image.block[y].pixels.length; x++)
        frames.push(this.palette.getFrameCountFromIndex(image.block[y].pixels[x]));

    if (frames.length <= 1)
      return 1;
    else
      return math.lcm.apply(null, frames);
  }


  //
  // decodes raw image bytes and converts to png format
  //
  decode (image) {
    // get tile metadata,
    // subtracting 1001 to map to the value in the JSON
    // and account for 0 indexing (ex: tile 1256 == tile index 255 which is tile ID 256)
    image.tile = this.tiles[image.id - 1001];

    // parse image block
    image.block = this.block(image.startBytes, image.endBytes);

    // get image frame count (animated)
    let frameCount = this.getFrameCount(image);

    // drop any colors?
    // used to foribly remove certain palette indexes
    // from tiles (example: traffic tiles)
    if (image.tile.importOptions && image.tile.importOptions.dropColor)
      image.tile.importOptions.dropColor.forEach((data, i) => {
        image.tile.importOptions.dropColor[i] = this.palette.getColorString(data, 0);
      });


    // loop on each frame
    for (let frame = 0; frame < frameCount; frame++) {
      let png = PNG.createImage(image.width, image.height);

      // get palette index for imageblock x/y coordinate and draw to canvas
      for (let y = 0; y < image.block.length; y++) {
        for (let x = 0; x < image.block[y].pixels.length; x++) {
          let index = image.block[y].pixels[x];

          // drop out specific colors
          if (image.tile.importOptions && image.tile.importOptions.dropColor && image.tile.importOptions.dropColor.includes(this.palette.getColorString(index, frame)))
            index = null;

          // set pixel within png
          png.setAt(x, y, this.palette.getColor(index, frame));
        }
      }

      // store image data
      this.images[image.id + '_' + frame] = {
        id:          image.id,
        animated:    this.isAnimatedImage(image.block),
        block:       image.block,
        frame:       frame,
        frameCount:  frameCount || 1,
        data:        png.toBlobSync(),
        startBytes:  image.startBytes,
        endBytes:    image.endBytes,
        size:        image.size,
        tile:        image.tile,
        height:      image.height,
        width:       image.width
      };

      // write frame to disk
      //png.writeImageSync(__dirname+'/../../assets/tiles/'+image.id+'_'+frame+'.png');

      // write first frame to disk
      //if (frame == 0)
      //  png.writeImageSync(__dirname+'/../../assets/tiles/'+image.id+'.png');
    }
  }


  //
  // check if image contains any palette indexes that cycle with each frame (animated)
  //
  isAnimatedImage (image) {
    for (var y = 0; y < image.length; y++)
      for (var x = 0; x < image[y].pixels.length; x++)
        if (this.palette.animatedIndexes.includes(image[y].pixels[x]))
          return true;

    return false;
  }


  //
  // processes image bytes into individual image data rows / chunks
  //
  block (startBytes, endBytes) {
    let bytes = this.data.subarray(startBytes, endBytes);
    let offset = 0;
    let img = [];

    while (true) {
      let row = {};

      row.length = bytes[offset];
      row.more   = bytes[offset + 1];

      offset += 2;
      row.pixels = this.imageRow(bytes, offset, offset + row.length);

      img.push(row);

      if (row.more == 2)
        break;

      offset += row.length;
    }

    return img;
  }


  //
  // process image rows / chunks
  //
  imageRow (data, startBytes, endBytes) {
    let bytes   = data.subarray(startBytes, endBytes);
    let padding = 0;
    let length  = 0;
    let extra   = 0;
    let pixels  = null;
    let mode    = null;
    let image   = [];
    let offset  = 0;
    let header  = 0;

    // loop through the row chunks
    while (true) {
      bytes = bytes.subarray(offset);

      // special case for multi-chunk rows
      // drop first byte if zero
      if (bytes[0] == 0x00 && offset > 0)
        bytes = bytes.subarray(1);

      if (bytes.length <= 0)
        break;

      // reset offset and set mode flag
      offset = 0;
      mode   = bytes[1];

      if (mode == 0 || mode == 3) {
        padding = bytes[0]; // padding pixels from the left edge
        length  = bytes[2]; // pixels in the row to draw
        extra   = bytes[3]; // extra bit / flag

        if (length == 0 && extra == 0) {
          length = bytes[4];
          extra  = bytes[5];
          pixels = bytes.subarray(6, 6 + length);
          header = 6;
        } else {
          pixels = bytes.subarray(4, 4 + length);
          header = 4;
        }

      } else if (mode == 4) {
        length = bytes[0];
        pixels = bytes.subarray(2, 2 + length);
        header = 2;
      }

      // byte offset for the next loop
      offset += header + length;

      // save padding pixels (transparent) as null
      for (let i = 0; i < padding; i++)
        image.push(null);

      // save pixel data afterwards
      for (let i = 0; i < pixels.length; i++)
        image.push(pixels[i]);

    }

    return image;
  }
}

export default dat;