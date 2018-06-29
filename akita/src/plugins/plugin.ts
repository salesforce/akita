import { QueryEntity } from '../api/query-entity';
import { Query } from '../api/query';

export abstract class AkitaPlugin<E = any, S = any> {
  protected abstract getQuery(): QueryEntity<S, E> | Query<S>;
  public abstract destroy();

  protected getStore() {
    return this.getQuery().__store__;
  }
}
