import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { createStory, StoriesQuery, StoriesService, Story } from '../state';
import { PersistNgFormPlugin } from '../../../../../akita/src';

@Component({
  selector: 'app-stories',
  templateUrl: './stories.component.html',
  styleUrls: ['./stories.component.css']
})
export class StoriesComponent implements OnInit {
  form: FormGroup;
  storeValue;
  persistForm: PersistNgFormPlugin<Story>;
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

    this.persistForm = new PersistNgFormPlugin(this.storiesQuery, createStory).setForm(this.form);
    this.storeValue = this.storiesQuery.select(state => state.akitaForm);
  }

  submit() {
    this.storiesService.add(this.form.value).subscribe(() => this.persistForm.reset());
  }

  ngOnDestroy() {
    this.persistForm && this.persistForm.destroy();
  }
}
