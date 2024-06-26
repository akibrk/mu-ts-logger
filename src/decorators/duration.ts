import { Logger, LoggerConfig, LoggerService } from '../index';

/**
 * Prints out the amount of time a function takes to execute.
 *
 * In the case a function is async, or returns a Promise, the promise chain is
 * augmented to print out a logging statement, as the value is returned.
 *
 * For logging statements, this decorator will look for a 'logger' object
 * on the containing class of the function this decorator is associated to. If
 * one is found, it is used, otherwise a logger is created under the name
 * of the parent.
 *
 */
export function duration() {
  return (target: any, propertyKey: string | symbol, descriptor: PropertyDescriptor) => {
    const parent: string = target.constructor.name;
    const logConfig: LoggerConfig = { name: `${parent}.duration` };
    const decoratorLogger: Logger = LoggerService.named(logConfig);
    const method = descriptor.value;

    descriptor.value = function (...args: any[]) {
      decoratorLogger.start(`${String(propertyKey)}`);
      let result: any = method.apply(this, args);

      /**
       * Duck typing to check if the response is a promise. In the case a promise is returned we want
       * to know when the promise value is resolved.
       */
      if ((typeof result === 'function' || typeof result === 'object') && typeof result.then === 'function') {
        result = result.then((resolvedValue: any) => {
          decoratorLogger.stop(`${String(propertyKey)}`);
          return resolvedValue;
        });
      } else {
        decoratorLogger.stop(`${String(propertyKey)}`);
      }

      return result;
    };
    return descriptor;
  };
}
