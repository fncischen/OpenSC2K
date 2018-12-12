export default (data, struct) => {
  let view = new DataView(data.buffer, data.byteOffset, data.byteLength);

  for (let i = 0; i < data.byteLength / 2; i++) {
    let bits = view.getUint16(i * 2);
    let altm = {};

    altm.tunnelLevels  = (bits & 0xFF00);  // 0b1111111100000000
    altm.waterCovered  = (bits & 0x0080) !== 0;  // 0b10000000
    altm.waterLevel    = (bits & 0x0060); // 0b01100000
    altm.altitude      = (bits & 0x001F);  // 0b00011111

    struct.tiles[i].ALTM = altm;
  }
};