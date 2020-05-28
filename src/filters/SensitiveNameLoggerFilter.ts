import { LoggerFilter } from '../index';
import { LoggerStatement } from '../interfaces/LoggerStatement';

/**
 * This logger filter is pesimistic because it does not attempt to check values
 * it just looks for 'hints' of wrong doing and redacts information aggressively
 * try to ensure no leak takes place.
 */
export class SensitiveNameLoggerFilter implements LoggerFilter {
  private readonly replaceValue: string = '>>> REDACTED <<<';
  private readonly dangerousFieldNames: string[] = [
    'credit card',
    'credit-card',
    'creditcard',
    'creditCard',
    'card number',
    'card-number',
    'cardnumber',
    'cardNumber',
    'credit card number',
    'credit-card-number',
    'creditcard-number',
    'credit-cardnumber',
    'creditcardnumber',
    'account number',
    'account-number',
    'accountnumber',
    'accountNumber',
    'bank account',
    'bank-account',
    'bankaccount',
    'bankAccount',
    'bank account number',
    'bank-account-number',
    'bank-accountnumber',
    'bankaccount-number',
    'bankaccountnumber',
    'routing number',
    'routing-number',
    'routingnumber',
    'routingNumber',
    'pass',
    'password',
    'secret',
    'shared secret',
    'shared-secret',
    'sharedsecret',
  ];

  /**
   *
   * @param statement to clean up.
   */
  public filter(statement: LoggerStatement): void {
    if (statement.data) statement.data = this.redact(statement.data);
  }

  private redact(data: any): any {
    if (!data) return;

    if (typeof data !== 'object' && this.isRedactable(String(data))) {
      /**
       * Look for a match, with a lower cased name, and with
       * the name having all special characters removed.
       */
      return this.replaceValue;
    }

    // iterate through the object properties
    const keys: string[] = Object.keys(data);
    keys.forEach((fieldName: string) => {
      const value: any = data[fieldName];
      if (!value) return;
      if (typeof value === 'object') {
        if (Array.isArray(value)) {
          data[fieldName] = value.map((arrayItem: any) => this.redact(arrayItem));
        } else {
          data[fieldName] = this.redact(value);
        }
      } else {
        if (this.isRedactable(fieldName)) {
          /**
           * Look for a match, with a lower cased name, and with
           * the name having all special characters removed.
           */
          data[fieldName] = this.replaceValue;
        }
      }
    });

    return data;
  }

  private isRedactable(fieldName: string): boolean {
    return this.dangerousFieldNames.includes(fieldName.toLocaleLowerCase()) ||
      this.dangerousFieldNames.includes(fieldName.replace(/[^\w\s]/gi, '').toLocaleLowerCase());
  }
}
