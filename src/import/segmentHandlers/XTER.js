import { bin2str } from './common';

export default (data, map) => {
  data.forEach((bits, i) => {
    let xter = {};

    xter.terrain = xterMap[bits].terrain;
    xter.water   = xterMap[bits].water;
    xter.type    = xterMap[bits].type;

    // raw binary values as strings for research/debug
    xter.binaryText = {
      bits: bin2str(bits, 8)
    };

    map.cells[i]._segmentData.XTER = xter;
  });
};


// terrain tile id is set in all cases
// so we know what type of terrain tile to
// display when water is hidden or heightmap
// is displayed
let xterMap = {
  // land
  0x00: { terrain: 256, water: null, type: 'dry' },
  0x01: { terrain: 257, water: null, type: 'dry' },
  0x02: { terrain: 258, water: null, type: 'dry' },
  0x03: { terrain: 259, water: null, type: 'dry' },
  0x04: { terrain: 260, water: null, type: 'dry' },
  0x05: { terrain: 261, water: null, type: 'dry' },
  0x06: { terrain: 262, water: null, type: 'dry' },
  0x07: { terrain: 263, water: null, type: 'dry' },
  0x08: { terrain: 264, water: null, type: 'dry' },
  0x09: { terrain: 265, water: null, type: 'dry' },
  0x0A: { terrain: 266, water: null, type: 'dry' },
  0x0B: { terrain: 267, water: null, type: 'dry' },
  0x0C: { terrain: 268, water: null, type: 'dry' },
  0x0D: { terrain: 269, water: null, type: 'dry' },

  // underwater
  0x10: { terrain: 256, water: 270, type: 'submerged' },
  0x11: { terrain: 257, water: 270, type: 'submerged' },
  0x12: { terrain: 258, water: 270, type: 'submerged' },
  0x13: { terrain: 259, water: 270, type: 'submerged' },
  0x14: { terrain: 260, water: 270, type: 'submerged' },
  0x15: { terrain: 261, water: 270, type: 'submerged' },
  0x16: { terrain: 262, water: 270, type: 'submerged' },
  0x17: { terrain: 263, water: 270, type: 'submerged' },
  0x18: { terrain: 264, water: 270, type: 'submerged' },
  0x19: { terrain: 265, water: 270, type: 'submerged' },
  0x1A: { terrain: 266, water: 270, type: 'submerged' },
  0x1B: { terrain: 267, water: 270, type: 'submerged' },
  0x1C: { terrain: 268, water: 270, type: 'submerged' },
  0x1D: { terrain: 269, water: 270, type: 'submerged' },

  // shoreline
  0x20: { terrain: 256, water: 270, type: 'shore' },
  0x21: { terrain: 257, water: 271, type: 'shore' },
  0x22: { terrain: 258, water: 272, type: 'shore' },
  0x23: { terrain: 259, water: 273, type: 'shore' },
  0x24: { terrain: 260, water: 274, type: 'shore' },
  0x25: { terrain: 261, water: 275, type: 'shore' },
  0x26: { terrain: 262, water: 276, type: 'shore' },
  0x27: { terrain: 263, water: 277, type: 'shore' },
  0x28: { terrain: 264, water: 278, type: 'shore' },
  0x29: { terrain: 265, water: 279, type: 'shore' },
  0x2A: { terrain: 266, water: 280, type: 'shore' },
  0x2B: { terrain: 267, water: 281, type: 'shore' },
  0x2C: { terrain: 268, water: 282, type: 'shore' },
  0x2D: { terrain: 269, water: 283, type: 'shore' },

  // surface water
  0x30: { terrain: 256, water: 270, type: 'surface' },
  0x31: { terrain: 257, water: 271, type: 'surface' },
  0x32: { terrain: 258, water: 272, type: 'surface' },
  0x33: { terrain: 259, water: 273, type: 'surface' },
  0x34: { terrain: 260, water: 274, type: 'surface' },
  0x35: { terrain: 261, water: 275, type: 'surface' },
  0x36: { terrain: 262, water: 276, type: 'surface' },
  0x37: { terrain: 263, water: 277, type: 'surface' },
  0x38: { terrain: 264, water: 278, type: 'surface' },
  0x39: { terrain: 265, water: 279, type: 'surface' },
  0x3A: { terrain: 266, water: 280, type: 'surface' },
  0x3B: { terrain: 267, water: 281, type: 'surface' },
  0x3C: { terrain: 268, water: 282, type: 'surface' },
  0x3D: { terrain: 269, water: 283, type: 'surface' },

  // waterfall
  0x3E: { terrain: 269, water: 284, type: 'waterfall' },

  // streams
  0x40: { terrain: 256, water: 285, type: 'surface' },
  0x41: { terrain: 256, water: 286, type: 'surface' },
  0x42: { terrain: 256, water: 287, type: 'surface' },
  0x43: { terrain: 256, water: 288, type: 'surface' },
  0x44: { terrain: 256, water: 289, type: 'surface' },
  0x45: { terrain: 256, water: 290, type: 'surface' },
};