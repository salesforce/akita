import { EntityState, getEntityType, getIDType } from './types';
import { Observable } from 'rxjs';

export abstract class EntityService<S extends EntityState> {
  abstract get<T>(id?: getIDType<S>, config?: any): Observable<T>;
  abstract add<T>(entity: getEntityType<EntityState>, config?: any): Observable<T>;
  abstract update<T>(id: getIDType<S>, entity: Partial<getEntityType<S>>, config: any): Observable<T>;
  abstract delete<T>(id: getIDType<S>, config: any): Observable<T>;
}
