import { Injectable, OnDestroy } from '@angular/core';
import { Router, RouterStateSnapshot, RoutesRecognized, NavigationCancel, NavigationError, ActivatedRouteSnapshot } from '@angular/router';
import { of } from 'rxjs';
import { RouterStore } from './router.store';
import {RouterQuery} from "./router.query";
import {filter} from "rxjs/operators";
import {action, toBoolean} from "@datorama/akita";
import {globalState} from "@datorama/akita/src/internal/global-state";

@Injectable({
  providedIn: 'root'
})
export class RouterService implements OnDestroy {

  private routerStateSnapshot;
  private lastRoutesRecognized: RoutesRecognized;

  constructor(private routerStore: RouterStore,
              private routerQuery: RouterQuery,
              private router: Router) {
    this.init();
  }

  @action({ type: 'Navigation Cancelled' })
  dispatchRouterCancel(event: NavigationCancel) { }

  @action({ type: 'Navigation Error' })
  dispatchRouterError(event: NavigationError) { }

  @action({ type: 'Navigation' })
  dispatchRouterNavigation() {
    this.routerStore.setState(state => {
      return {
        ...state,
        state: this.routerStateSnapshot,
        navigationId: this.lastRoutesRecognized.id
      };
    });
  }

  ngOnDestroy() {
    //
  }

  private init() {
    this.routerQuery.select(state => state).pipe(
      filter(({navigationId, state}) => toBoolean(navigationId) && toBoolean(state)))
      .subscribe(({navigationId, state}) => {
        if ((this.router as any).navigationId != navigationId) {
          globalState.setSkipAction();
          this.router.navigateByUrl(state.url);
        }
      });

    (this.router as any).hooks.beforePreactivation = (routerStateSnapshot: RouterStateSnapshot) => {
      this.routerStateSnapshot = {
        root: this.serializeRoute(routerStateSnapshot.root),
        url: routerStateSnapshot.url
      };
      this.dispatchRouterNavigation();
      return of(true);
    };

    this.router.events.subscribe(e => {
      if (e instanceof RoutesRecognized) {
        this.lastRoutesRecognized = e;
      } else if (e instanceof NavigationCancel) {
        this.dispatchRouterCancel(e);
      } else if (e instanceof NavigationError) {
        this.dispatchRouterError(e);
      }
    });
  }

  private serializeRoute(route: ActivatedRouteSnapshot): ActivatedRouteSnapshot {
    return {
      url: route.url,
      params: route.params,
      queryParams: route.queryParams,
      fragment: route.fragment,
      data: route.data,
      outlet: route.outlet,
      component: undefined,
      routeConfig: null,
      root: undefined,
      parent: undefined,
      firstChild: undefined,
      children: undefined,
      pathFromRoot: undefined,
      paramMap: route.paramMap,
      queryParamMap: route.queryParamMap,
      toString: route.toString
    };
  }

}
