import { AkitaPlugin, Queries } from '../plugin';
import { QueryEntity } from '../../api/query-entity';
import { BehaviorSubject, Subscription } from 'rxjs';
import { distinctUntilChanged, skip } from 'rxjs/operators';
import { isFunction, isUndefined } from '../../internal/utils';
import { EntityParam } from '../entity-collection-plugin';
import { getGlobalState } from '../../internal/global-state';

const globalState = getGlobalState();

export type DirtyCheckComparator = (head, current) => boolean;

export type DirtyCheckParams = {
  comparator?: DirtyCheckComparator;
};

export const dirtyCheckDefaultParams: DirtyCheckParams = {
  comparator: (head, current) => JSON.stringify(head) !== JSON.stringify(current)
};

export type DirtyCheckResetParams<S = any> = {
  updateFn?: S | ((head, current) => any);
};

export class DirtyCheck<E = any, S = any> extends AkitaPlugin<E, S> {
  private head: S | E;
  private dirty = new BehaviorSubject(false);
  private subscription: Subscription;
  private active = false;

  isDirty$ = this.dirty.asObservable().pipe(distinctUntilChanged());

  constructor(protected query: Queries<E, S>, private params?: DirtyCheckParams, private _entityId?: EntityParam) {
    super(query);
    this.params = { ...dirtyCheckDefaultParams, ...params };
  }

  private getHead() {
    return this.getSource(this._entityId);
  }

  private activate() {
    this.head = this.getHead();
    this.subscription = this.selectSource(this._entityId)
      .pipe(skip(1))
      .subscribe(currentState => {
        if (isUndefined(this.head)) return;

        const isChange = this.params.comparator(this.head, currentState);

        this.updateDirtiness(isChange);
      });
  }

  reset(params: DirtyCheckResetParams = {}) {
    let currentValue = this.head;
    if (isFunction(params.updateFn)) {
      currentValue = params.updateFn(this.head, (this.getQuery() as QueryEntity<S, E>).getEntity(this._entityId));
    }

    if (this.getSource(this._entityId) !== currentValue) {
      globalState.setCustomAction({ type: `@DirtyCheck - Revert` });
      this.updateStore(currentValue, this._entityId);
    }
  }

  setHead() {
    if (!this.active) {
      this.activate();
      this.active = true;
    }
    this.head = this.getHead();
    this.updateDirtiness(false);
  }

  destroy() {
    this.subscription && this.subscription.unsubscribe();
  }

  private updateDirtiness(isDirty: boolean) {
    this.dirty.next(isDirty);
  }
}
