import { EntityState, EntityStore, getEntityType, getIDType, ID, QueryEntity } from '@datorama/akita';
import { merge, MonoTypeOperatorFunction, Observable, of, Operator, Subscriber, TeardownLogic, UnaryFunction } from 'rxjs';
import { distinctUntilChanged, filter, first, switchMap, tap } from 'rxjs/operators';
import { OperatorFunction } from 'rxjs/src/internal/types';

type getEntityStoreState<T extends EntityStore<any>> = T extends EntityStore<infer S> ? S : never;

/**
 * Track id updates of an entity and re-evaluation the query with the changed entity id.
 * Hint: Don't place the operator after other operators in the same pipeline as those will be skipped on
 * re-evaluation.
 * @param store The entity store in which the entity is located.
 * @example
 *
 *   query.selectEntity(1).pipe(trackIdChanges(store)).subscribe(entity => { ... })
 *
 */
export function trackIdChanges<K extends EntityStore<S, T>, S extends EntityState<T> = getEntityStoreState<K>, T = getEntityType<S>>(store: K): MonoTypeOperatorFunction<T> {
  return (source) => source.lift<T>(new TrackIdChanges(store));
}

class TrackIdChanges<K extends EntityStore<S, T>, S extends EntityState<T>, T = getEntityType<S>> implements Operator<T, T> {
  readonly query: QueryEntity<S, T>;

  constructor(readonly store: K) {
    this.query = new QueryEntity((store as unknown) as EntityStore<S>);
  }

  call(subscriber: Subscriber<T>, source: Observable<T>): TeardownLogic {
    return source
      .pipe(
        first(),
        switchMap((entity) => {
          let currId = entity[this.store.config.idKey];
          let select = this.query.selectEntity(currId);
          let pending = false;

          return merge(of({ newId: undefined, oldId: currId, pending: false }), this.store.selectEntityIdChanges$).pipe(
            // the new id must differ form the old id
            filter((change) => change.oldId === currId),
            // extract the current pending state of the id update
            tap((change) => (pending = change.pending)),
            // only update the selection query if the id update is already applied to the store
            filter((change) => change.newId !== currId && !pending),
            // build a selection query for the new entity id
            switchMap((change) => {
              return (select = this.query
                .selectEntity((currId = change.newId || currId))
                // skip undefined value if pending.
                .pipe(filter(() => !pending)));
            })
          );
        })
      )
      .subscribe(subscriber);
  }
}
