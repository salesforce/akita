import { QueryEntity } from '../api/query-entity';
import { Query } from '../api/query';
import { Observable } from 'rxjs';
import { filterNil } from '../api/operators';
import { toBoolean } from '../internal/utils';
import { ID } from '../api/types';

export type Queries<E, S> = Query<S> | QueryEntity<S, E>;

export abstract class AkitaPlugin<E = any, S = any> {
  protected constructor(protected query: Queries<E, S>) {}

  /** This method is responsible for getting access to the query. */
  protected getQuery(): Queries<E, S> {
    return this.query;
  }

  /** This method is responsible for getting access to the store. */
  protected getStore() {
    return this.getQuery().__store__;
  }

  /** This method is responsible for cleaning. */
  public abstract destroy();

  /** This method is responsible tells whether the plugin is entityBased or not.  */
  protected isEntityBased(entityId: ID) {
    return toBoolean(entityId);
  }

  /** This method is responsible for selecting the source; it can be the whole store or one entity. */
  protected selectSource(entityId: ID): Observable<S | E> {
    if (this.isEntityBased(entityId)) {
      return (this.getQuery() as QueryEntity<S, E>).selectEntity(entityId).pipe(filterNil);
    }

    return (this.getQuery() as Query<S>).select(state => state);
  }

  protected getSource(entityId: ID): S | E {
    if (this.isEntityBased(entityId)) {
      return (this.getQuery() as QueryEntity<S, E>).getEntity(entityId);
    }

    return this.getQuery().getSnapshot();
  }

  /** This method is responsible for updating the store or one entity; it can be the whole store or one entity. */
  protected updateStore(newState, entityId?) {
    if (this.isEntityBased(entityId)) {
      this.getStore().update(entityId, newState);
    } else {
      this.getStore().setState((state) => ({...state, ...newState}));
    }
  }
}
