import { QueryEntity } from '../queryEntity';
import { Query } from '../query';
import { filterNil } from '../filterNil';
import { toBoolean } from '../toBoolean';
import { getAkitaConfig } from '../config';
import { getValue } from '../getValueByString';
import { setValue } from '../setValueByString';

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
  protected selectSource(entityId: any, property?: string) {
    if (this.isEntityBased(entityId)) {
      return (this.getQuery() as QueryEntity<State>).selectEntity(entityId).pipe(filterNil);
    }

    if (property) {
      return this.getQuery().select(state => getValue(state, this.withStoreName(property)));
    }

    return this.getQuery().select();
  }

  protected getSource(entityId: any, property?: string): any {
    if (this.isEntityBased(entityId)) {
      return (this.getQuery() as QueryEntity<State>).getEntity(entityId);
    }

    const state = this.getQuery().getValue();

    if (property) {
      return getValue(state, this.withStoreName(property));
    }

    return state;
  }

  protected withStoreName(prop: string) {
    return `${this.storeName}.${prop}`;
  }

  protected get storeName() {
    return this.getStore().storeName;
  }

  /** This method is responsible for updating the store or one entity; it can be the whole store or one entity. */
  protected updateStore(newState, entityId?, property?: string) {
    if (this.isEntityBased(entityId)) {
      this.getStore().update(entityId, newState);
    } else {
      if (property) {
        this.getStore()._setState(state => {
          return setValue(state, this.withStoreName(property), newState);
        });
        return;
      }
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
