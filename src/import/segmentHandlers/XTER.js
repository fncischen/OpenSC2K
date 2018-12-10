export default (data, struct) => {
  let view = new Uint8Array(data);

  view.forEach((bits, i) => {
    let xter = {};

    xter.terrain = xterMap[bits].tile;
    xter.waterLevel = xterMap[bits].waterLevel;

    if (xter.waterLevel == 'dry')
      xter.water = null;
    else
      xter.water = xter.terrain;

    struct.tiles[i].XTER = xter;
  });
};

let xterMap = {
  // land
  0x00: { tile: 256, waterLevel: 'dry' }, // 0
  0x01: { tile: 257, waterLevel: 'dry' },
  0x02: { tile: 258, waterLevel: 'dry' },
  0x03: { tile: 259, waterLevel: 'dry' },
  0x04: { tile: 260, waterLevel: 'dry' },
  0x05: { tile: 261, waterLevel: 'dry' },
  0x06: { tile: 262, waterLevel: 'dry' },
  0x07: { tile: 263, waterLevel: 'dry' },
  0x08: { tile: 264, waterLevel: 'dry' },
  0x09: { tile: 265, waterLevel: 'dry' },
  0x0A: { tile: 266, waterLevel: 'dry' },
  0x0B: { tile: 267, waterLevel: 'dry' },
  0x0C: { tile: 268, waterLevel: 'dry' },
  0x0D: { tile: 269, waterLevel: 'dry' }, // 13

  // not used
  0x0E: { tile: null, waterLevel: null },
  0x0F: { tile: null, waterLevel: null },

  // underwater
  0x10: { tile: 270, waterLevel: 'submerged' }, // 16
  0x11: { tile: 270, waterLevel: 'submerged' },
  0x12: { tile: 270, waterLevel: 'submerged' },
  0x13: { tile: 270, waterLevel: 'submerged' },
  0x14: { tile: 270, waterLevel: 'submerged' },
  0x15: { tile: 270, waterLevel: 'submerged' },
  0x16: { tile: 270, waterLevel: 'submerged' },
  0x17: { tile: 270, waterLevel: 'submerged' },
  0x18: { tile: 270, waterLevel: 'submerged' },
  0x19: { tile: 270, waterLevel: 'submerged' },
  0x1A: { tile: 270, waterLevel: 'submerged' },
  0x1B: { tile: 270, waterLevel: 'submerged' },
  0x1C: { tile: 270, waterLevel: 'submerged' },
  0x1D: { tile: 270, waterLevel: 'submerged' }, // 29

  // not used
  0x1E: { tile: null, waterLevel: null },
  0x1F: { tile: null, waterLevel: null },

  // shoreline
  0x20: { tile: 270, waterLevel: 'shore' }, // 32
  0x21: { tile: 271, waterLevel: 'shore' },
  0x22: { tile: 272, waterLevel: 'shore' },
  0x23: { tile: 273, waterLevel: 'shore' },
  0x24: { tile: 274, waterLevel: 'shore' },
  0x25: { tile: 275, waterLevel: 'shore' },
  0x26: { tile: 276, waterLevel: 'shore' },
  0x27: { tile: 277, waterLevel: 'shore' },
  0x28: { tile: 278, waterLevel: 'shore' },
  0x29: { tile: 279, waterLevel: 'shore' },
  0x2A: { tile: 280, waterLevel: 'shore' },
  0x2B: { tile: 281, waterLevel: 'shore' },
  0x2C: { tile: 282, waterLevel: 'shore' },
  0x2D: { tile: 283, waterLevel: 'shore' }, // 45

  // not used
  0x2E: { tile: null, waterLevel: null },
  0x2F: { tile: null, waterLevel: null },

  // surface water
  0x30: { tile: 270, waterLevel: 'surface' }, // 48
  0x31: { tile: 271, waterLevel: 'surface' },
  0x32: { tile: 272, waterLevel: 'surface' },
  0x33: { tile: 273, waterLevel: 'surface' },
  0x34: { tile: 274, waterLevel: 'surface' },
  0x35: { tile: 275, waterLevel: 'surface' },
  0x36: { tile: 276, waterLevel: 'surface' },
  0x37: { tile: 277, waterLevel: 'surface' },
  0x38: { tile: 278, waterLevel: 'surface' },
  0x39: { tile: 279, waterLevel: 'surface' },
  0x3A: { tile: 280, waterLevel: 'surface' },
  0x3B: { tile: 281, waterLevel: 'surface' },
  0x3C: { tile: 282, waterLevel: 'surface' },
  0x3D: { tile: 283, waterLevel: 'surface' }, // 61

  // waterfall
  0x3E: { tile: 284, waterLevel: 'waterfall' }, // 62

  // not used
  0x3F: { tile: null, waterLevel: null },

  // streams
  0x40: { tile: 285, waterLevel: 'surface' }, // 64
  0x41: { tile: 286, waterLevel: 'surface' },
  0x42: { tile: 287, waterLevel: 'surface' },
  0x43: { tile: 288, waterLevel: 'surface' },
  0x44: { tile: 289, waterLevel: 'surface' },
  0x45: { tile: 290, waterLevel: 'surface' }, // 69
};