import { L } from './logging';
import * as fs from 'fs';

const player = require('node-wav-player');

export class NotificationHandler {
  private static readonly logger = L.getLogger('notificationHandler');
  private configs : any = {};

  constructor(configs: [any]) {
    for(let config of configs) {
      if (!fs.existsSync(config.sound)) {
        NotificationHandler.logger.warn(`Unable to locate notification sound: ${config.sound} for ${config.event}`);
      } else {
        this.configs[config.event] = config.sound;
      }
    }
  }

  public async notify(event: string) {
    if(this.configs[event]) {
      player.play({path: this.configs[event]}).catch(err => {
        NotificationHandler.logger.error(`Failed to play the sound.`, err);
      });
    }
  }
}