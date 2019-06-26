import { EntityState, OrArray } from '../../types';
import { QueryEntity } from '../../queryEntity';
import { StateHistoryParams, StateHistoryPlugin } from './stateHistoryPlugin';
import { toBoolean } from '../../toBoolean';
import { skip } from 'rxjs/operators';
import { EntityCollectionPlugin } from '../entityCollectionPlugin';

export interface StateHistoryEntityParams<IDType> extends StateHistoryParams {
  entityIds?: OrArray<IDType>;
}

export class EntityStateHistoryPlugin<State extends EntityState = any, P extends StateHistoryPlugin<State> = StateHistoryPlugin<State>> extends EntityCollectionPlugin<State, P> {
  constructor(protected query: QueryEntity<State>, protected readonly params: StateHistoryEntityParams<State['ids'][0]> = {}) {
    super(query, params.entityIds);
    params.maxAge = toBoolean(params.maxAge) ? params.maxAge : 10;
    this.activate();
    this.selectIds()
      .pipe(skip(1))
      .subscribe(ids => this.activate(ids));
  }

  redo(ids?: OrArray<State['ids'][0]>) {
    this.forEachId(ids, e => e.redo());
  }

  undo(ids?: OrArray<State['ids'][0]>) {
    this.forEachId(ids, e => e.undo());
  }

  hasPast(id: State['ids'][0]) {
    if(this.hasEntity(id)) {
      return this.getEntity(id).hasPast;
    }
  }

  hasFuture(id: State['ids'][0]) {
    if(this.hasEntity(id)) {
      return this.getEntity(id).hasFuture;
    }
  }

  jumpToFuture(ids: OrArray<State['ids'][0]>, index: number) {
    this.forEachId(ids, e => e.jumpToFuture(index));
  }

  jumpToPast(ids: OrArray<State['ids'][0]>, index: number) {
    this.forEachId(ids, e => e.jumpToPast(index));
  }

  clear(ids?: OrArray<State['ids'][0]>) {
    this.forEachId(ids, e => e.clear());
  }

  destroy(ids?: OrArray<State['ids'][0]>, clearHistory = false) {
    this.forEachId(ids, e => e.destroy(clearHistory));
  }

  ignoreNext(ids?: OrArray<State['ids'][0]>) {
    this.forEachId(ids, e => e.ignoreNext());
  }

  protected instantiatePlugin(id: State['ids'][0]) {
    return new StateHistoryPlugin<State>(this.query, this.params, id) as P;
  }
}
