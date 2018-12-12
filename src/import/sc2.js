import * as segmentHandlers from './segmentHandlers/';

class sc2 {
  constructor (options) {
    this.scene = options.scene;
    this.file = 'Default.sc2';
    this.data = {
      tiles: []
    };

    let x = 0;
    let y = 0;

    for (let i = 0; i < 128 * 128; i++) {
      this.data.tiles.push({ x: x, y: y });

      if (y === 127) {
        y = 0;
        x += 1;
      } else {
        y += 1;
      }
    }
  }

  import (bytes) {
    let buffer = new Uint8Array(bytes);
    let data = buffer.subarray(12);
    let segments = this.splitIntoSegments(data);

    Object.keys(segments).sort().forEach((segmentTitle) => {
      let handler = segmentHandlers[segmentTitle];

      if (handler)
        handler(segments[segmentTitle], this.data);
    });

    return this.parse();
  }

  splitIntoSegments (data) {
    let segments = {};

    while (data.length > 0) {
      let segmentTitle = Array.prototype.map.call(data.subarray(0, 4), x => String.fromCharCode(x)).join('');
      let lengthBytes = data.subarray(4, 8);
      let segmentLength = new DataView(lengthBytes.buffer).getUint32(lengthBytes.byteOffset);
      let segmentContent = data.subarray(8, 8 + segmentLength);

      if (segmentTitle != 'ALTM' && segmentTitle != 'CNAM')
        segmentContent = this.decompressSegment(segmentContent);

      segments[segmentTitle] = segmentContent;
      data = data.subarray(8 + segmentLength);
    }

    return segments;
  }

  decompressSegment (bytes) {
    let output = [];
    let dataCount = 0;

    for (let i = 0; i < bytes.length; i++) {
      if (dataCount > 0) {
        output.push(bytes[i]);
        dataCount -= 1;
        continue;
      }

      // data bytes
      if (bytes[i] < 128) {
        dataCount = bytes[i];
      
      // run-length encoded byte
      } else {
        let repeatCount = bytes[i] - 127;
        let repeated = bytes[i + 1];

        for (let i = 0; i < repeatCount; i++)
          output.push(repeated);
        
        // skip the next byte
        i += 1;
      }
    }

    return Uint8Array.from(output);
  }

  parse () {
    // default city name to filename when not available
    if (!this.data.CNAM)
      this.data.CNAM = { cityName: this.file.replace('.SC2', '').replace('.sc2', '') };

    let data = {
      info: {
        cityCenter:  {
          x: this.data.MISC.cityCenterX,
          y: this.data.MISC.cityCenterY
        },
        name:        this.data.CNAM.cityName,
        money:       this.data.MISC.money,
        population:  this.data.MISC.population,
        zoomLevel:   this.data.MISC.zoomLevel,
        height:      128,
        width:       128,
        rotation:    this.data.MISC.rotation,
        waterLevel:  this.data.MISC.globalSeaLevel,
        yearFounded: this.data.MISC.yearFounded
      },
      data: this.data,
      cells: []
    };

    for (let i = 0; i < this.data.tiles.length; i++) {
      let tile = this.data.tiles[i];
      let cell = {
        x:                     tile.x,
        y:                     tile.y,
        z:                     tile.ALTM.altitude,

        data:                  tile,

        tiles: {
          terrain:             tile.XTER.terrain  || null,
          heightmap:           tile.XTER.terrain  || null,
          //water:               tile.XTER.water    || null,
          //zone:                tile.XZON.zone     || null,
          //building:            tile.XBLD.building || null,
          //road:                tile.XBLD.road     || null,
          //rail:                tile.XBLD.rail     || null,
          //power:               tile.XBLD.power    || null,
          //highway:             tile.XBLD.highway  || null,
          //subway:              tile.XUND.subway   || null,
          //pipe:                tile.XUND.pipes    || null,
        },

        cornersTopLeft:        tile.XZON.topLeft,
        cornersTopRight:       tile.XZON.topRight,
        cornersBottomLeft:     tile.XZON.bottomLeft,
        cornersBottomRight:    tile.XZON.bottomRight,

        conductive:            tile.XBIT.conductive,
        powered:               tile.XBIT.powered,
        piped:                 tile.XBIT.piped,
        watered:               tile.XBIT.watered,
        rotate:                tile.XBIT.rotate,
        landValueMask:         tile.XBIT.landValueMask,
        saltWater:             tile.XBIT.saltWater,
        waterCovered:          tile.XBIT.waterCovered,
        missileSilo:           tile.XUND.missileSilo,

        waterLevel:            tile.XTER.waterLevel,
        surfaceWater:          tile.XTER.surfaceWater,

        tunnelLevel:           tile.ALTM.tunnelLevels,
        altWaterCovered:       tile.ALTM.waterCovered,
        terrainWaterLevel:     tile.ALTM.waterLevel,

        _ALTM:                  tile.ALTM,
        _XBIT:                  tile.XBIT,
        _XBLD:                  tile.XBLD,
        _XCRM:                  tile.XCRM,
        _XFIR:                  tile.XFIR,
        _XPLC:                  tile.XPLC,
        _XPLT:                  tile.XPLT,
        _XPOP:                  tile.XPOP,
        _XROG:                  tile.XROG,
        _XTER:                  tile.XTER,
        _XTHG:                  tile.XTHG,
        _XTRF:                  tile.XTRF,
        _XTXT:                  tile.XTXT,
        _XUND:                  tile.XUND,
        _XVAL:                  tile.XVAL,
        _XZON:                  tile.XZON,
      };

      data.cells.push(cell);
    }

    return data;
  }
}

export default sc2;