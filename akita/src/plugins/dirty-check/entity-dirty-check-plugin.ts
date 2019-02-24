import { ID, IDS } from '../../api/types';
import { DirtyCheckComparator, dirtyCheckDefaultParams, DirtyCheckPlugin, DirtyCheckResetParams, getNestedPath } from './dirty-check-plugin';
import { QueryEntity } from '../../api/query-entity';
import { EntityCollectionPlugin } from '../entity-collection-plugin';
import { auditTime, map, skip } from 'rxjs/operators';
import { Observable } from 'rxjs';

export type DirtyCheckCollectionParams<E> = {
  comparator?: DirtyCheckComparator<E>;
  entityIds?: ID | ID[];
};

export class EntityDirtyCheckPlugin<E, P extends DirtyCheckPlugin<E, any> = DirtyCheckPlugin<E, any>> extends EntityCollectionPlugin<E, P> {
  someDirty$: Observable<boolean> = this.query.select(state => state.entities).pipe(
    auditTime(0),
    map(() => this.checkSomeDirty())
  );

  constructor(protected query: QueryEntity<any, E>, private readonly params: DirtyCheckCollectionParams<E> = {}) {
    super(query, params.entityIds);
    this.params = { ...dirtyCheckDefaultParams, ...params };
    this.activate();
    this.selectIds()
      .pipe(skip(1))
      .subscribe(ids => {
        super.rebase(ids, { afterAdd: plugin => plugin.setHead() });
      });
  }

  setHead(ids?: IDS) {
    this.forEachId(ids, e => e.setHead());
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
