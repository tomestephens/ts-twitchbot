import { L } from '../logging';
import { Command } from './command';
import { CommandHandler } from './index';

export class HelpCommand extends Command {
  private static readonly logger = L.getLogger("HelpCommand");
  public static readonly cmd: string = '!help';

  public constructor() {
    super(HelpCommand.cmd);
  }

  public async respond(command: string): Promise<string> {
    return `Supported Commands: ${Object.keys(CommandHandler.handlers)}`;
  }
}
