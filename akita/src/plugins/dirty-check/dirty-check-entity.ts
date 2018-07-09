import { ID, IDS } from '../../api/types';
import { DirtyCheck, DirtyCheckComparator, dirtyCheckDefaultParams, DirtyCheckResetParams } from './dirty-check';
import { QueryEntity } from '../../api/query-entity';
import { EntityCollectionPlugin } from '../entity-collection-plugin';
import { skip } from 'rxjs/operators';

export type DirtyCheckCollectionParams = {
  comparator?: DirtyCheckComparator;
  entityIds?: ID | ID[];
};

export class DirtyCheckEntity<E, P extends DirtyCheck<E, any> = DirtyCheck<E, any>> extends EntityCollectionPlugin<E, P> {
  constructor(protected query: QueryEntity<any, E>, private readonly params: DirtyCheckCollectionParams = {}) {
    super(query, params.entityIds);
    this.params = { ...dirtyCheckDefaultParams, ...params };
    this.activate();
    this.selectIds()
      .pipe(skip(1))
      .subscribe(ids => this.activate(ids));
  }

  setHead(ids?: IDS) {
    this.forEachId(ids, e => e.setHead());
  }

  reset(ids?: IDS, params: DirtyCheckResetParams = {}) {
    this.forEachId(ids, e => e.reset(params));
  }

  isDirty(id: ID) {
    if (this.entities.has(id)) {
      return this.getEntity(id).isDirty$;
    }
  }

  destroy(ids?: IDS) {
    this.forEachId(ids, e => e.destroy());
  }

  protected instantiatePlugin(id: ID): P {
    return new DirtyCheck(this.query, this.params, id) as P;
  }
}
