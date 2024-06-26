import { LogLevelString } from '../index';

export interface LoggerStatement {
  name: string;
  at: Date;
  level: LogLevelString;
  clazz?: string;
  func?: string;
  msg?: string;
  err?: Error;
  errs?: Error[];
  data?: Record<string, unknown>;
}
