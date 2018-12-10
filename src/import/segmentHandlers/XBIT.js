export default (data, struct) => {
  let view = new Uint8Array(data);

  view.forEach((bits, i) => {
    let xbit = {};

    xbit.conductive    = (bits & 0x80) !== 0;
    xbit.powered       = (bits & 0x40) !== 0;
    xbit.piped         = (bits & 0x20) !== 0;
    xbit.watered       = (bits & 0x10) !== 0;
    xbit.landValueMask = (bits & 0x08) !== 0;
    xbit.waterCovered  = (bits & 0x04) !== 0;
    xbit.rotate        = (bits & 0x02) !== 0;
    xbit.saltWater     = (bits & 0x01) !== 0;

    struct.tiles[i].XBIT = xbit;
  });
};