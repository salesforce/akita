import { coerceArray, isFunction, isUndefined, toBoolean } from '../internal/utils';
import { QueryEntity } from '../api/query-entity';
import { ID, IDS } from '../api/types';

/**
 * Each plugin that supports entities should extends this interface
 */
export type EntityParam = ID;

export type EntityCollectionParams = ID | ID[];

export abstract class EntityCollectionPlugin<E, P> {
  protected entities = new Map<ID, P>();

  protected constructor(protected query: QueryEntity<any, E>, private entityIds: EntityCollectionParams) {}

  /**
   * Get the entity plugin instance.
   */
  protected getEntity(id: ID) {
    return this.entities.get(id);
  }

  /**
   * Whether the entity plugin exist.
   */
  protected hasEntity(id: ID) {
    return this.entities.has(id);
  }

  /**
   * Remove the entity plugin instance.
   */
  protected removeEntity(id: ID) {
    return this.entities.delete(id);
  }

  /**
   * Set the entity plugin instance.
   */
  protected createEntity(id: ID, plugin: P) {
    return this.entities.set(id, plugin);
  }

  /**
   * If the user pass `entityIds` we take them, otherwise we take all of them.
   */
  protected getIds() {
    return isUndefined(this.entityIds) ? this.query.getSnapshot().ids : coerceArray(this.entityIds);
  }

  /**
   * When you call one of the plugin method you can pass id/ids or undefined which means all.
   */
  protected resolvedIds(ids) {
    return isUndefined(ids) ? this.getIds() : coerceArray(ids);
  }

  /**
   * This method is for activate the plugin on init or when you need to listen to
   * dynamic add/remove of entities
   *
   * For example in your plugin you may do the following:
   *
   * this.query.select(state => state.ids).pipe(skip(1)).subscribe(ids => this.activate(ids));
   */
  protected rebase(ids: ID[], beforeRemove?: Function, beforeAdd?: Function) {
    /**
     *
     * If we the user pass `entityIds` & we have new ids
     * Check if we need to add/remove instances
     *
     * This phase will be called only upon update
     */
    if (toBoolean(ids)) {
      /**
       * Which means all of them
       */
      if (isUndefined(this.entityIds)) {
        for (let i = 0, len = ids.length; i < len; i++) {
          const entityId = ids[i];
          if (this.hasEntity(entityId) === false) {
            isFunction(beforeAdd) && beforeAdd(entityId);
            this.entities.set(entityId, this.instantiatePlugin(entityId));
          }
        }

        this.entities.forEach((plugin, entityId) => {
          if (ids.indexOf(entityId) === -1) {
            isFunction(beforeRemove) && beforeRemove(plugin);
            this.removeEntity(entityId);
          }
        });
      } else {
        /**
         * Which means the user pass specific ids
         */
        const _ids = coerceArray(this.entityIds);
        for (let i = 0, len = _ids.length; i < len; i++) {
          const entityId = _ids[i];
          /** Entity in current ids and doesn't exist, add it */
          if (ids.indexOf(entityId) > -1 && this.hasEntity(entityId) === false) {
            isFunction(beforeAdd) && beforeAdd(entityId);
            this.entities.set(entityId, this.instantiatePlugin(entityId));
          } else {
            this.entities.forEach((plugin, entityId) => {
              /** Entity not in current ids and exists, remove it */
              if (ids.indexOf(entityId) === -1 && this.hasEntity(entityId) === true) {
                isFunction(beforeRemove) && beforeRemove(plugin);
                this.removeEntity(entityId);
              }
            });
          }
        }
      }
    } else {
      /**
       * Otherwise start with the provided ids or all.
       */
      this.getIds().forEach(id => this.createEntity(id, this.instantiatePlugin(id)));
    }
  }

  /**
   * Listen for add/remove entity change and rebase
   */
  protected selectIds() {
    return this.query.select(state => state.ids);
  }

  /**
   * Base method for activation, you can override it if you need
   */
  protected activate(ids?: ID[]) {
    this.rebase(ids, plugin => plugin.destroy());
  }

  /**
   * This method is responsible for plugin instantiation.
   * For example:
   *
   *  return new StateHistory(this.query, Object.assign({}, this.params, { _entityId: id })) as P;
   */
  protected abstract instantiatePlugin(id: ID): P;

  /**
   * This method is responsible for any cleaning.
   */
  public abstract destroy(id?: ID);

  /**
   * Loop over each id and invoke the plugin method
   */
  protected forEachId(ids: IDS, cb: (entity: P) => any) {
    const _ids = this.resolvedIds(ids);

    for (let i = 0, len = _ids.length; i < len; i++) {
      const id = _ids[i];
      if (this.hasEntity(id)) {
        cb(this.getEntity(id));
      }
    }
  }
}
