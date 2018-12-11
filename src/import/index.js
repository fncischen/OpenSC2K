import fs from 'fs';
import palette from './palette';
import dat from './dat';
import tilemap from './tilemap';

let files = {
  LARGE_DAT: fs.readFileSync(__dirname + '/../../assets/import/LARGE.DAT'),
  SMALLMED_DAT: fs.readFileSync(__dirname + '/../../assets/import/SMALLMED.DAT'),
  SPECIAL_DAT: fs.readFileSync(__dirname + '/../../assets/import/SPECIAL.DAT'),
  PAL_MSTR_BMP: fs.readFileSync(__dirname + '/../../assets/import/PAL_MSTR.BMP'),
  TITLESCR_BMP: fs.readFileSync(__dirname + '/../../assets/import/TITLESCR.BMP'),
};

let pal = new palette({
  data: files.PAL_MSTR_BMP
});

let large_dat = new dat({
  palette: pal,
  data: files.LARGE_DAT
});

let tm = new tilemap({
  name: 'LARGE.DAT',
  dat: large_dat
});

tm.createTilemap();

console.log('Script Completed');

setTimeout(function(){
  console.log('Exiting');
}, 120000);