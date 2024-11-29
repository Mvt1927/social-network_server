export const USERNAME_REGEX = /^[a-zA-Z0-9]+([._]?[a-zA-Z0-9]+)*$/;
export const USERNAME_ERROR_MESSAGE = ` should have only letters, numbers, dots or underscores`;

export const PASSWORD_REGEX =
  /((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/;
export const PASSWORD_ERROR_MESSAGE = ` should have minimum 8 characters, at least one uppercase letter and a number or special character`;