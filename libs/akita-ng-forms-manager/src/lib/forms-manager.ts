import { Injectable, InjectionToken, Inject, Optional } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, FormArray, FormControl, FormGroup, ValidatorFn } from '@angular/forms';
import { coerceArray, filterNil, HashMap, logAction } from '@datorama/akita';
import { merge, Observable, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { FormsQuery } from './forms-manager.query';
import { FormsStore } from './forms-manager.store';
import { FormsManagerOptions, FORMS_MANAGER_OPTIONS, defaultOptions } from './forms-manager-options';

export type AkitaAbstractControl = Pick<AbstractControl, 'value' | 'valid' | 'invalid' | 'disabled' | 'errors' | 'touched' | 'pristine' | 'pending' | 'dirty'> & { rawValue: any };

export interface AkitaAbstractGroup<C = any> extends AkitaAbstractControl {
  controls: { readonly [P in keyof C]: AkitaAbstractControl };
}

export type ArrayControlFactory = (value: any) => AbstractControl;

@Injectable({
  providedIn: 'root'
})
export class AkitaNgFormsManager<FormsState = any> {
  private readonly _options: FormsManagerOptions;
  private readonly _store: FormsStore<FormsState>;
  private readonly _query: FormsQuery<FormsState>;

  private valueChanges: HashMap<Subscription> = {};
  private ngForms: HashMap<AbstractControl> = {};

  constructor(@Optional() @Inject(FORMS_MANAGER_OPTIONS) options: Partial<FormsManagerOptions> = {}) {
    this._options = Object.assign({}, defaultOptions, options);
    this._store = new FormsStore({} as FormsState);
    this._query = new FormsQuery(this.store);
  }

  get query() {
    return this._query;
  }

  get store() {
    return this._store;
  }

  selectValid(formName: keyof FormsState, path?: string): Observable<boolean> {
    return this.selectControl(formName, path).pipe(map(control => control.valid));
  }

  selectDirty(formName: keyof FormsState, path?: string): Observable<boolean> {
    return this.selectControl(formName, path).pipe(map(control => control.dirty));
  }

  selectDisabled(formName: keyof FormsState, path?: string): Observable<boolean> {
    return this.selectControl(formName, path).pipe(map(control => control.disabled));
  }

  selectValue<T = any>(formName: keyof FormsState, path?: string): Observable<T> {
    return this.selectControl(formName, path).pipe(map(control => control.value));
  }

  selectErrors(formName: keyof FormsState, path?: string): Observable<any> {
    return this.selectControl(formName, path).pipe(map(control => control.errors));
  }

  selectNgForm(formName: keyof FormsState): Observable<AbstractControl> {
    return this.selectForm(formName, { filterNil: true }).pipe(map(() => this.ngForms[formName as any]));
  }

  /**
   * If no path specified it means that it's a single FormControl or FormArray
   */
  selectControl(formName: keyof FormsState, path?: string): Observable<AkitaAbstractControl> {
    if (!path) {
      return this.selectForm(formName);
    }
    return this.query
      .select(state => state[formName as any])
      .pipe(
        filterNil,
        map(form => this.resolveControl(form, path)),
        distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b))
      );
  }

  getControl(formName: keyof FormsState, path?: string): AkitaAbstractControl {
    if (!path) {
      return this.getForm(formName);
    }

    if (this.hasForm(formName)) {
      const form = this.getForm(formName);
      return this.resolveControl(form, path);
    }

    return null;
  }

  selectForm(formName: keyof FormsState, options: { filterNil: true } = { filterNil: true }): Observable<AkitaAbstractGroup> {
    return this.query.select(state => state[formName as any]).pipe(options.filterNil ? filterNil : s => s);
  }

  getForm<Name extends keyof FormsState>(formName: keyof FormsState): AkitaAbstractGroup<FormsState[Name]> {
    return this.query.getValue()[formName as any];
  }

  getNgForm(formName: keyof FormsState): AbstractControl {
    return this.ngForms[formName as any];
  }

  hasForm(formName: keyof FormsState): boolean {
    return !!this.getForm(formName);
  }

  upsert(
    formName: keyof FormsState,
    form: AbstractControl,
    config: {
      debounceTime?: number;
      emitEvent?: boolean;
      arrControlFactory?: ArrayControlFactory | HashMap<ArrayControlFactory>;
      persistForm?: boolean;
    } = {}
  ) {
    const merged = { ...{ debounceTime: this._options.debounceTime, emitEvent: false }, ...config };

    /** If the form already exist, patch the form with the store value */
    if (this.hasForm(formName) === true) {
      form.patchValue(this.resolveStoreToForm(formName, form, merged.arrControlFactory), {
        emitEvent: merged.emitEvent
      });
    } else {
      /** else update the store with the current form state */
      this.updateStore(formName, form, true);
      if (merged.persistForm) {
        this.storeFormInstance(formName, form);
      }
    }

    this.valueChanges[formName as any] = merge(form.valueChanges, form.statusChanges.pipe(distinctUntilChanged()))
      .pipe(debounceTime(merged.debounceTime))
      .subscribe(() => this.updateStore(formName, form));

    return this;
  }

  remove(formName?: keyof FormsState) {
    if (formName) {
      this.removeFromStore(formName);
    } else {
      const availableForms = Object.keys(this.query.getValue());
      for (const name of availableForms) {
        this.removeFromStore(name as any);
      }
    }
    this.unsubscribe(formName);
  }

  unsubscribe(formName?: keyof FormsState, config: { removeNgForm?: boolean; updateStore?: boolean } = {}) {
    const _config = {
      removeNgForm: true,
      ...{ updateStore: this._options.updateStoreOnUnsubscribe },
      ...config
    };
    const _formName = formName as any;
    const removeInstance = (name: any) => (_config.removeNgForm ? this.removeFormInstance(name) : null);

    if (_formName) {
      if (this.valueChanges[_formName]) {
        this.valueChanges[_formName].unsubscribe();
        delete this.valueChanges[_formName];
        if (config.updateStore && this.ngForms[_formName]) {
          this.updateStore(_formName, this.getNgForm(_formName));
        }
        removeInstance(_formName);
      }
    } else {
      for (const name of Object.keys(this.valueChanges) as any[]) {
        this.valueChanges[name].unsubscribe();
        if (config.updateStore && this.ngForms[name]) {
          this.updateStore(name, this.getNgForm(name));
        }
        removeInstance(name);
      }
      this.valueChanges = {};
    }
  }

  private removeFromStore(formName: keyof FormsState) {
    const snapshot = this.query.getValue();
    const newState: Partial<FormsState> = Object.keys(snapshot).reduce((acc, currentFormName) => {
      if (formName !== currentFormName) {
        acc[currentFormName] = snapshot[currentFormName];
      }
      return acc;
    }, {});

    logAction(`Remove ${formName}`);
    this.store._setState(() => newState as any);
  }

  private resolveControl(form, path: string) {
    const [first, ...rest] = path.split('.');
    if (rest.length === 0) {
      return form.controls[first];
    }

    return this.find(form.controls[first], rest);
  }

  private find(control: AkitaAbstractGroup, path: string[]) {
    return path.reduce((current: AkitaAbstractGroup, name: string) => {
      return current.controls.hasOwnProperty(name) ? current.controls[name] : null;
    }, control);
  }

  private resolveStoreToForm(formName: keyof FormsState, control: AbstractControl, arrControlFactory: ArrayControlFactory | HashMap<ArrayControlFactory>) {
    const form = this.getForm(formName);
    const value = form.value;
    /** It means it a single control */
    if (!form.controls) {
      return value;
    }

    this.handleFormArray(value, control, arrControlFactory);
    return value;
  }

  private handleFormArray(formValue: HashMap<any> | any[], control: AbstractControl, arrControlFactory: ArrayControlFactory | HashMap<ArrayControlFactory>) {
    if (control instanceof FormArray) {
      this.cleanArray(control as FormArray);
      if (!arrControlFactory) {
        throw new Error('Please provide arrControlFactory');
      }
      formValue.forEach((v, i) => (control as FormArray).insert(i, (arrControlFactory as Function)(v)));
    } else {
      Object.keys(formValue).forEach(controlName => {
        const value = formValue[controlName];
        if (Array.isArray(value) && control.get(controlName) instanceof FormArray === true) {
          if (!arrControlFactory || (arrControlFactory && controlName in arrControlFactory === false)) {
            throw new Error('Please provide arrControlFactory for ' + controlName);
          }
          const current = control.get(controlName) as FormArray;
          const fc = arrControlFactory[controlName];
          this.cleanArray(current);
          value.forEach((v, i) => current.insert(i, fc(v)));
        }
      });
    }
  }

  private cleanArray(control: FormArray) {
    while (control.length !== 0) {
      control.removeAt(0);
    }
  }

  private buildFormStoreState(formName: keyof FormsState, form: AbstractControl) {
    let value;

    if (form instanceof FormControl) {
      value = this.resolveFormToStore(form);
    }

    if (form instanceof FormGroup || form instanceof FormArray) {
      // The root form group
      value = {
        ...this.resolveFormToStore(form),
        controls: {}
      };

      for (const key of Object.keys(form.controls)) {
        const control = form.controls[key];
        if (control instanceof FormGroup || form instanceof FormArray) {
          value.controls[key] = this.buildFormStoreState(formName, control);
        } else {
          value.controls[key] = this.resolveFormToStore(control);
        }
      }
    }

    return value;
  }

  private updateStore(formName: keyof FormsState, form: AbstractControl, initial = false) {
    const value = this.buildFormStoreState(formName, form);
    const capitalized = formName[0].toUpperCase() + (formName as any).slice(1);
    const action = `${initial ? 'Create' : 'Update'} ${capitalized} Form`;
    logAction(action);
    this.store.update({
      [formName]: value
    } as any);
  }

  private resolveFormToStore(control: Partial<AbstractControl>): AkitaAbstractControl {
    return {
      value: this.cloneValue(control.value), // Clone object to prevent issue with third party that would be affected by store freezing.
      rawValue: (control as any).getRawValue ? (control as any).getRawValue() : null,
      valid: control.valid,
      dirty: control.dirty,
      invalid: control.invalid,
      disabled: control.disabled,
      errors: control.errors,
      touched: control.touched,
      pristine: control.pristine,
      pending: control.pending
    };
  }

  private cloneValue(value: any): any {
    return this.isObject(value) ? { ...value } : Array.isArray(value) ? [...value] : value;
  }

  private isObject(val) {
    if (val == null) {
      return false;
    }
    if (Array.isArray(val)) {
      return false;
    }
    return typeof val === 'function' || typeof val === 'object';
  }

  private storeFormInstance(formName: keyof FormsState, form: AbstractControl) {
    const newForms = {
      ...this.ngForms,
      [formName as any]: form
    };

    this.ngForms = newForms;
  }

  private removeFormInstance(formName: keyof FormsState) {
    if (this.ngForms[formName as any]) {
      delete this.ngForms[formName as any];
    }
  }
}

export function setValidators(control: AbstractControl, validator: ValidatorFn | ValidatorFn[] | null) {
  control.setValidators(coerceArray(validator));
  control.updateValueAndValidity();
}

export function setAsyncValidators(control: AbstractControl, validator: AsyncValidatorFn | AsyncValidatorFn[] | null) {
  control.setValidators(coerceArray(validator));
  control.updateValueAndValidity();
}
