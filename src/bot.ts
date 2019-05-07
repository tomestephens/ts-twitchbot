import * as tmi from 'tmi.js';
import { L } from './logging';
import { CommandHandler } from './commands';

export class Bot {
  private static readonly logger = L.getLogger('bot');
  private client: tmi.Client;
  private username: string;
  private token: string;
  private channels: string[];
  private secret: string;
  private clientId: string;

  public constructor(username: string, token: string, channels: string[], secret?: string, clientId?: string) {
    this.username = username;
    this.token = token;
    this.channels = channels;

    // these aren't even needed for the functionality currently available in this bot
    this.secret = secret || '';
    this.clientId = clientId || '';
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
    if (!Bot.isCommand(msg, self)) {
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

  // Called every time the bot connects to Twitch chat
  private onConnected = (addr: any, port: any): void => {
    Bot.logger.info(`Connected to ${addr}:${port}`);
  }

  // static methods
  private static isCommand(msg: string, self: any): boolean {
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