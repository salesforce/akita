import { Subject } from 'rxjs';
import { PersistForm } from '../src/plugins/persist-form';
import { Story } from '../../playground/src/app/stories/state/story.model';
import { EntityStore, QueryEntity, StoreConfig } from '../src/index';

const formGroup = {
  _changes: new Subject(),
  value: undefined,
  patchValue(v) {
    this._changes.next(v);
    this.value = v;
  },
  get valueChanges() {
    return this._changes.asObservable();
  }
};

const formStoryInitialState = {
  title: '',
  story: '',
  draft: false,
  category: 'js'
};

const initialState = {
  ui: {
    form: formStoryInitialState
  }
};

@StoreConfig({ name: 'stories' })
class StoriesStore extends EntityStore<any, any> {
  constructor() {
    super(initialState);
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
  const persistForm = new PersistForm(query, formGroup as any, 'ui.form');

  it('should set the form initial state from the store', function() {
    expect(formGroup.value).toEqual(formStoryInitialState);
  });

  it('should persist the store with the form', function() {
    formGroup.patchValue({
      title: 'test',
      story: 'test',
      draft: true,
      category: 'rx'
    });
    jest.runAllTimers();
    expect(query.getSnapshot().ui.form).toEqual({
      title: 'test',
      story: 'test',
      draft: true,
      category: 'rx'
    });
  });

  it('should reset the form', function() {
    persistForm.reset(formStoryInitialState);
    expect(query.getSnapshot().ui.form).toEqual(formStoryInitialState);
    expect(formGroup.value).toEqual(formStoryInitialState);
  });
});
