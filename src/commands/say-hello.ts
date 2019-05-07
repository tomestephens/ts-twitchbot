import { L } from '../logging';
import { Command } from './command';

export class SayHelloCommand extends Command {
  private static readonly logger = L.getLogger("SayHelloCommand");

  public constructor() {
    super('!hello');
  }

  // allow a command like '!hello <user>'
  // pretty basic, only allows one hello right now.
  public async respond(command: string): Promise<string> {
    try {
      SayHelloCommand.logger.debug(`Handling: ${command}`);
      const targets = command.split(' ');
      if(targets.length > 1)
        return `Hello ${targets[1]}!`;
    } catch (err) {
      SayHelloCommand.logger.error(`Error saying hello... what could have failed????`, err);
    }
    // always fall back on something?
    return "Hello!";
  }
}
