export class Logger {
    private prefix: string;
    private enable?: boolean;

    constructor(prefix: string, enable: boolean = false) {
        this.prefix = prefix;
        this.enable = enable;
    }

    private formatMessage(level: string, message: string): string {
        const timestamp = new Date().toISOString();
        return `[${timestamp}] [${this.prefix}] ${level}: ${message}`;
    }

    info(message: string): void {
        if (this.enable) {
            console.log(`\x1b[36m${this.formatMessage('INFO', message)}\x1b[0m`);
        }
    }

    warn(message: string): void {
        if (this.enable) {
            console.warn(`\x1b[33m${this.formatMessage('WARN', message)}\x1b[0m`);
        }
    }

    error(message: string): void {
        if (this.enable) {
            console.error(`\x1b[31m${this.formatMessage('ERROR', message)}\x1b[0m`);
        }
    }

    debug(message: string): void {
        if (this.enable) {
            console.debug(`\x1b[90m${this.formatMessage('DEBUG', message)}\x1b[0m`);
        }
    }

    success(message: string): void {
        if (this.enable) {
            console.log(`\x1b[32m${this.formatMessage('SUCCESS', message)}\x1b[0m`);
        }
    }
}