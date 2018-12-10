export default (data, struct) => {
  let view = new Uint8Array(data);

  view.forEach((bits, i) => {
    let xzon = {};

    xzon.topLeft = (bits & 0x80) !== 0;
    xzon.bottomLeft = (bits & 0x40) !== 0;
    xzon.bottomRight = (bits & 0x20) !== 0;
    xzon.topRight = (bits & 0x10) !== 0;

    xzon.zone = xzonMap[bits & 0x0F];

    struct.tiles[i].XZON = xzon;
  });
};

let xzonMap = {
  0x00: null,
  0x01: 291, // light res
  0x02: 292, // dense res
  0x03: 293, // light comm
  0x04: 294, // dense comm
  0x05: 295, // light ind
  0x06: 296, // dense ind
  0x07: 297, // military
  0x08: 298, // airport
  0x09: 299, // seaport
};