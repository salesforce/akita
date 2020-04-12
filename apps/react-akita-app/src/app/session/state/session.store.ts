import { Store, StoreConfig } from '@datorama/akita';

export interface SessionState {
  token: string;
}

export function createInitialState(): SessionState {
  return {
    token: ''
  };
}

@StoreConfig({ name: 'session' })
export class SessionStore extends Store<SessionState> {
  constructor() {
    super(createInitialState());
  }
}

export const sessionStore = new SessionStore();
