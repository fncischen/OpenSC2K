export default (data, struct) => {
  let view = new Uint8Array(data);

  view.forEach((bits, i) => {
    let xund = {};

    // defaults
    xund.subway = 0;
    xund.pipes = 0;
    xund.missileSilo = false;

    // subway
    if ((bits > 0x00 && bits <= 0x0F) || (bits === 0x1F || bits === 0x20) || (bits === 0x23))
      xund.subway = bits;

    // pipes
    if ((bits >= 0x10 && bits <= 0x1E) || (bits === 0x1F || bits === 0x20))
      xund.pipes = bits;

    // missile silo
    if (bits === 0x22)
      xund.missileSilo = true;

    xund.subway = xundMap[xund.subway];
    xund.pipes = xundMap[xund.pipes];

    struct.tiles[i].XUND = xund;
  });
};

let xundMap = {
  0x00: null, // 0

  // subway
  0x01: 319, // 1
  0x02: 320,
  0x03: 321,
  0x04: 322,
  0x05: 323,
  0x06: 324,
  0x07: 325,
  0x08: 326,
  0x09: 327,
  0x0A: 328,
  0x0B: 329,
  0x0C: 330,
  0x0D: 331,
  0x0E: 332,
  0x0F: 333, // 15

  // pipes
  0x10: 334, // 16
  0x11: 335,
  0x12: 336,
  0x13: 337,
  0x14: 338,
  0x15: 339,
  0x16: 340,
  0x17: 341,
  0x18: 342,
  0x19: 343,
  0x1A: 344,
  0x1B: 345,
  0x1C: 346,
  0x1D: 347,
  0x1E: 348, // 30
  
  // subway/pipes crossover
  0x1F: 349, // 31
  0x20: 350, // 32
  
  // building pipes
  0x21: 351, // 33
  
  // missle silo base
  0x22: 352, // 34

  // subway transition
  0x23: 353, // 35
};