import dat from 'dat.gui';

class debug {
  constructor (options) {
    this.scene = options.scene;
    this.common = this.scene.sys.game.common;
    this.toggleLayer = this.toggleLayerInit();
    this.gui = new dat.GUI();
    this.gui.closed = false;

    let f1 = this.gui.addFolder('Performance');
    f1.add(this.scene.sys.game.loop, 'actualFps', 'FPS').listen();
    f1.open();

    let g1 = this.gui.addFolder('Cursor');
    g1.add(this.scene.input, 'x', 'X').listen();
    g1.add(this.scene.input, 'y', 'Y').listen();
    g1.add(this.scene.viewport.worldPoint, 'x', 'WorldPoint X').listen();
    g1.add(this.scene.viewport.worldPoint, 'y', 'WorldPoint Y').listen();
    g1.add(this.scene.city.map.selectedCell, 'x', 'Cell X').listen();
    g1.add(this.scene.city.map.selectedCell, 'y', 'Cell Y').listen();
    
    let g2 = this.gui.addFolder('Camera');
    g2.add(this.scene.cameras.main, 'scrollX', 'X').listen();
    g2.add(this.scene.cameras.main, 'scrollY', 'Y').listen();
    g2.add(this.scene.cameras.main, 'zoom', 'Zoom', 0.1, 2).step(0.1).listen();

    let g3 = this.gui.addFolder('World');
    g3.add(this, 'sleepWakeWorld', 'Sleep / Wake');
    g3.add(this.scene.city.load, 'open', 'Open City');
    //g3.add(this.city.save, 'saveCity', 'Save City');
    g3.add(this.toggleLayer, 'terrain', 'Toggle Terrain');
    g3.add(this.toggleLayer, 'heightmap', 'Toggle Height Map');
    g3.add(this.toggleLayer, 'water', 'Toggle Water');
    g3.add(this.toggleLayer, 'road', 'Toggle Road');
    g3.add(this.toggleLayer, 'power', 'Toggle Power');
    g3.add(this.toggleLayer, 'building', 'Toggle Building');
    g3.add(this.toggleLayer, 'zone', 'Toggle Zone');
    g3.add(this.toggleLayer, 'rail', 'Toggle Rail');
    g3.add(this.toggleLayer, 'highway', 'Toggle Highway');
    g3.add(this.toggleLayer, 'subway', 'Toggle Subway');
    g3.add(this.toggleLayer, 'pipes', 'Toggle Pipes');
  }

  toggleLayerInit () {
    return {
      terrain: () => {
        this.common.world.city.map.toggleLayerVisibility('terrain');
      },
      heightmap: () => {
        this.common.world.city.map.toggleLayerVisibility('heightmap');
      },
      water: () => {
        this.common.world.city.map.toggleLayerVisibility('water');
      },
      road: () => {
        this.common.world.city.map.toggleLayerVisibility('road');
      },
      power: () => {
        this.common.world.city.map.toggleLayerVisibility('power');
      },
      building: () => {
        this.common.world.city.map.toggleLayerVisibility('building');
      },
      zone: () => {
        this.common.world.city.map.toggleLayerVisibility('zone');
      },
      rail: () => {
        this.common.world.city.map.toggleLayerVisibility('rail');
      },
      highway: () => {
        this.common.world.city.map.toggleLayerVisibility('highway');
      },
      subway: () => {
        this.common.world.city.map.toggleLayerVisibility('subway');
      },
      pipes: () => {
        this.common.world.city.map.toggleLayerVisibility('pipes');
      },
    };
  }

  shutdown () {
    if (this.gui)
      this.gui.destroy();
  }

  loadCity () {
    this.scene.city.common.loadCity();
  }

  saveCity () {
    this.scene.city.common.saveCity();
  }

  sleepWakeWorld () {
    if (this.common.world.scene.isSleeping())
      this.common.world.scene.wake();
    else
      this.common.world.scene.sleep();
  }
}

export default debug;