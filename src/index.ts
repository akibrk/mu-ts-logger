import { Logger } from './Logger';
import { LogLevelString } from './LogLevelString';
import { LoggerService } from './LoggerService';

export { Logger, LoggerService, LogLevelString };

LoggerService.defaultLogger().info(
  {
    memory: process.env['AWS_LAMBDA_FUNCTION_MEMORY_SIZE'],
    version: process.env['AWS_LAMBDA_FUNCTION_VERSION'],
    region: process.env['AWS_REGION'],
    runtime: process.env['AWS_LAMBDA_RUNTIME_API'],
    handler: process.env['_HANDLER'],
  },
  'init'
);
