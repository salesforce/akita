import { QueryEntity } from '../api/query-entity';
import { Query } from '../api/query';
import { Observable } from 'rxjs';
import { filterNil } from '../api/operators';
import { toBoolean } from '../internal/utils';
import { ID } from '../api/types';
import { getAkitaConfig } from '../api/config';

export type Queries<E, S> = Query<S> | QueryEntity<S, E>;

export abstract class AkitaPlugin<E = any, S = any> {
  protected constructor(protected query: Queries<E, S>, config?: { resetFn?: Function }) {
    if (config && config.resetFn) {
      if (getAkitaConfig().resettable) {
        this.onReset(config.resetFn);
      }
    }
  }

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

    return this.getQuery().getValue();
  }

  /** This method is responsible for updating the store or one entity; it can be the whole store or one entity. */
  protected updateStore(newState, entityId?) {
    if (this.isEntityBased(entityId)) {
      this.getStore().update(entityId, newState);
    } else {
      this.getStore().setState(state => ({ ...state, ...newState }));
    }
  }

  /**
   * Function to invoke upon reset
   */
  private onReset(fn: Function) {
    const original = this.getStore().reset;
    this.getStore().reset = (...params) => {
      /** It should run after the plugin destroy method */
      setTimeout(() => {
        original.apply(this.getStore(), params);
        fn();
      });
    };
  }
}
