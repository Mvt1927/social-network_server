import _ from 'lodash';
import { FormatCallback } from '../types';
import validator from 'validator';

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

export function hideEmail(email: string): string {
  if (!email) return "";
  if (!validator.isEmail(email)) return "";

  const [name, domain] = email.split('@');

  return `${replaceStr(name)}@${replaceStr(domain)}`;
}

function replaceStr(str:string):string {
  if (str.length <= 2) {
    return str;
  }
  const dau = _.first(str);
  const cuoi = _.last(str);
  const giua = _.repeat('.', str.length - 2);
  return dau + giua + cuoi;
}