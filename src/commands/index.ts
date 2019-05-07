import { L } from '../logging';
import { Command } from './command';
import { SayHelloCommand } from './say-hello';
import { DiceCommand } from './dice';
import { HelpCommand } from './help';


export class CommandHandler {
  private static readonly logger = L.getLogger('CommandHandler');
  // just looking for ! followed by some word characters
  // intentionally don't do a global search -- could add weird behavior to support multiple commands on one line?
  private static readonly COMMAND_FORMAT: RegExp = new RegExp('!\\w+');

  // make sure you initialize any new commands here, otherwise they won't work
  public static readonly handlers: { [command: string] : Command; } = {
    '!hello': new SayHelloCommand(),
    '!dice': new DiceCommand(),
    '!help': new HelpCommand()
  };

  public static isCommand(command: string) {
    return this.COMMAND_FORMAT.test(command);
  }

  public static async handle(command: string): Promise<string> {
    const c = this.COMMAND_FORMAT.exec(command);

    if (c !== null) {
      // since we aren't doing a global search only one command
      const h = this.handlers[c[0]];
      if (h !== undefined) { // we have a handler for this command
        return await h.respond(command);
      }
      // matches the command structure but not something we support
      CommandHandler.logger.info(`User tried ${command} -- support doesn't exist.`)
    }

    return null;
  }
}

