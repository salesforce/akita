import { Component, OnInit } from '@angular/core';
import { PostsQuery, PostsService } from './state';
import {
  filterMethod,
  NgEntityServiceNotifier,
  NgEntityServiceLoader,
  ofType
} from '@datorama/akita-ng-entity-service';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { memo } from 'helpful-decorators';

@Component({
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.css']
})
export class PostsComponent implements OnInit {
  posts$ = this.postsQuery.selectAll();
  loaders = this.loader.loadersFor();

  constructor(
    private postsQuery: PostsQuery,
    private postsService: PostsService,
    private loader: NgEntityServiceLoader,
    private notifier: NgEntityServiceNotifier
  ) {}

  ngOnInit() {
    this.notifier.action$
      .pipe(
        ofType('success'),
        filterMethod('DELETE'),
        untilDestroyed(this)
      )
      .subscribe(v => console.log(v));

    this.postsService
      .get({
        mapResponseFn: res => {
          return res;
        }
      })
      .subscribe();
    this.loaders.deleteEntity(3);
  }

  fetchOne() {
    this.postsService.get(1).subscribe(console.log);
  }

  add() {
    this.postsService.add({ id: 1222, title: 'New Post', body: '' }, { prepend: true }).subscribe();
  }

  update(id) {
    this.postsService.update(id, { title: 'New title' }).subscribe();
  }

  remove(id) {
    this.postsService
      .delete(id, {
        successMsg: 'Deleted Successfully'
      })
      .subscribe();
  }

  @memo()
  updateEntityLoading(id) {
    return this.loaders.updateEntity(id);
  }

  @memo()
  deleteEntityLoading(id) {
    return this.loaders.deleteEntity(id);
  }

  ngOnDestroy() {}
}
