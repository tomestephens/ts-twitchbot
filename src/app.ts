const config = require('../config.json');
import { Bot } from './bot';
import { L } from './logging';

class App {
  private static readonly logger = L.getLogger('app');
  private bot: Bot;

  public constructor() {
    this.bot = new Bot(config.username, config.oath_token, config.channels, config.secret, config.clientId, config.notifications);
  }

  public run() {
    App.logger.info(`Starting the bot..`);
    this.bot.start();
  }
}

new App().run();