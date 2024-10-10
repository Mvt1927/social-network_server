import _ from 'lodash';
import { FormatCallback } from '../types';

export function formatFieldsWithName<T extends object>(
  obj: T,
  keyName: string,
  callback: FormatCallback,
): T {
  _.each(obj, (value: any, key: string) => {
    if (key === keyName && _.isString(value)) {
      callback(value);
    } else if (_.isObject(value)) {
      formatFieldsWithName(value, keyName, callback);
    }
  });
  return obj;
}
