export default (data, struct) => {
  let view = new DataView(data.buffer, data.byteOffset, data.byteLength);

  let scen = {
    start: view.getUint32(0x00),
    disasterType: view.getUint16(0x04),
    disasterPositionX: view.getUint8(0x06),
    disasterPositionY: view.getUint8(0x07),
    timeLimitMonths: view.getUint16(0x08),
    citySizeGoal: view.getUint32(0x0A),
    residentialGoal: view.getUint32(0x0D),
    commercialGoal: view.getUint32(0x10),
    industrialGoal: view.getUint32(0x14),
    cashGoal: view.getUint32(0x18),
    landValueGoal: view.getUint32(0x1C),
    pollutionLimit: view.getUint32(0x20),
    crimeLimit: view.getUint32(0x24),
    trafficLimit: view.getUint32(0x28),
    //buildItem1: view.getUint8(0x2C),
    //buildItem2: view.getUint8(0x2D),
    //item1Tiles: view.getUint16(0x2E),
    //item2Tiles: view.getUint16(0x30),
  };

  struct.SCEN = scen;
};