import { ID, IDS } from '../../api/types';
import { DirtyCheckPlugin, DirtyCheckComparator, dirtyCheckDefaultParams, DirtyCheckResetParams } from './dirty-check-plugin';
import { QueryEntity } from '../../api/query-entity';
import { EntityCollectionPlugin } from '../entity-collection-plugin';
import { skip, map } from 'rxjs/operators';
import { Observable } from 'rxjs';

export type DirtyCheckCollectionParams<E> = {
  comparator?: DirtyCheckComparator<E>;
  entityIds?: ID | ID[];
};

export class EntityDirtyCheckPlugin<E, P extends DirtyCheckPlugin<E, any> = DirtyCheckPlugin<E, any>> extends EntityCollectionPlugin<E, P> {
  constructor(protected query: QueryEntity<any, E>, private readonly params: DirtyCheckCollectionParams<E> = {}) {
    super(query, params.entityIds);
    this.params = { ...dirtyCheckDefaultParams, ...params };
    this.activate();
    this.selectIds()
      .pipe(skip(1))
      .subscribe(ids => this.activate(ids));
  }

  setHead(ids?: IDS) {
    this.forEachId(ids, e => e.setHead());
    return this;
  }

  reset(ids?: IDS, params: DirtyCheckResetParams = {}) {
    this.forEachId(ids, e => e.reset(params));
  }

  isDirty(id: ID) {
    if (this.entities.has(id)) {
      return this.getEntity(id).isDirty$;
    }
  }

  isSomeDirty() {
    return this.query.select(state => state.entities).pipe(
      map(entities => {
        const entitiesIds = this.resolvedIds();
        for (const id of entitiesIds) {
          const dirty = this.params.comparator((this.getEntity(id) as any).getHead(), entities[id]);
          if (dirty) {
            return true;
          }
        }
        return false;
      })
    );
  }

  destroy(ids?: IDS) {
    this.forEachId(ids, e => e.destroy());
  }

  protected instantiatePlugin(id: ID): P {
    return new DirtyCheckPlugin(this.query, this.params, id) as P;
  }
}
