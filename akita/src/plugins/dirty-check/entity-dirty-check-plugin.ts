import { ID, IDS } from '../../api/types';
import { DirtyCheckComparator, dirtyCheckDefaultParams, DirtyCheckPlugin, DirtyCheckResetParams, getNestedPath } from './dirty-check-plugin';
import { QueryEntity } from '../../api/query-entity';
import { EntityCollectionPlugin } from '../entity-collection-plugin';
import { auditTime, map, skip, tap } from 'rxjs/operators';
import { merge, Observable, Subject } from 'rxjs';
import { coerceArray } from '../..';

export type DirtyCheckCollectionParams<E> = {
  comparator?: DirtyCheckComparator<E>;
  entityIds?: IDS;
};

export class EntityDirtyCheckPlugin<E, P extends DirtyCheckPlugin<E, any> = DirtyCheckPlugin<E, any>> extends EntityCollectionPlugin<E, P> {
  // private _isSomeDirty = false;
  private _someDirtyTrigger = new Subject();
  someDirty$: Observable<boolean> = merge(this.query.select(state => state.entities), this._someDirtyTrigger.asObservable()).pipe(
    auditTime(0),
    // tap(() => this._isSomeDirty = this.checkSomeDirty()),
    // map(() => this._isSomeDirty)
    map(() => this.checkSomeDirty())
  );

  constructor(protected query: QueryEntity<any, E>, private readonly params: DirtyCheckCollectionParams<E> = {}) {
    // TODO why not use entityIds as array from the start? we keep using coerceArray
    super(query, params.entityIds);
    this.params = { ...dirtyCheckDefaultParams, ...params };
    // TODO lazy activate?
    this.activate();
    this.selectIds()
      .pipe(skip(1))
      .subscribe(ids => {
        super.rebase(ids, { afterAdd: plugin => plugin.setHead() });
      });
  }

  setHead(ids?: IDS) {
    // TODO should this be executed if the plugin isn't dirty?
    // if (this._isSomeDirty) {
    //   let ids2 = ids;
    // TODO if ids are passed, check that at least one is matching the tracked ids
    // if (this.params.entityIds && ids2) {
    //   ids2 = coerceArray(ids2);
    //   if (!coerceArray(this.params.entityIds).some(id => (ids2 as ID[]).indexOf(id) > -1)) {
    //     return this;
    //   }
    // }
    this.forEachId(ids, e => e.setHead());
    this._someDirtyTrigger.next();
    // }

    return this;
  }

  hasHead(id: ID): boolean {
    if (this.entities.has(id)) {
      const entity = this.getEntity(id);
      return entity.hasHead();
    }

    return false;
  }

  reset(ids?: IDS, params: DirtyCheckResetParams = {}) {
    this.forEachId(ids, e => e.reset(params));
  }

  isDirty(id: ID): Observable<boolean>;
  isDirty(id: ID, asObservable: true): Observable<boolean>;
  isDirty(id: ID, asObservable: false): boolean;
  isDirty(id: ID, asObservable = true): Observable<boolean> | boolean {
    if (this.entities.has(id)) {
      const entity = this.getEntity(id);
      return asObservable ? entity.isDirty$ : entity.isDirty();
    }

    return false;
  }

  someDirty(): boolean {
    // return this._isSomeDirty;
    return this.checkSomeDirty();
  }

  isPathDirty(id: ID, path: string) {
    if (this.entities.has(id)) {
      const head = (this.getEntity(id) as any).getHead();
      const current = this.query.getEntity(id);
      const currentPathValue = getNestedPath(current, path);
      const headPathValue = getNestedPath(head, path);

      return this.params.comparator(currentPathValue, headPathValue);
    }

    return null;
  }

  destroy(ids?: IDS) {
    this.forEachId(ids, e => e.destroy());
    /** complete only when the plugin destroys */
    if (!ids) {
      this._someDirtyTrigger.complete();
    }
  }

  protected instantiatePlugin(id: ID): P {
    return new DirtyCheckPlugin(this.query, this.params, id) as P;
  }

  private checkSomeDirty(): boolean {
    const entitiesIds = this.resolvedIds();
    for (const id of entitiesIds) {
      if (this.getEntity(id).isDirty()) {
        return true;
      }
    }
    return false;
  }
}
