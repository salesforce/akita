import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { PersistNgFormPlugin } from '@datorama/akita';
import { StoriesQuery } from '../state/stories.query';
import { createStory, Story } from '../state/story.model';
import { StoriesService } from '../state/stories.service';

@Component({
  selector: 'app-stories',
  templateUrl: './stories.component.html',
  styleUrls: ['./stories.component.css']
})
export class StoriesComponent implements OnInit {
  form: FormGroup;
  formKeyBased: FormGroup;
  formRootKey: FormGroup;
  storeValue;
  persistForm: PersistNgFormPlugin<Story>;
  persistFormKey: PersistNgFormPlugin;
  persistFormRootKey: PersistNgFormPlugin;
  loading$: Observable<boolean>;

  constructor(private storiesQuery: StoriesQuery, private storiesService: StoriesService, private builder: FormBuilder) {}

  ngOnInit() {
    this.loading$ = this.storiesQuery.selectLoading();

    this.form = this.builder.group({
      title: this.builder.control(''),
      story: this.builder.control(''),
      draft: this.builder.control(false),
      category: this.builder.control('js')
    });

    this.formKeyBased = this.builder.group({
      time: this.builder.control(''),
      tankOwners: this.builder.array([]),
      isAdmin: this.builder.control(null)
    });

    this.formRootKey = this.builder.group({
      skills: this.builder.array([]),
      someBoolean: this.builder.control(false)
    });

    this.persistForm = new PersistNgFormPlugin(this.storiesQuery, createStory).setForm(this.form);
    this.persistFormKey = new PersistNgFormPlugin(this.storiesQuery, 'config').setForm(this.formKeyBased, this.builder);
    this.persistFormRootKey = new PersistNgFormPlugin(this.storiesQuery).setForm(this.formRootKey, this.builder);
    this.storeValue = this.storiesQuery.select(state => state.akitaForm);
  }

  submit() {
    this.storiesService.add(this.form.value).subscribe(() => this.persistForm.reset());
    this.persistFormKey.reset();
    this.persistFormRootKey.reset();
  }

  ngOnDestroy() {
    this.persistForm && this.persistForm.destroy();
  }

  addSkill() {
    (this.formRootKey.get('skills') as FormArray).push(this.builder.control('Akita'));
  }
}
