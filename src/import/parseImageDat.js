import PNG from 'pngjs-image';
import math from 'mathjs';
import tilemap from './tilemap';
import data from '../tiles/data';

class parseImageDat {
  constructor (options) {
    this.data = Buffer.from(options.data);
    this.tiles = data;
    this.palette = options.palette;
    this.stack = {};
    this.parse();
  }

  //
  // parses the image stack into a tilemap png/json
  //
  createTilemap () {
    this.tilemap = new tilemap({
      stack: this.stack
    });
  }


  //
  // parse dat file into separate png images
  //
  parse () {
    let view = new DataView(this.data.buffer);
    let imageCount = view.getUint16(0x00);
    let imageData = new DataView(this.data.buffer, 2, imageCount * 10); // image header length = 10
    let offset = 0;
    let images = [];

    // calculate image ids, offsets and dimensions
    for (let i = 0; i < imageCount; i++) {
      let img = {};

      img.id            = imageData.getUint16(offset);
      img.offsetBegin   = imageData.getUint32(offset + 2);
      img.height        = imageData.getUint16(offset + 6);
      img.width         = imageData.getUint16(offset + 8);

      // only store unique images (1204 and 1183 are duplicated)
      images[img.id] = img;

      offset += 10;
    }

    // calculate image offset ends, size
    // get each image from the raw data
    for (let id in images) {
      images[id].id = id;
      images[id].tile = this.tiles[images[id].id - 1001];
      images[id].offsetEnd = (images[id + 1] !== undefined ? images[id + 1].offsetBegin - 1 : this.data.byteLength);
      images[id].size = images[id].offsetEnd - images[id].offsetBegin;
      images[id].data = this.data.subarray(images[id].offsetBegin, images[id].offsetEnd);
      images[id].block = this.block(images[id].data);
      images[id].animated = this.isAnimatedImage(images[id].block);

      this.addToStack(images[id]);
    }
  }


  //
  // get the lowest common multiplier for all palette animation sequences
  //
  getFrameCount (image) {
    let frames = [];

    for (let y = 0; y < image.block.length; y++)
      for (let x = 0; x < image.block[y].pixels.length; x++)
        frames.push(this.palette.getFrameCountFromIndex(image.block[y].pixels[x]));

    if (frames.length == 0)
      return 1;
    else
      return math.lcm.apply(null, frames);
  }


  //
  // creates an image from the processed image bytes
  // and adds it to the image stack array
  //
  addToStack (image) {
    let frameCount = this.getFrameCount(image);

    if (image.tile.importOptions && image.tile.importOptions.dropColor) {
      image.tile.importOptions.dropColor.forEach((data, i) => {
        image.tile.importOptions.dropColor[i] = this.palette.getColorString(data, 0);
      });
    }

    // loop on each frame
    for (let frame = 0; frame < frameCount; frame++) {
      let png = PNG.createImage(image.width, image.height);

      // get palette index for imageblock x/y coordinate and draw to canvas
      for (let y = 0; y < image.block.length; y++) {
        for (let x = 0; x < image.block[y].pixels.length; x++) {
          let index = image.block[y].pixels[x];

          // drop out specific colors
          if (index !== null &&
              image.tile.importOptions &&
              image.tile.importOptions.dropColor &&
              image.tile.importOptions.dropColor.includes(this.palette.getColorString(index, frame))
          ) {
            index = null;
          }

          png.setAt(x, y, this.palette.getColor(index, frame));
        }
      }

      // save to the image stack
      this.stack[image.id + '_' + frame] = {
        id: image.id,
        frame: frame,
        frameCount: frameCount,
        tile: image.tile,
        data: png.toBlobSync(),
        width: image.width,
        height: image.height
      };

      // write out all frames
      //if (image.tile.id == )
      //  png.writeImageSync(__dirname+'/../../tiles/'+image.id+'_'+frame+'.png');

      // write out first frame only
      if (frame == 0)
        png.writeImageSync(__dirname+'/../../tiles/'+image.id+'.png');
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
  block (bytes) {
    let offset = 0;
    let img = [];

    while (true) {
      let row = {};

      row.length = parseInt(bytes.subarray(offset + 0, offset + 1));
      row.more = bytes.subarray(offset + 1, offset + 2);

      offset += 2;
      row.data = bytes.subarray(offset, offset + row.length);
      row.pixels = this.row(row.data);

      img.push(row);

      if (row.more != 1)
        break;

      offset += row.length;
    }

    return img;
  }


  //
  // process image rows / chunks
  //
  row (data) {
    let padding = 0;
    let length = 0;
    let extra = 0;
    let pixels = null;
    let mode = data[1];
    let image = [];
    let bytesParsed = 0;
    let headerLength = 0;

    // loop through the row chunks
    while (true) {
      data = data.subarray(bytesParsed);

      // special case for multi-chunk rows, drop first byte if zero
      if (data[0] == 0x00 && bytesParsed > 0)
        data = data.subarray(1);

      if (data.length <= 0)
        break;

      bytesParsed = 0;
      mode = data[1]; // read mode

      if (mode == 0 || mode == 3) {
        padding = data[0]; // padding pixels from the left edge
        length = data[2]; // pixels in the row to draw
        extra = data[3]; // extra bit / flag

        if (length == 0 && extra == 0) {
          length = data[4];
          extra = data[5];
          pixels = data.subarray(6, 6 + length);
          headerLength = 6;
        } else {
          pixels = data.subarray(4, 4 + length);
          headerLength = 4;
        }

      } else if (mode == 4) {
        length = data[0];
        pixels = data.subarray(2, 2 + length);
        headerLength = 2;
      }

      // byte offset for the next loop
      bytesParsed += headerLength + length;

      // save padding pixels (transparent) as null
      for (let i = 0; i < parseInt(padding); i++)
        image.push(null);

      // save pixel data afterwards
      for (let i = 0; i < pixels.length; i++)
        image.push(pixels[i]);
    }

    return image;
  }
}

export default parseImageDat;