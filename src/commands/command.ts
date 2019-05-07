export abstract class Command {
  public readonly command: string;

  public constructor(command) {
    this.command = command;
  }

  // having this pass in the whole msg, in case we want to use the extra data
  public abstract async respond(command: string): Promise<string>;
}