"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typescript_logging_1 = require("typescript-logging");
typescript_logging_1.CategoryServiceFactory.setDefaultConfiguration(new typescript_logging_1.CategoryConfiguration(typescript_logging_1.LogLevel.Info));
class L {
    static getLogger(loggerName, parent) {
        let l = this.loggers[loggerName];
        if (l !== undefined)
            return l;
        parent = parent !== null ? parent : 'app';
        let p = this.loggers[loggerName];
        l = new typescript_logging_1.Category(loggerName, p);
        this.loggers[loggerName] = l;
        return l;
    }
}
L.loggers = {
    'app': new typescript_logging_1.Category('app') // just make sure we always have this available
};
exports.L = L;
//# sourceMappingURL=logging.js.map