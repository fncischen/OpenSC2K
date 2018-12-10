export default (data, struct) => {
  let view = new DataView(data.buffer, data.byteOffset, data.byteLength);
  let misc = {};

  misc.firstEntry = view.getUint32(0x0000);
  misc.gameMode = miscGameMode[view.getUint32(0x0004)];
  misc.rotation = view.getUint32(0x0008);
  misc.baseYear = view.getUint32(0x000c);
  misc.simCycle = view.getUint32(0x0010);
  misc.totalFunds = view.getUint32(0x0014);
  misc.totalBonds = view.getUint32(0x0018);
  misc.gameLevel = view.getUint32(0x001c);
  misc.cityStatus = view.getUint32(0x0020);
  misc.cityValue = view.getUint32(0x0024);
  misc.landValue = view.getUint32(0x0028);
  misc.crimeCount = view.getUint32(0x002c);
  misc.trafficCount = view.getUint32(0x0030);
  misc.pollution = view.getUint32(0x0034);
  misc.cityFame = view.getUint32(0x0038);
  misc.advertising = view.getUint32(0x003c);
  misc.garbage = view.getUint32(0x0040);
  misc.workerPercent = view.getUint32(0x0044);
  misc.workerHealth = view.getUint32(0x0048);
  misc.workerEQ = view.getUint32(0x004c);
  misc.nationalPopulation = view.getUint32(0x0050);
  misc.nationalValue = view.getUint32(0x0054);
  misc.nationalTax = view.getUint32(0x0058);
  misc.nationalTrend = view.getUint32(0x005c);
  misc.heat = view.getUint32(0x0060);
  misc.wind = view.getUint32(0x0064);
  misc.humid = view.getUint32(0x0068);
  misc.weatherTrend = miscWeatherTrends[view.getUint32(0x006c)];
  misc.newDisaster = miscDisasterMap[view.getUint32(0x0070)];
  misc.oldResidentialPopulation = view.getUint32(0x0074);
  misc.rewards = view.getUint32(0x0078);

  // todo: update offsets
  // todo: split into separate entries for each type
  misc.populationGraphs = view.getUint32(0x007c);
  misc.industryGraphs = view.getUint32(0x016c);
  misc.tileCounts = view.getUint32(0x01f0);

  misc.zonePopulation = [];
  misc.zonePopulation[0] = view.getUint32(0x05f0);
  misc.zonePopulation[1] = view.getUint32(0x05f4);
  misc.zonePopulation[2] = view.getUint32(0x05f8);
  misc.zonePopulation[3] = view.getUint32(0x05fc);
  misc.zonePopulation[4] = view.getUint32(0x0600);
  misc.zonePopulation[5] = view.getUint32(0x0604);
  misc.zonePopulation[6] = view.getUint32(0x0608);
  misc.zonePopulation[7] = view.getUint32(0x060c);

  // todo: update offsets
  // todo: split into 50 separate entries
  misc.bondRate = view.getUint32(0x0610);

  // todo: update offsets
  // todo: split each neighbor into separate values
  // name, population, value, fame
  // lower left, upper left, upper right, lower right
  misc.neighbors = miscParseNeighbors(view.getUint32(0x06d8));

  // todo: rci demand
  misc.rci = {
    residential: view.getInt32(0x0718),
    commercial: view.getInt32(0x071c),
    industrial: view.getInt32(0x0720),

  };
  
  misc.unknown2 = view.getInt32(0x0724);
  misc.unknown3 = view.getInt32(0x0728);
  misc.unknown4 = view.getInt32(0x072c);
  misc.unknown5 = view.getInt32(0x0730);
  misc.unknown6 = view.getInt32(0x0734);

  misc.inventions = {
    gasPower: view.getUint32(0x738),
    nuclearPower: view.getUint32(0x73c),
    solarPower: view.getUint32(0x740),
    windPower: view.getUint32(0x744),
    microwavePower: view.getUint32(0x748),
    fusionPower: view.getUint32(0x74c),
    airport: view.getUint32(0x750),
    highways: view.getUint32(0x754),
    buses: view.getUint32(0x758),
    subways: view.getUint32(0x75c),
    waterTreatment: view.getUint32(0x760),
    desalinisation: view.getUint32(0x764),
    plymouth: view.getUint32(0x768),
    forest: view.getUint32(0x76c),
    darco: view.getUint32(0x770),
    launch: view.getUint32(0x774),
    highways2: view.getUint32(0x778),
  };

  // todo: split budget
  // 432 separate values
  // 27 values x 16 years
  misc.budget = view.getUint32(0x077c);

  misc.yearEnd = view.getUint32(0x0e3c);
  misc.globalSeaLevel = view.getUint32(0x0e40);
  misc.terCoast = view.getUint32(0x0e44);
  misc.terRiver = view.getUint32(0x0e48);

  misc.military = {
    offered: miscOfferedMilitary[view.getUint32(0x0e4c)],
    type: miscMilitaryType[view.getUint32(0x0e4c)],
  };

  misc.paperList = view.getUint32(0x0e50); // x 30
  misc.newsList = view.getUint32(0x0ec8); // x 54
  misc.ordinances = view.getUint32(0x0fa0); // bitflags
  misc.unemployed = view.getUint32(0x0fa4);
  misc.militaryCount = view.getUint32(0x0fa8); // x 16
  misc.subwayCount = view.getUint32(0x0fe8);
  misc.gameSpeed = miscGameSpeed[view.getUint32(0x0fec)];

  misc.options = {
    autoBudget: view.getUint32(0x0ff0),
    autoGoto: view.getUint32(0x0ff4),
    userSoundOn: view.getUint32(0x0ff8),
    userMusicOn: view.getUint32(0x0ffc),
    noDisasters: view.getUint32(0x1000),
    paperDeliver: view.getUint32(0x1004),
    paperExtra: view.getUint32(0x1008),
    paperChoice: view.getUint32(0x100c),
  };

  misc.unknown1 = view.getUint32(0x1010);

  misc.camera = {
    zoom: view.getUint32(0x1014),
    cityCenterX: view.getUint32(0x1018),
    cityCenterY: view.getUint32(0x101c),
  };

  misc.globalArcoPopulation = view.getUint32(0x1020);
  misc.connectTiles = view.getUint32(0x1024);
  misc.teamsActive = view.getUint32(0x1028);
  misc.totalPopulation = view.getUint32(0x102c);
  misc.industryBonus = view.getUint32(0x1030);
  misc.polluteBonus = view.getUint32(0x1034);
  misc.oldArrest = view.getUint32(0x1038);
  misc.policeBonus = view.getUint32(0x103c);
  misc.disasterObject = view.getUint32(0x1040);
  misc.currentDisaster = view.getUint32(0x1044);
  misc.gotoDisaster = view.getUint32(0x1048);
  misc.sewerBonus = view.getUint32(0x104c);
  misc.extra = view.getUint32(0x1050);

  struct.MISC = misc;
};

