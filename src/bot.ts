import * as tmi from 'tmi.js';
import { L } from './logging';
import { CommandHandler } from './commands';

const player = require('node-wav-player');

export class Bot {
  private static readonly logger = L.getLogger('bot');
  private client: tmi.Client;
  private username: string;
  private token: string;
  private channels: string[];
  private secret: string;
  private clientId: string;
  private notification: string;

  public constructor(username: string, token: string, channels: string[], secret?: string, clientId?: string, notification?: string) {
    this.username = username;
    this.token = token;
    this.channels = channels;

    // these aren't even needed for the functionality currently available in this bot
    this.secret = secret || '';
    this.clientId = clientId || '';

    this.notification = notification || '';
  }

  public async start(): Promise<void> {
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
    this.client.on('join', this.onJoin);
    this.client.on('part', this.onPart);

    this.client.connect();
  }

  private async say(target: string, msg: string): Promise<void> {
    try {
      Bot.logger.info(`Replying: ${target} :: ${msg}`);
      this.client.say(target, msg);
    } catch (err) {
      Bot.logger.error(`Error sending a message.\nTo:${target}\nmessage:${msg}`, err);
    }
  }

  // event handlers
  private onMessage = async (target, context, msg, self): Promise<void> => {
    // Play a notification on EVERY message. Really? Is that what you want?
    if(this.notification) {
      player.play({path: this.notification}).catch(err => {
        Bot.logger.error(`Failed to play the sound.`, err);
      });
    }

    if (!Bot.isCommand(msg, self, context)) {
      Bot.logger.debug(`Message is not relevant to the bot`);
      return;
    }

    Bot.logger.debug(`Incoming command: ${target} :: ${msg} :: ${context}`);
    // Remove whitespace from chat message
    const response = await CommandHandler.handle(msg.trim());

    if (response !== null) {
      await this.say(target, response);
    }
  }

  private onJoin = (channel, username, self) => {
    if (self) return;
    Bot.logger.info(`${username} has joined...`);

    if (username !== 'unassociated') {
      //this.say(channel, `Hi ${username}, welcome! I'm your incredibly useful chat bot. Say '!help' to know what I can do.`);
    }
  };

  private onPart = (channel, username, self) => {
    if (self) return;
    Bot.logger.info(`${username} has left...`);
  };

  // Called every time the bot connects to Twitch chat
  private onConnected = (addr: any, port: any): void => {
    Bot.logger.info(`Connected to ${addr}:${port}`);
  }

  // static methods
  private static isCommand(msg: string, self: any, context: any): boolean {
    if (context['message-type'] !== 'chat') {
      return false;
    }
    if (self) {
      // ignore if command is from self
      return false;
    }
    if (!CommandHandler.isCommand(msg.trim())) {
      // ignore if it doesn't match the command format
      return false;
    }
    return true;
  }
}