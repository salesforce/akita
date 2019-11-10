import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { AkitaNgFormsManager, setValidators } from '@datorama/akita-ng-forms-manager';

@Component({
  selector: 'app-forms-manager',
  templateUrl: './forms-manager.component.html',
  styleUrls: ['./forms-manager.component.css']
})
export class FormsManagerComponent implements OnInit {
  email: FormControl;
  config;
  group: FormGroup;
  arr: FormArray;
  settings: FormGroup;

  constructor(private formsManager: AkitaNgFormsManager<any>, private builder: FormBuilder) {}

  ngOnInit() {
    this.email = new FormControl(null, Validators.email);

    const createControl = value => new FormControl(value);

    this.arr = new FormArray([createControl('One')]);

    this.config = this.builder.group({
      skills: this.builder.array([]),
      someBoolean: this.builder.control(false),
      minAge: this.builder.control(null)
    });

    this.group = new FormGroup({
      email: new FormControl(),
      number: new FormControl(),
      price: new FormControl(null, Validators.min(10)),
      checkbox: new FormControl(true),
      phone: new FormGroup({
        number: new FormControl(),
        prefix: new FormControl(),
        a: new FormGroup({
          b: new FormControl(),
          c: new FormControl()
        })
      })
    });

    this.formsManager
      .selectValue<number>('settings', 'minPrice')
      .pipe(untilDestroyed(this))
      .subscribe(minPrice => {
        setValidators(this.group.get('price'), Validators.min(minPrice));
      });

    const createSkillControl = val => new FormControl(null, Validators.required);

    this.settings = new FormGroup({
      minPrice: new FormControl(10)
    });

    this.formsManager.upsert('settings', this.settings);

    this.formsManager
      .upsert('single', this.email)
      .upsert('config', this.config, {
        arrControlFactory: { skills: createSkillControl }
      })
      .upsert('group', this.group)
      .upsert('array', this.arr, { arrControlFactory: createControl });
  }

  addControl() {
    this.arr.push(this.builder.control(''));
  }

  addSkill() {
    this.config.get('skills').push(this.builder.control(Math.random().toString(), Validators.required));
  }

  clear(storeName) {
    this.formsManager.remove(storeName);
  }

  reset() {
    this.config.patchValue({ minAge: 0 });
  }

  ngOnDestroy() {
    this.formsManager.unsubscribe();
  }
}
