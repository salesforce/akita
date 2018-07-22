import { Subject } from 'rxjs';
import { PersistNgFormPlugin } from '../src/plugins/persist-form/persist-ng-form-plugin';
import { createStory, Story } from '../../playground/src/app/stories/state/story.model';
import { EntityStore, QueryEntity, StoreConfig } from '../src/index';

const formFactory = () => ({
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
});

const formGroupA = formFactory();
const formGroupB = formFactory();

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

  const customFormKey = 'customFormKey';
  const persistForm = new PersistNgFormPlugin(query, createStory).setForm(formGroupA); //default formKey
  const persistFormWithCustomKey = new PersistNgFormPlugin(query, createStory, { formKey: customFormKey }).setForm(formGroupB);

  it('should set the form initial state from the store', () => {
    expect(formGroupA.value).toEqual(createStory());
    expect(formGroupB.value).toEqual(createStory());
  });

  it('should persist the store with the form', () => {
    const patch = {
      title: 'test',
      story: 'test',
      draft: true,
      category: 'rx'
    };

    formGroupA.patchValue(patch);
    formGroupB.patchValue(patch);

    jest.runAllTimers();

    expect(query.getSnapshot().akitaForm).toEqual(patch);
    expect(query.getSnapshot()[customFormKey]).toEqual(patch);
  });

  it('should reset the form', () => {
    persistForm.reset();
    expect(query.getSnapshot().akitaForm).toEqual(createStory());
    expect(formGroupA.value).toEqual(createStory());

    persistFormWithCustomKey.reset();
    expect(query.getSnapshot()[customFormKey]).toEqual(createStory());
    expect(formGroupB.value).toEqual(createStory());
  });
});
