import { QueryEntity } from '../api/query-entity';

export abstract class AkitaPlugin<E, S = any> {
  protected abstract getQuery(): QueryEntity<S, E>;
  public abstract destroy();

  getStore() {
    return this.getQuery().__store__;
  }
}
