import { AkitaPlugin } from './plugin';
import { Query } from '../api/query';
import { Observable, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { getGlobalState } from '../internal/global-state';
import { isUndefined } from '../internal/utils';

export type FormGroupLike = {
  patchValue: Function;
  setValue: Function;
  valueChanges: Observable<any>;
};

export type AkitaFormProp<T> = {
  akitaForm: T;
};

export type PersistFormParams = {
  debounceTime?: number;
};

export class PersistForm<T = any> extends AkitaPlugin {
  formChanges: Subscription;
  private form: FormGroupLike;

  constructor(protected query: Query<any>, private factoryFunction: Function, private params: PersistFormParams = {}) {
    super(query);
    this.params = { ...{ debounceTime: 100 }, ...params };
  }

  setForm(form: FormGroupLike) {
    this.form = form;
    this.activate();
    return this;
  }

  reset(initialState?: T) {
    const value = isUndefined(initialState) ? this.factoryFunction() : initialState;
    this.form.patchValue(value);

    this.getStore().setState(state => {
      return {
        ...state,
        akitaForm: value
      };
    });
  }

  private activate() {
    if (!(this.getQuery().getSnapshot() as AkitaFormProp<T>).akitaForm) {
      this.getStore().setState(state => {
        return {
          ...state,
          akitaForm: this.factoryFunction()
        };
      });
    }

    this.query.selectOnce(state => (state as AkitaFormProp<T>).akitaForm).subscribe(formValue => this.form.patchValue(formValue));
    this.formChanges = this.form.valueChanges.pipe(debounceTime(this.params.debounceTime)).subscribe(value => {
      getGlobalState().setAction({ type: '@PersistForm - Update' });
      this.getStore().setState(state => {
        return {
          ...state,
          akitaForm: value
        };
      });
    });
  }

  destroy() {
    this.formChanges && this.formChanges.unsubscribe();
  }
}
