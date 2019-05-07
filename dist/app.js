"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config = require('../config.json');
const bot_1 = require("./bot");
const logging_1 = require("./logging");
class App {
    constructor() {
        this.bot = new bot_1.Bot(config.username, config.oath_token, config.channels, config.secret, config.clientId);
    }
    run() {
        App.logger.info(`Starting the bot..`);
        this.bot.start();
    }
}
App.logger = logging_1.L.getLogger('app');
new App().run();
//# sourceMappingURL=app.js.map