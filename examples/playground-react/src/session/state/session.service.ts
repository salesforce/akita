import { SessionStore, sessionStore } from './session.store';

export class SessionService {

  constructor( private sessionStore: SessionStore ) {
  }

  login() {
    this.sessionStore.update({ token: 'JWT' });
  }

  logout() {
    this.sessionStore.update({ token: null });
  }

}

export const sessionService = new SessionService(sessionStore);