function miscParseNeighbors (data) {
  return 0;

  let neighbors = [];

  for (let i = 0; i < 4; i++) {
    neighbors[i].name = 'name';
    neighbors[i].population = 0;
    neighbors[i].value = 0;
    neighbors[i].fame = 0;
  }

  return neighbors;
}

let miscGameMode = {
  0: 'terrainEdit',
  1: 'city',
  2: 'disaster',
};

let miscOfferedMilitary = {
  0x0: false,
  0x1: true,
};

let miscMilitaryType = {
  0x2: 'army',
  0x3: 'air',
  0x4: 'naval',
  0x5: 'missile',
};

let miscGameSpeed = {
  0x1: 'Paused',
  0x2: 'Turtle',
  0x3: 'Llama',
  0x4: 'Cheetah',
  0x5: 'African Swallow',
};

let miscWeatherTrends = {
  0x00: 'Cold',
  0x01: 'Clear',
  0x02: 'Hot',
  0x03: 'Foggy',
  0x04: 'Chilly',
  0x05: 'Overcast',
  0x06: 'Snow',
  0x07: 'Rain',
  0x08: 'Windy',
  0x09: 'Blizzard',
  0x0A: 'Hurricane',
  0x0B: 'Tornado',
};

let miscDisasterMap = {
  0x0: 'None',
  0x1: 'Fire',
  0x2: 'Flood',
  0x3: 'Riot',
  0x4: 'Toxic Spill',
  0x5: 'Air Crash',
  0x6: 'Quake',
  0x7: 'Tornado',
  0x8: 'Monster',
  0x9: 'Meltdown',
  0xA: 'Microwave',
  0xB: 'Volcano',
  0xC: 'Firestorm',
  0xD: 'Mass Riots',
  0xE: 'Mass Floods',
  0xF: 'Pollution Accident',
  0x10: 'Hurricane',
  0x11: 'Helicopter Crash',
  0x12: 'Plane Crash',
};