"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const tmi = require("tmi.js");
const logging_1 = require("logging");
class Bot {
    constructor(username, token, channels, secret, clientId) {
        this.username = username;
        this.token = token;
        this.channels = channels;
        // these aren't even needed for the functionality currently available in this bot
        this.secret = secret || '';
        this.clientId = clientId || '';
    }
    start() {
        return __awaiter(this, void 0, void 0, function* () {
            const opts = {
                identity: {
                    username: this.username,
                    password: this.token
                },
                channels: this.channels
            };
            this.client = tmi.Client(opts);
            this.client.on('connected', this.onConnected);
            this.client.on('message', this.onMessage);
            this.client.connect();
        });
    }
    say(target, msg) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                Bot.logger.info(`Replying: ${target} :: ${msg}`);
                this.client.say(target, msg);
            }
            catch (err) {
                Bot.logger.error(`Error sending a message.\nTo:${target}\nmessage:${msg}`, err);
            }
        });
    }
    onMessage(target, context, msg, self) {
        return __awaiter(this, void 0, void 0, function* () {
            if (self) {
                // Ignore messages from the bot
                Bot.logger.debug(`Ignoring message from self...`);
                return;
            }
            Bot.logger.debug(`Incoming message: ${target} :: ${msg} :: ${context}`);
            // Remove whitespace from chat message
            const commandName = msg.trim();
            let response = '';
            Bot.logger.info(`Handling ${commandName}:`);
            switch (commandName) {
                case '!dice':
                    const num = this.rollDice();
                    response = `You rolled a ${num}`;
                    break;
                default:
                    Bot.logger.debug(`Unrecognized command: ${commandName}`);
                    response = `I didn't understand the command ${commandName}.`;
                    break;
            }
            yield this.say(target, response);
        });
    }
    // Function called when the "dice" command is issued
    rollDice() {
        Bot.logger.debug(`Performing a dice roll`);
        const sides = 6;
        return Math.floor(Math.random() * sides) + 1;
    }
    // Called every time the bot connects to Twitch chat
    onConnected(addr, port) {
        Bot.logger.info(`Connected to ${addr}:${port}`);
    }
}
Bot.logger = logging_1.L.getLogger('bot');
exports.Bot = Bot;
//# sourceMappingURL=bot.js.map