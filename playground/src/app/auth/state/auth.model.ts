import { ID } from '../../../../../akita/src';

export type Creds = {
  email: string;
  password: string;
};

export type User = {
  id: ID;
  firstName: string;
  lastName: string;
  token: string;
};

export function createEmptyUser() {
  return {
    id: null,
    firstName: '',
    lastName: '',
    token: ''
  } as User;
}
