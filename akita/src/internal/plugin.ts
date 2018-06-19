import { QueryEntity } from '../api/query-entity';

export abstract class AkitaPlugin<E, S = any> {
  protected abstract getQuery(): QueryEntity<S, E>;

  getStore() {
    return this.getQuery().__store__;
  }
}
