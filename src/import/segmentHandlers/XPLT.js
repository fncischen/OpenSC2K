import { resize } from './common';

export default (data, struct) => {
  let view = new Uint8Array(data);
  let xplt = [];

  view.forEach((bits, i) => {
    xplt[i] = bits;
  });

  // resize data array from 64x64 to 128x128
  xplt = resize(xplt, 64, 128);

  xplt.forEach((data, i) => {
    struct.tiles[i].XPLT = xplt[i];
  });
};