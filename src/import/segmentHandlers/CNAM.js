export default (data, struct) => {
  let view = new Uint8Array(data);
  let stringData = view.subarray(1, 1 + view[0] & 0x3F);
  let cnam = '';

  for (let i = 0; i < stringData.length; i++) {
    if (stringData[i] == 0x00)
      break;

    cnam += String.fromCharCode(stringData[i]);
  }

  struct.CNAM = {};
  struct.CNAM.cityName = cnam;
};