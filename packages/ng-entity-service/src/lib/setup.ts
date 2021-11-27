import { Injectable } from '@angular/core';
import { EntityState, EntityStore, ID, StoreConfig } from '@datorama/akita';
import { NgEntityServiceConfig } from './ng-entity-service.config';
import { NgEntityService } from './ng-entity.service';

export interface TestEntity {
  id: ID;
  foo: string;
  bar: number;
}

export type TestEntityState = EntityState<TestEntity>;

export const storeName = 'test-store';

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: storeName })
export class TestStore extends EntityStore<TestEntityState, TestEntity> {
  constructor() {
    super();
  }
}
@Injectable({ providedIn: 'root' })
@NgEntityServiceConfig()
export class TestService extends NgEntityService<TestEntityState> {
  public constructor(readonly store: TestStore) {
    super(store);
  }
}

@Injectable()
@NgEntityServiceConfig()
export class TestServiceWithInlineConfig extends NgEntityService<TestEntityState> {
  public constructor(readonly store: TestStore) {
    super(store, { baseUrl: 'inline-url', resourceName: 'inline-res' });
  }
}

@Injectable()
@NgEntityServiceConfig({
  baseUrl: 'decorator-url',
  resourceName: 'decorator-res',
})
export class TestServiceWithDecoratorConfig extends NgEntityService<TestEntityState> {
  public constructor(readonly store: TestStore) {
    super(store);
  }
}

@Injectable()
@NgEntityServiceConfig({
  baseUrl: 'decorator-url',
  resourceName: 'decorator-res',
})
export class TestServiceWithDecoratorAndInlineConfig extends NgEntityService<TestEntityState> {
  public constructor(readonly store: TestStore) {
    super(store, { baseUrl: 'inline-url', resourceName: 'inline-res' });
  }
}

@Injectable()
@NgEntityServiceConfig({ baseUrl: 'decorator-url' })
export class TestServiceWithMixedConfig extends NgEntityService<TestEntityState> {
  public constructor(readonly store: TestStore) {
    super(store, { resourceName: 'inline-res' });
  }
}
