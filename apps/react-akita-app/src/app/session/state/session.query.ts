import { SessionState, SessionStore, sessionStore } from './session.store';
import { Query } from '@datorama/akita';

export class SessionQuery extends Query<SessionState> {
  selectIsLoggedIn$ = this.select(state => !!state.token);

  constructor(protected store: SessionStore) {
    super(store);
  }

  isLoggedIn() {
    return !!this.getValue().token;
  }
}

export const sessionQuery = new SessionQuery(sessionStore);
