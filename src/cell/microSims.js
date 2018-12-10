import traffic from './traffic';
import highwayTraffic from './highwayTraffic';

class microSims {
  constructor (options) {
    this.cell        = options.cell;
    this.data        = this.cell.data;
    this.simulators  = {};
    this.x           = this.cell.x;
    this.y           = this.cell.y;
    this.z           = this.cell.z;
  }

  create () {
    if (this.cell.road)
      this.simulators.traffic = new traffic({ cell: this.cell });

    if (this.cell.highway)
      this.simulators.highwayTraffic = new highwayTraffic({ cell: this.cell });

    Object.keys(this.simulators).forEach((sim) => {
      this.simulators[sim].create();
    });
  }

  update () {
    Object.keys(this.simulators).forEach((sim) => {
      this.simulators[sim].update();
    });
  }
}

export default microSims;