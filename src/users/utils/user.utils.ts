import { UserWithPartialHiddenAttributes } from "../types";


export const test: UserWithPartialHiddenAttributes = {
  email: 'test',
  // hash: 'test',
  id: 'test',
  // salt: 'test',
  username: 'test',
  createAt: new Date(),
  updateAt: new Date(),
  fullname: 'test',
}