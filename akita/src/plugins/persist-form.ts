import { AkitaPlugin } from './plugin';
import { Query } from '../api/query';
import { Subscription, Observable } from 'rxjs';
import { getProperty, immutableSetProp } from '../internal/object-path';
import { debounceTime } from 'rxjs/operators';

export type FormGroupLike = {
  patchValue: Function;
  setValue: Function;
  valueChanges: Observable<any>;
};

export class PersistForm<E = any, S extends object = any> extends AkitaPlugin<E, S> {
  formChanges: Subscription;

  constructor(private formGroup: FormGroupLike, private query: Query<S>, private path: string, private debounceTime = 300) {
    super();
    this.onInit();
  }

  onInit() {
    this.query.selectOnce(state => getProperty(this.path, state)).subscribe(formValue => this.formGroup.patchValue(formValue));

    this.formChanges = this.formGroup.valueChanges
      .pipe(debounceTime(this.debounceTime))
      .subscribe(value => this.getStore().setState(state => immutableSetProp(state, this.path, value), true, { type: '@PersistForm - Update' }));
  }

  reset(initialState) {
    this.formGroup.patchValue(initialState);

    this.getStore().setState(state => immutableSetProp(state, this.path, initialState));
  }

  destroy() {
    this.formChanges && this.formChanges.unsubscribe();
  }

  protected getQuery(): Query<any> {
    return this.query;
  }
}
