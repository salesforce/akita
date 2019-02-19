import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, NavigationCancel, NavigationError, Router, RouterStateSnapshot, RoutesRecognized } from '@angular/router';
import { of } from 'rxjs';
import { RouterStore } from './router.store';
import { RouterQuery } from './router.query';
import { action } from '../../akita/src';
import { setSkipAction } from '../../akita/src/actions';

@Injectable({
  providedIn: 'root'
})
export class RouterService {
  private routerStateSnapshot;
  private lastRoutesRecognized: RoutesRecognized;
  private dispatchTriggeredByRouter = false;
  private navigationTriggeredByDispatch = false;
  private routerState;

  constructor(private routerStore: RouterStore, private routerQuery: RouterQuery, private router: Router) {}

  @action('Navigation Cancelled')
  dispatchRouterCancel(event: NavigationCancel) {
    this.update();
  }

  @action('Navigation Error')
  dispatchRouterError(event: NavigationError) {
    this.update();
  }

  @action('Navigation')
  dispatchRouterNavigation() {
    this.update();
  }

  init() {
    this.setUpRouterHook();
    this.setUpStoreListener();
    this.setUpStateRollbackEvents();
  }

  private update() {
    this.dispatchTriggeredByRouter = true;
    this.routerStore._setState(state => {
      return {
        ...state,
        state: this.routerStateSnapshot,
        navigationId: this.lastRoutesRecognized.id
      };
    });
    this.dispatchTriggeredByRouter = false;
    this.navigationTriggeredByDispatch = false;
  }

  /**
   * Hook into the angular router before each navigation action is performed
   * since the route tree can be large, we serialize it into something more manageable
   */
  private setUpRouterHook(): void {
    (this.router as any).hooks.beforePreactivation = (routerStateSnapshot: RouterStateSnapshot) => {
      this.routerStateSnapshot = {
        root: this.serializeRoute(routerStateSnapshot.root),
        url: routerStateSnapshot.url
      };
      if (this.shouldDispatchRouterNavigation()) this.dispatchRouterNavigation();
      return of(true);
    };
  }

  private setUpStoreListener(): void {
    this.routerQuery.select(state => state).subscribe(s => {
      this.routerState = s;
      this.navigateIfNeeded();
    });
  }

  private shouldDispatchRouterNavigation(): boolean {
    if (!this.routerState) return true;
    return !this.navigationTriggeredByDispatch;
  }

  private navigateIfNeeded(): void {
    if (!this.routerState || !this.routerState.state) {
      return;
    }
    if (this.dispatchTriggeredByRouter) return;

    if (this.router.url !== this.routerState.state.url) {
      this.navigationTriggeredByDispatch = true;
      setSkipAction();
      this.router.navigateByUrl(this.routerState.state.url);
    }
  }

  private setUpStateRollbackEvents(): void {
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

  private serializeRoute(route: ActivatedRouteSnapshot): Partial<ActivatedRouteSnapshot> {
    let state: ActivatedRouteSnapshot = route.root;
    while (state.firstChild) {
      state = state.firstChild;
    }

    const { params } = state;

    return {
      url: route.url,
      params,
      queryParams: route.queryParams,
      fragment: route.fragment,
      data: route.data,
      paramMap: route.paramMap,
      queryParamMap: route.queryParamMap
    };
  }
}
