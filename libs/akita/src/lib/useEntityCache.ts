import { EntityState, getEntityType, getIDType, QueryEntity } from '@datorama/akita';
import { combineLatest, MonoTypeOperatorFunction, Observable } from 'rxjs';
import { first, map, switchMap, switchMapTo, tap } from 'rxjs/operators';

export function useEntityCache<
  TQuery extends QueryEntity<TState, TEntity, TIdType>,
  TState extends EntityState<TEntity, TIdType> = TQuery extends QueryEntity<infer I> ? I : never,
  TEntity = getEntityType<TState>,
  TIdType = getIDType<TState>
>(query: TQuery, id: TIdType): MonoTypeOperatorFunction<TEntity> {
  return (source: Observable<TEntity>) =>
    combineLatest([
      query.selectEntity(id).pipe(
        map((entity) => entity !== undefined),
        first()
      ),
      query.selectIsEntityExpired(id).pipe(first()),
    ]).pipe(
      switchMap(([IsPresent, isExpired]) => {
        const result = query.selectEntity(id);

        if (!IsPresent || isExpired) {
          return source
            .pipe(
              tap((entity) => {
                const store = query.__store__;

                if (store) {
                  if (IsPresent) {
                    store.update(id as getIDType<TState>, entity);
                  } else {
                    store.add(entity as getEntityType<TState>);
                  }
                }
              })
            )
            .pipe(switchMapTo(result));
        }

        return result;
      })
    );
}
