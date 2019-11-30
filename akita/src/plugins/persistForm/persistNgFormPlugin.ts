import { AkitaPlugin } from '../plugin';
import { Query } from '../../query';
import { Observable, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { getValue } from '../../getValueByString';
import { toBoolean } from '../../toBoolean';
import { isString } from '../../isString';
import { setValue } from '../../setValueByString';
import { logAction } from '../../actions';

export type FormGroupLike = {
  patchValue: Function;
  setValue: Function;
  value: any;
  get: Function;
  valueChanges: Observable<any>;
  controls: any;
};

export type AkitaFormProp<T> = {
  [key: string]: T;
};

export type PersistFormParams = {
  debounceTime?: number;
  formKey?: string;
  emitEvent?: boolean;
  arrControlFactory?: ArrayControlFactory;
};

export type ArrayControlFactory = (value: any) => any; // Todo: Return  AbstractControl interface

export class PersistNgFormPlugin<T = any> extends AkitaPlugin {
  formChanges: Subscription;
  private isRootKeys: boolean;
  private form: FormGroupLike;
  private isKeyBased: boolean;
  private initialValue;
  private builder;

  constructor(protected query: Query<any>, private factoryFnOrPath?: Function | string, private params: PersistFormParams = {}) {
    super(query);
    this.params = { ...{ debounceTime: 300, formKey: 'akitaForm', emitEvent: false, arrControlFactory: v => this.builder.control(v) }, ...params };
    this.isRootKeys = toBoolean(factoryFnOrPath) === false;
    this.isKeyBased = isString(factoryFnOrPath) || this.isRootKeys;
  }

  setForm(form: FormGroupLike, builder?) {
    this.form = form;
    this.builder = builder;
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

    if (this.isKeyBased) {
      Object.keys(this.initialValue).forEach(stateKey => {
        const value = this.initialValue[stateKey];
        if (Array.isArray(value) && this.builder) {
          const formArray = this.form.controls[stateKey];
          this.cleanArray(formArray);
          value.forEach((v, i) => {
            this.form.get(stateKey).insert(i, (this.params.arrControlFactory as Function)(v));
          });
        }
      });
    }
    this.form.patchValue(value, { emitEvent: this.params.emitEvent });

    const storeValue = this.isKeyBased ? setValue(this.getQuery().getValue(), `${this.getStore().storeName}.${this.factoryFnOrPath}`, value) : { [this.params.formKey]: value };
    this.updateStore(storeValue);
  }

  private cleanArray(control) {
    while (control.length !== 0) {
      control.removeAt(0);
    }
  }

  private resolveInitialValue(formValue, root) {
    if (!formValue) return;
    return Object.keys(formValue).reduce((acc, stateKey) => {
      const value = root[stateKey];
      if (Array.isArray(value) && this.builder) {
        const factory = this.params.arrControlFactory;
        this.cleanArray(this.form.get(stateKey));
        value.forEach((v, i) => {
          this.form.get(stateKey).insert(i, (factory as Function)(v));
        });
      }
      acc[stateKey] = root[stateKey];
      return acc;
    }, {});
  }

  private activate() {
    let path;

    if (this.isKeyBased) {
      if (this.isRootKeys) {
        this.initialValue = this.resolveInitialValue(this.form.value, this.getQuery().getValue());
        this.form.patchValue(this.initialValue, { emitEvent: this.params.emitEvent });
      } else {
        path = `${this.getStore().storeName}.${this.factoryFnOrPath}`;
        const root = getValue(this.getQuery().getValue(), path);
        this.initialValue = this.resolveInitialValue(root, root);
        this.form.patchValue(this.initialValue, { emitEvent: this.params.emitEvent });
      }
    } else {
      if (!(this.getQuery().getValue() as AkitaFormProp<T>)[this.params.formKey]) {
        logAction('@PersistNgFormPlugin activate');
        this.updateStore({ [this.params.formKey]: (this as any).factoryFnOrPath() });
      }

      const value = this.getQuery().getValue()[this.params.formKey];
      this.form.patchValue(value);
    }

    this.formChanges = this.form.valueChanges.pipe(debounceTime(this.params.debounceTime)).subscribe(value => {
      logAction('@PersistForm - Update');
      let newState;
      if (this.isKeyBased) {
        if (this.isRootKeys) {
          newState = state => ({ ...state, ...value });
        } else {
          newState = state => setValue(state, path, value);
        }
      } else {
        newState = () => ({ [this.params.formKey]: value });
      }
      this.updateStore(newState(this.getQuery().getValue()));
    });
  }

  destroy() {
    this.formChanges && this.formChanges.unsubscribe();
    this.form = null;
    this.builder = null;
  }
}
