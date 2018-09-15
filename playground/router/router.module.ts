import { NgModule, ModuleWithProviders } from '@angular/core';
import { RouterStore } from './router.store';
import { RouterService } from './router.service';
import { RouterQuery } from './router.query';

@NgModule({})
export class RouterStoreModule {
  constructor(private routerService: RouterService) {
    this.routerService.init();
  }

  static forRoot(): ModuleWithProviders {
    return {
      ngModule: RouterStoreModule,
      providers: [RouterStore, RouterService, RouterQuery]
    };
  }
}
