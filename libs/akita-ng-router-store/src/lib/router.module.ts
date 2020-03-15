import { NgModule } from '@angular/core';
import { RouterService } from './router.service';

@NgModule({})
export class AkitaNgRouterStoreModule {
  constructor(private routerService: RouterService) {
    this.routerService.init();
  }
}
