import { bin2str } from './common';
import tiles from '../tiles';

export default (data, map) => {
  let view = new Uint8Array(data);

  view.forEach((bits, i) => {
    let xund = { desc: null };

    xund.id       = bits;
    xund.type     = xundMap[bits].type    || null;
    xund.subtype  = xundMap[bits].subtype || null;

    if (xund.id > 0)
      xund.desc = tiles[xund.id];

    // raw binary values as strings for research/debug
    xund.binaryText = {
      bits: bin2str(bits, 8)
    };

    map.cells[i]._segmentData.XUND = xund;
  });
};

let xundMap = {
  0x00: {id: 0, type: null, subtype: null },

  // subway
  0x01: { id: 319, type: 'subway', subtype: null },
  0x02: { id: 320, type: 'subway', subtype: null },
  0x03: { id: 321, type: 'subway', subtype: null },
  0x04: { id: 322, type: 'subway', subtype: null },
  0x05: { id: 323, type: 'subway', subtype: null },
  0x06: { id: 324, type: 'subway', subtype: null },
  0x07: { id: 325, type: 'subway', subtype: null },
  0x08: { id: 326, type: 'subway', subtype: null },
  0x09: { id: 327, type: 'subway', subtype: null },
  0x0A: { id: 328, type: 'subway', subtype: null },
  0x0B: { id: 329, type: 'subway', subtype: null },
  0x0C: { id: 330, type: 'subway', subtype: null },
  0x0D: { id: 331, type: 'subway', subtype: null },
  0x0E: { id: 332, type: 'subway', subtype: null },
  0x0F: { id: 333, type: 'subway', subtype: null },

  // pipes
  0x10: { id: 334, type: 'pipes', subtype: null },
  0x11: { id: 335, type: 'pipes', subtype: null },
  0x12: { id: 336, type: 'pipes', subtype: null },
  0x13: { id: 337, type: 'pipes', subtype: null },
  0x14: { id: 338, type: 'pipes', subtype: null },
  0x15: { id: 339, type: 'pipes', subtype: null },
  0x16: { id: 340, type: 'pipes', subtype: null },
  0x17: { id: 341, type: 'pipes', subtype: null },
  0x18: { id: 342, type: 'pipes', subtype: null },
  0x19: { id: 343, type: 'pipes', subtype: null },
  0x1A: { id: 344, type: 'pipes', subtype: null },
  0x1B: { id: 345, type: 'pipes', subtype: null },
  0x1C: { id: 346, type: 'pipes', subtype: null },
  0x1D: { id: 347, type: 'pipes', subtype: null },
  0x1E: { id: 348, type: 'pipes', subtype: null },
  
  // subway/pipes crossover
  0x1F: { id: 349, type: 'subway', subtype: 'pipes' },
  0x20: { id: 350, type: 'subway', subtype: 'pipes' },
  
  // building pipes
  0x21: { id: 351, type: 'pipes', subtype: null },
  
  // missle silo base
  0x22: { id: 352, type: 'silo' },

  // subway / rail transition
  0x23: { id: 353, type: 'subway', subtype: 'rail' },
};