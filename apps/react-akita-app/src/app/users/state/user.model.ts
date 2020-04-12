import { ID } from '@datorama/akita';

export interface User {
  id: ID;
  username: string;
  email: string;
  avatar: string;
}
