import { ConsoleLogger, Injectable } from '@nestjs/common';
import { ConfigurationService } from './config.service';

@Injectable()
export class LoggerService {
    
    private logger = new ConsoleLogger(LoggerService.name)
  
    constructor(
        private readonly config: ConfigurationService,
    ) {
        this.logger.warn(this.config.get('isProduction') ? 'Production mode' : 'Development mode')
        this.logger.warn(`Orchestrator-Service Running at port ${this.config.get('port')}`)
    }

    static create (name: string): LoggerTypes {
        const util = require('util')
        const newLogger = new ConsoleLogger(name)
        const config = new ConfigurationService()
        const functions = {
            print: (...payload: any): any => {
                if(!config.get('isProduction')){
                    newLogger.log(util.inspect(payload, {showHidden: false, depth: null, colors: true}))
                }
            },
            errPrint: (...payload: any): any => {
                newLogger.error(util.inspect(payload, {showHidden: false, depth: null, colors: true}))
            },
            log(...payload: any): any {
                newLogger.log(util.inspect(payload, {showHidden: false, depth: null, colors: true}))
            }
        }
        return functions
    }
  
}

export type LoggerTypes = {
    /** Will not appear on production, use log if needed on production instead */
    print(...toPrint: any): Function;
    errPrint(...toPrint: any): Function;
    log(...toPrint: any): Function;
}
