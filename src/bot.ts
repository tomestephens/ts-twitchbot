import * as tmi from 'tmi.js';
import { L } from './logging';
import { CommandHandler } from './commands';
import { NotificationHandler } from './notifications';

const player = require('node-wav-player');

export class Bot {
  private static readonly logger = L.getLogger('bot');
  private client: tmi.Client;
  private username: string;
  private token: string;
  private channels: string[];
  private secret: string;
  private clientId: string;
  private notifier: NotificationHandler;

  public constructor(username: string, token: string, channels: string[], secret?: string, clientId?: string, notifications?:[any] ) {
    this.username = username;
    this.token = token;
    this.channels = channels;

    // these aren't even needed for the functionality currently available in this bot
    this.secret = secret || '';
    this.clientId = clientId || '';

    this.notifier = new NotificationHandler(notifications);
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
    // not a chat message OR is sent by the bot
    if (context['message-type'] !== 'chat' || self) {
      Bot.logger.debug(`Message is not relevant to the bot`);
      return;
    }

    this.notifier.notify("on_message");

    if(!CommandHandler.isCommand(msg.trim())) {
      Bot.logger.debug(`Incoming command: ${target} :: ${msg} :: ${context}`);
      const response = await CommandHandler.handle(msg.trim());

      if (response !== null) {
        await this.say(target, response);
      }
    }
  }

  private onJoin = (channel, username, self) => {
    if (self) return;
    Bot.logger.info(`${username} has joined...`);

    this.notifier.notify("on_join");

    this.say(channel, `Hi ${username}, welcome! I'm your incredibly useful chat bot. Say '!help' to know what I can do.`);
  };

  private onPart = (channel, username, self) => {
    if (self) return;
    Bot.logger.info(`${username} has left...`);
    this.notifier.notify("on_leave");
  };

  // Called every time the bot connects to Twitch chat
  private onConnected = (addr: any, port: any): void => {
    Bot.logger.info(`Connected to ${addr}:${port}`);
  }
}