import { Directive, Input, OnDestroy, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { AuthQuery } from './state/auth.query';
import { untilDestroyed } from 'ngx-take-until-destroy';

@Directive({
  selector: '[showIfLoggedIn]'
})
export class IsLoggedInDirective implements OnInit, OnDestroy {
  @Input('showIfLoggedIn') renderTemplate = true;

  constructor(private authQuery: AuthQuery, private vcr: ViewContainerRef, private tpl: TemplateRef<any>) {
  }

  ngOnInit() {
    this.authQuery.isLoggedIn$.pipe(untilDestroyed(this)).subscribe(isLoggedIn => {
      this.vcr.clear();
      if ( isLoggedIn && this.renderTemplate ) {
        this.vcr.createEmbeddedView(this.tpl);
      }

      if ( !isLoggedIn && !this.renderTemplate ) {
        this.vcr.createEmbeddedView(this.tpl);
      }
    });
  }

  ngOnDestroy() {
  }

}
