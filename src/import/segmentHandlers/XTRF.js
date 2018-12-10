import { resize } from './common';

export default (data, struct) => {
  let view = new Uint8Array(data);
  let xtrf = [];

  view.forEach((bits, i) => {
    xtrf[i] = bits;
  });

  // resize data array from 64x64 to 128x128
  xtrf = resize(xtrf, 64, 128);

  xtrf.forEach((data, i) => {
    struct.tiles[i].XTRF = xtrf[i];
  });
};