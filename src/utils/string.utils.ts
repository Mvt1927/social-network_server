// Func extract version value from string
// Like v1.0.0-alpha.1 -> 1
// Like v1.0 -> 1

import { VERSION_REGEX } from 'src/constants';

export const extractVersionValue = (version: string): number => {
  const versionValue = version.match(VERSION_REGEX);
  return versionValue ? parseInt(versionValue[0]) : 1;
};

export const generateNumberCode = (length: number): string => {
  return Math.floor(Math.random() * Math.pow(10, length)).toString().padStart(length, '0');
}