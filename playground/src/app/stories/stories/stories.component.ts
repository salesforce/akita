import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { createStory, StoriesQuery, StoriesService, Story } from '../state';
import { PersistForm } from '../../../../../akita/src';

@Component({
  selector: 'app-stories',
  templateUrl: './stories.component.html',
  styleUrls: ['./stories.component.css']
})
export class StoriesComponent implements OnInit {
  form: FormGroup;
  storeValue;
  persistForm: PersistForm<Story>;
  loading$: Observable<boolean>;

  constructor(private storiesQuery: StoriesQuery, private storiesService: StoriesService) {}

  ngOnInit() {
    this.loading$ = this.storiesQuery.selectLoading();

    this.form = new FormGroup({
      title: new FormControl(''),
      story: new FormControl(''),
      draft: new FormControl(false),
      category: new FormControl('js')
    });

    this.persistForm = new PersistForm(this.storiesQuery, createStory).setForm(this.form);
    this.storeValue = this.storiesQuery.select(state => state.akitaForm);
  }

  submit() {
    this.storiesService.add(this.form.value).subscribe(() => this.persistForm.reset());
  }

  ngOnDestroy() {
    this.persistForm && this.persistForm.destroy();
  }
}
