import { QueryEntity } from '../queryEntity';
import { Query } from '../query';
import { filterNil } from '../filterNil';
import { toBoolean } from '../toBoolean';
import { getAkitaConfig } from '../config';

export type Queries<State> = Query<State> | QueryEntity<State>;

export abstract class AkitaPlugin<State = any> {
  protected constructor(protected query: Queries<State>, config?: { resetFn?: Function }) {
    if (config && config.resetFn) {
      if (getAkitaConfig().resettable) {
        this.onReset(config.resetFn);
      }
    }
  }

  /** This method is responsible for getting access to the query. */
  protected getQuery() {
    return this.query;
  }

  /** This method is responsible for getting access to the store. */
  protected getStore() {
    return this.getQuery().__store__;
  }

  /** This method is responsible for cleaning. */
  public abstract destroy();

  /** This method is responsible tells whether the plugin is entityBased or not.  */
  protected isEntityBased(entityId: any) {
    return toBoolean(entityId);
  }

  /** This method is responsible for selecting the source; it can be the whole store or one entity. */
  protected selectSource(entityId: any) {
    if (this.isEntityBased(entityId)) {
      return (this.getQuery() as QueryEntity<State>).selectEntity(entityId).pipe(filterNil);
    }

    return (this.getQuery() as Query<State>).select(state => state);
  }

  protected getSource(entityId: any): any {
    if (this.isEntityBased(entityId)) {
      return (this.getQuery() as QueryEntity<State>).getEntity(entityId);
    }

    return this.getQuery().getValue();
  }

  /** This method is responsible for updating the store or one entity; it can be the whole store or one entity. */
  protected updateStore(newState, entityId?) {
    if (this.isEntityBased(entityId)) {
      this.getStore().update(entityId, newState);
    } else {
      this.getStore()._setState(state => ({ ...state, ...newState }));
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
