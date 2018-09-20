import { AkitaPlugin } from '../plugin';
import { Query } from '../../api/query';
import { Observable, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { __globalState } from '../../internal/global-state';
import { getValue, isString, setValue } from '../../internal/utils';

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
  emitEvent?: boolean;
};

export class PersistNgFormPlugin<T = any> extends AkitaPlugin {
  formChanges: Subscription;
  private form: FormGroupLike;
  private isKeyBased: boolean;
  private initialValue;

  constructor(protected query: Query<any>, private factoryFnOrPath: Function | string, private params: PersistFormParams = {}) {
    super(query);
    this.params = { ...{ debounceTime: 300, formKey: 'akitaForm', emitEvent: false }, ...params };
    this.isKeyBased = isString(factoryFnOrPath);
  }

  setForm(form: FormGroupLike) {
    this.form = form;
    this.activate();
    return this;
  }

  reset(initialState?: T) {
    let value;
    if (initialState) {
      value = initialState;
    } else {
      value = this.isKeyBased ? this.initialValue : (this as any).factoryFnOrPath();
    }

    this.form.patchValue(value, { emitEvent: this.params.emitEvent });

    const storeValue = this.isKeyBased ? setValue(this.getStore()._value(), `${this.getStore().storeName}.${this.factoryFnOrPath}`, value) : { [this.params.formKey]: value };
    this.updateStore(storeValue);
  }

  private activate() {
    let path;

    if (this.isKeyBased) {
      path = `${this.getStore().storeName}.${this.factoryFnOrPath}`;
      this.initialValue = getValue(this.getStore()._value(), path);
      this.form.patchValue(this.initialValue, { emitEvent: this.params.emitEvent });
    } else {
      if (!(this.getQuery().getSnapshot() as AkitaFormProp<T>)[this.params.formKey]) {
        __globalState.setAction({ type: '@PersistNgFormPlugin activate' });
        this.updateStore({ [this.params.formKey]: (this as any).factoryFnOrPath() });
      }

      this.query.selectOnce(state => (state as AkitaFormProp<T>)[this.params.formKey]).subscribe(formValue => this.form.patchValue(formValue));
    }

    this.formChanges = this.form.valueChanges.pipe(debounceTime(this.params.debounceTime)).subscribe(value => {
      __globalState.setAction({ type: '@PersistForm - Update' });
      let newState;
      if (this.isKeyBased) {
        newState = state => setValue(state, path, value);
      } else {
        newState = () => ({ [this.params.formKey]: value });
      }
      this.updateStore(newState(this.getStore()._value()));
    });
  }

  destroy() {
    this.formChanges && this.formChanges.unsubscribe();
  }
}
