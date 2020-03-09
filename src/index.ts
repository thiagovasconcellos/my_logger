import 'dotenv/config';
import * as os from 'os';
import { writeFile } from 'fs';
import { format } from 'date-fns';

let Path: string;

interface TCVLog {
  log_type: string;
  cpu_arc: string;
  platform: string;
  hostname: string;
  home_dir: string;
  cpus: string | os.CpuInfo[];
  network_interfaces: string | { [index: string]: os.NetworkInterfaceInfo[] };
  timestamp: string;
}

class TCVLog {
  constructor() {
    this.log_type = '';
    this.cpu_arc = os.arch();
    this.platform = `${os.platform()} - ${os.type()}`;
    this.hostname = os.hostname();
    this.home_dir = os.homedir();
    this.cpus = process.env.GENERATE_CPUS === 'true' ? os.cpus() : 'false';
    (this.network_interfaces = process.env.GENERATE_INTERFACES === 'true' ? os.networkInterfaces() : 'false'),
      (this.timestamp = format(new Date(), 'yyyy-MM-dd HH:mm:ss'));
  }

  sysInfo(): Record<string, any> {
    return {
      log_type: this.log_type,
      cpu_arc: this.cpu_arc,
      platform: this.platform,
      hostname: this.hostname,
      home_dir: this.home_dir,
      cpus: this.cpus,
      network_interfaces: this.network_interfaces,
      timestamp: this.timestamp,
    };
  }
}

/**
 * This class contains some methods to help you build a nice and consistent log.
 * All you have to do is pass informations to method in JSON Object format { property: "value" }
 * That a file will be generate in folder
 */
class Logger extends TCVLog {
  object: Record<string, any>;
  constructor(object: Record<string, any>) {
    super();
    this.object = object;
  }

  static setPath(path: string) {
    Path = path;
  }

  /**
   * Allow you to generate info-logs. Info logs behave slight different than error-logs.
   * The main difference is
   * This methods also generate a .json file in folder that you set on .env
   * @param object Simple JSON Object: {property: "value" }
   */
  static info(object: any) {
    const info = new TCVLog();
    const intel = info.sysInfo();
    intel.log_type = 'INFO';
    intel.data = [object];
    writeFile(
      `${Path}/${format(new Date(), 'yyyyMMddHHmmss')}-${intel.hostname}-INFO-ONLY.json`,
      JSON.stringify(intel, null, '\t'),
      err => {
        if (err) throw err;
      },
    );
    if (process.env.LOG_TO_CONSOLE === 'true') {
      console.log(intel);
    }
  }

  /**
   * Allow you to generate error-logs.
   * Also generate a .json file in folder that you set on .env file
   * @param object Simple JSON Object: { property: "value" }
   */
  static error(object: any) {
    const info = new TCVLog();
    const intel = info.sysInfo();
    intel.log_type = 'ERROR';
    intel.data = [object];
    writeFile(
      `${Path}/${format(new Date(), 'yyyyMMddHHmmss')}-${intel.hostname}-ERROR.json`,
      JSON.stringify(intel, null, '\t'),
      err => {
        if (err) throw err;
      },
    );
    if (process.env.LOG_TO_CONSOLE === 'true') {
      console.log(intel);
    }
  }
}

export default Logger;
