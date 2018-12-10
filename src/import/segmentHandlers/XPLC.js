import { resize } from './common';

export default (data, struct) => {
  let view = new Uint8Array(data);
  let xplc = [];

  view.forEach((bits, i) => {
    xplc[i] = bits;
  });

  // resize data array from 64x64 to 128x128
  xplc = resize(xplc, 32, 128);

  xplc.forEach((data, i) => {
    struct.tiles[i].XPLC = xplc[i];
  });
};