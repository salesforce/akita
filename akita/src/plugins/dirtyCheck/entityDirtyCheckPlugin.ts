import { DirtyCheckComparator, dirtyCheckDefaultParams, DirtyCheckPlugin, DirtyCheckResetParams, getNestedPath } from './dirtyCheckPlugin';
import { EntityCollectionPlugin } from '../entityCollectionPlugin';
import { auditTime, map, skip } from 'rxjs/operators';
import { merge, Observable, Subject } from 'rxjs';
import { EntityState, OrArray, getIDType, getEntityType } from '../../types';
import { QueryEntity } from '../../queryEntity';
import { coerceArray } from '../../coerceArray';

export type DirtyCheckCollectionParams<State extends EntityState> = {
  comparator?: DirtyCheckComparator<getEntityType<State>>;
  entityIds?: OrArray<getIDType<State>>;
};

export class EntityDirtyCheckPlugin<State extends EntityState = any, P extends DirtyCheckPlugin<State> = DirtyCheckPlugin<State>> extends EntityCollectionPlugin<State, P> {
  private _someDirty = new Subject();
  someDirty$: Observable<boolean> = merge(this.query.select(state => state.entities), this._someDirty.asObservable()).pipe(
    auditTime(0),
    map(() => this.checkSomeDirty())
  );

  constructor(protected query: QueryEntity<State>, private readonly params: DirtyCheckCollectionParams<State> = {}) {
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

  setHead(ids?: OrArray<getIDType<State>>) {
    if (this.params.entityIds && ids) {
      const toArray = coerceArray(ids) as getIDType<State>[];
      const someAreWatched = coerceArray(this.params.entityIds).some(id => toArray.indexOf(id) > -1);
      if (someAreWatched === false) {
        return this;
      }
    }
    this.forEachId(ids, e => e.setHead());
    this._someDirty.next();
    return this;
  }

  hasHead(id: getIDType<State>): boolean {
    if (this.entities.has(id)) {
      const entity = this.getEntity(id);
      return entity.hasHead();
    }

    return false;
  }

  reset(ids?: OrArray<getIDType<State>>, params: DirtyCheckResetParams = {}) {
    this.forEachId(ids, e => e.reset(params));
  }

  isDirty(id: getIDType<State>): Observable<boolean>;
  isDirty(id: getIDType<State>, asObservable: true): Observable<boolean>;
  isDirty(id: getIDType<State>, asObservable: false): boolean;
  isDirty(id: getIDType<State>, asObservable = true): Observable<boolean> | boolean {
    if (this.entities.has(id)) {
      const entity = this.getEntity(id);
      return asObservable ? entity.isDirty$ : entity.isDirty();
    }

    return false;
  }

  someDirty(): boolean {
    return this.checkSomeDirty();
  }

  isPathDirty(id: getIDType<State>, path: string) {
    if (this.entities.has(id)) {
      const head = (this.getEntity(id) as any).getHead();
      const current = this.query.getEntity(id);
      const currentPathValue = getNestedPath(current, path);
      const headPathValue = getNestedPath(head, path);

      return this.params.comparator(currentPathValue, headPathValue);
    }

    return null;
  }

  destroy(ids?: OrArray<getIDType<State>>) {
    this.forEachId(ids, e => e.destroy());
    /** complete only when the plugin destroys */
    if (!ids) {
      this._someDirty.complete();
    }
  }

  protected instantiatePlugin(id: getIDType<State>): P {
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
