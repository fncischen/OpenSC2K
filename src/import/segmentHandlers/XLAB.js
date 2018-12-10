export default (data, struct) => {
  // labels (1 byte len + 24 byte string)
  let view = new Uint8Array(data);
  let labels = [];

  for (let i = 0; i < 256; i++) {
    let labelPos = i * 25;
    let labelLength = Math.max(0, Math.min(view[labelPos], 24));
    let labelData = view.subarray(labelPos + 1, labelPos + 1 + labelLength);

    labels[i] = Array.prototype.map.call(labelData, x => String.fromCharCode(x)).join('');
  }

  struct.XLAB = labels;
};