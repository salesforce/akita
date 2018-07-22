import { AkitaPlugin } from '../plugin';
import { Query } from '../../api/query';
import { Observable, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { globalState } from '../../internal/global-state';
import { isUndefined } from '../../internal/utils';

export type FormGroupLike = {
  patchValue: Function;
  setValue: Function;
  valueChanges: Observable<any>;
};

export type AkitaFormProp<T> = {
  [key: string]: T;
};

export type PersistFormParams = {
  debounceTime?: number;
  formKey?: string;
};

export class PersistNgFormPlugin<T = any> extends AkitaPlugin {
  formChanges: Subscription;
  private form: FormGroupLike;

  constructor(protected query: Query<any>, private factoryFunction: Function, private params: PersistFormParams = {}) {
    super(query);
    this.params = { ...{ debounceTime: 100, formKey: 'akitaForm' }, ...params };
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
        [this.params.formKey]: value
      };
    });
  }

  private activate() {
    if (!(this.getQuery().getSnapshot() as AkitaFormProp<T>)[this.params.formKey]) {
      globalState.setAction({ type: '@PersistNgFormPlugin activate' });
      this.getStore().setState(state => {
        return {
          ...state,
          [this.params.formKey]: this.factoryFunction()
        };
      });
    }

    this.query.selectOnce(state => (state as AkitaFormProp<T>)[this.params.formKey]).subscribe(formValue => this.form.patchValue(formValue));
    this.formChanges = this.form.valueChanges.pipe(debounceTime(this.params.debounceTime)).subscribe(value => {
      globalState.setAction({ type: '@PersistForm - Update' });
      this.getStore().setState(state => {
        return {
          ...state,
          [this.params.formKey]: value
        };
      });
    });
  }

  destroy() {
    this.formChanges && this.formChanges.unsubscribe();
  }
}
