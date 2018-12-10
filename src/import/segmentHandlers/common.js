//
// resize a bitmap data array using nearest neighbor algorithm
//
function resize(data, sourceSize, destSize) {
  let resizedData = [];

  for (let i = 0; i < destSize; i++) {
    for (let j = 0; j < destSize; j++) {
      let x = Math.floor(j * sourceSize / destSize);
      let y = Math.floor(i * sourceSize / destSize);

      resizedData[(i * destSize + j)] = data[(y * sourceSize + x)];
    }
  }

  return resizedData;
}

export { resize };