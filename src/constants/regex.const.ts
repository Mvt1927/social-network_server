// Regex for version number
// Version number can be in format:
// v1.0.0
// v1.0.0-alpha.1,
// v1.0,
// 1.0.0,
// 1.0.0-alpha.1,
// 1,
// v1
// 1.0
// fisrt character can be v or number
// version number can have multiple dot and dash
export const VERSION_REGEX = /(?<=v?)(\d+)(\.\d+)*(-[a-zA-Z0-9]+(\.\d+)*)?/;

// Regex for password
// passwoed should have minimum 8 characters
// password should has at least one uppercase letter and a number or special character
export const PASSWORD_REGEX =
  /((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/;
export const PASSWORD_ERROR_MESSAGE = ` should have minimum 8 characters, at least one uppercase letter and a number or special character`;

// Regex for name
// name should  has only letters, numbers, spaces, apostrophes, dots and dashes
export const NAME_REGEX = /(^[\p{L}\d'\.\s\-]*$)/u;
export const NAME_ERROR_MESSAGE = ` should have only letters, numbers, spaces, apostrophes, dots and dashes`;

// Regex for Slug
// checks if a string is a valid slug, useful for usernames
export const SLUG_REGEX = /^[a-z\d]+(?:(\.|-|_)[a-z\d]+)*$/;
export const SLUG_ERROR_MESSAGE = ` should have only lowercase letters, numbers, dots, dashes or underscores`;
