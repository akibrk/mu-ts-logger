import { Logger, LoggerConfig, LoggerService, LogLevelString } from '../index';

/**
 * Adds input and output 'debug' statements for a function when it is executed. Uses
 * either the logger provided, or uses a logger under the name provided.
 *
 * For logging statements, this decorator will look for a 'logger' object
 * on the containing class of the function this decorator is associated to. If
 * one is found, it is used, otherwise a logger is created under the name
 * of the parent.
 *
 * @param config of this inOut logging statement.
 */
export function inOut(config?: { atLevel?: LogLevelString }) {
  return (target: any, propertyKey: string | symbol, descriptor: PropertyDescriptor) => {
    const parent: string = target.constructor.name;
    const atLevel: LogLevelString = (config ? config.atLevel : undefined) || 'debug';
    const logConfig: LoggerConfig = { name: `${parent}.inOut` };
    const decoratorLogger: Logger = LoggerService.named(logConfig);
    const method = descriptor.value;

    descriptor.value = function (...args: any[]) {
      decoratorLogger.log(atLevel, {
        func: `${String(propertyKey)}()`,
        clazz: parent,
        msg: 'inOut -->',
        args,
      });

      const result: unknown = method.apply(this, args);

      if ((typeof result === 'function' || typeof result === 'object') && typeof (result as Promise<unknown>).then === 'function') {
        decoratorLogger.log(atLevel, {
          func: `${String(propertyKey)}()`,
          clazz: parent,
          msg: 'inOut -- promisified function',
          result,
        });

        const newPromise: Promise<any> = new Promise((resolve, reject) => {
          (result as Promise<unknown>).then((resolvedValue: any) => {
              decoratorLogger.log(atLevel, {
                func: `${String(propertyKey)}()`,
                clazz: parent,
                msg: 'inOut <--',
                result: resolvedValue,
              });
              resolve(resolvedValue);
            })
            .catch(reject);
        });

        return newPromise;
      }
      decoratorLogger.log(atLevel, {
        func: `${String(propertyKey)}()`,
        clazz: parent,
        msg: 'inOut <--',
        result,
      });
      return result;
    };

    return descriptor;
  };
}
