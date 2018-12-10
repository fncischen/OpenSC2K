export default (data, struct) => {
  let view = new DataView(data.buffer, data.byteOffset, data.byteLength);

  for (let i = 0; i < data.byteLength / 2; i++) {
    let bits = view.getUint16(i * 2);
    let altm = {};

    altm.tunnelLevels  = (bits & 0xFF00);
    altm.waterCovered  = (bits & 0x0080) !== 0;
    altm.waterLevel    = (bits & 0x0060);
    altm.altitude      = (bits & 0x001F);

    struct.tiles[i].ALTM = altm;
  }
};