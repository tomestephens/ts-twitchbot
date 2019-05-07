import { Category, CategoryServiceFactory, CategoryConfiguration, LogLevel } from 'typescript-logging';

CategoryServiceFactory.setDefaultConfiguration(new CategoryConfiguration(LogLevel.Info));

export class L {
  private static loggers: { [name: string] : Category; } = {
    'app': new Category('app') // just make sure we always have this available
  };

  public static getLogger(loggerName: string, parent?: string): Category {
    let l = this.loggers[loggerName];
    if (l !== undefined) return l;

    parent = parent !== null ? parent : 'app';
    let p = this.loggers[loggerName];

    l = new Category(loggerName, p);
    this.loggers[loggerName] = l;
    return l;
  }
}

