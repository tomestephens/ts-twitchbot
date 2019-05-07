import { L } from '../logging';
import { Command } from './command';

export class DiceCommand extends Command {
  private static readonly logger = L.getLogger("DiceCommand");

  public constructor() {
    super('!dice');
  }

  // allow for rolling a dice with a specified number of sides
  // e.g. !dice d100
  public async respond(command: string): Promise<string> {
    try {
      DiceCommand.logger.debug(`Handling: ${command}`);
      const targets = command.split(' ');
      let sides = 6;

      // this could fail in a few weird ways... meh
      if(targets.length > 1 && targets[1].startsWith('d')) {
        sides = parseInt(targets[1].substring(1));
      }

      return `You rolled a ${this.rollDice(sides)}!`;
    } catch (err) {
      DiceCommand.logger.error(`Error rolling dice... what could have failed????`, err);
    }
    // always fall back on something?
    return "I think the die went off the table! Try again like '!dice d12'";
  }

  // Function called when the "dice" command is issued
  private rollDice (sides: number): number {
    DiceCommand.logger.debug(`Performing a dice roll`);
    return Math.floor(Math.random() * sides) + 1;
  }
}
