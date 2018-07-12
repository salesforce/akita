import { Subject } from 'rxjs';
import { PersistFormPlugin } from '../src/plugins/persist-form/persist-form-plugin';
import { createStory, Story } from '../../playground/src/app/stories/state/story.model';
import { EntityStore, QueryEntity, StoreConfig } from '../src/index';

const formGroup = {
  _changes: new Subject(),
  value: undefined,
  setValue(v) {
    this._changes.next(v);
    this.value = v;
  },
  patchValue(v) {
    this._changes.next(v);
    this.value = v;
  },
  get valueChanges() {
    return this._changes.asObservable();
  }
};

@StoreConfig({ name: 'stories' })
class StoriesStore extends EntityStore<any, any> {
  constructor() {
    super();
  }
}

export class StoriesQuery extends QueryEntity<any, Story> {
  constructor(protected store) {
    super(store);
  }
}

const store = new StoriesStore();
const query = new StoriesQuery(store);

describe('PersistForm', () => {
  jest.useFakeTimers();
  const persistForm = new PersistFormPlugin(query, createStory).setForm(formGroup);

  it('should set the form initial state from the store', () => {
    expect(formGroup.value).toEqual(createStory());
  });

  it('should persist the store with the form', () => {
    formGroup.patchValue({
      title: 'test',
      story: 'test',
      draft: true,
      category: 'rx'
    });
    jest.runAllTimers();
    expect(query.getSnapshot().akitaForm).toEqual({
      title: 'test',
      story: 'test',
      draft: true,
      category: 'rx'
    });
  });

  it('should reset the form', () => {
    persistForm.reset();
    expect(query.getSnapshot().akitaForm).toEqual(createStory());
    expect(formGroup.value).toEqual(createStory());
  });
});
