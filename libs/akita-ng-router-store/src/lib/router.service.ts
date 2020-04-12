import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, NavigationCancel, NavigationError, ResolveEnd, Router, RoutesRecognized } from '@angular/router';
import { ActiveRouteState, RouterStore } from './router.store';
import { RouterQuery } from './router.query';
import { action, setSkipAction } from '@datorama/akita';

@Injectable({
  providedIn: 'root'
})
export class RouterService {
  private routerStateSnapshot: any;
  private lastRoutesRecognized: any;
  private dispatchTriggeredByRouter = false;
  private navigationTriggeredByDispatch = false;
  private routerState: any;

  constructor(private routerStore: RouterStore, private routerQuery: RouterQuery, private router: Router) {}

  @action('Navigation Cancelled')
  dispatchRouterCancel(event: NavigationCancel) {
    this.update();
    this.routerQuery.__navigationCancel.next(event);
  }

  @action('Navigation Error')
  dispatchRouterError(event: NavigationError) {
    this.update();
    this.routerQuery.__navigationError.next(event);
  }

  @action('Navigation')
  dispatchRouterNavigation() {
    this.update();
  }

  init() {
    this.setUpStoreListener();
    this.setUpStateRollbackEvents();
  }

  private update() {
    this.dispatchTriggeredByRouter = true;
    this.routerStore.update((state: any) => {
      return {
        ...state,
        state: this.routerStateSnapshot,
        navigationId: this.lastRoutesRecognized ? this.lastRoutesRecognized.id : null
      };
    });
    this.dispatchTriggeredByRouter = false;
    this.navigationTriggeredByDispatch = false;
  }

  private setUpStoreListener(): void {
    this.routerQuery
      .select(state => state)
      .subscribe(s => {
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
      } else if (e instanceof ResolveEnd) {
        this.resolveEnd(e);
      } else if (e instanceof NavigationCancel) {
        this.dispatchRouterCancel(e);
      } else if (e instanceof NavigationError) {
        this.dispatchRouterError(e);
      }
    });
  }

  /**
   * The `ResolveEnd` event is always triggered after running all resolvers
   * that are linked to some route and child routes
   */
  private resolveEnd(routerStateSnapshot: ResolveEnd): void {
    this.routerStateSnapshot = this.serializeRoute(routerStateSnapshot);
    if (this.shouldDispatchRouterNavigation()) {
      this.dispatchRouterNavigation();
    }
  }

  private serializeRoute(route: ResolveEnd): ActiveRouteState {
    let state: ActivatedRouteSnapshot = route.state.root;
    while (state.firstChild) {
      state = state.firstChild;
    }
    const { params, data, queryParams, fragment } = state;

    return {
      url: route.url,
      urlAfterRedirects: route.urlAfterRedirects,
      params,
      queryParams,
      fragment,
      data,
      navigationExtras: this.router.getCurrentNavigation().extras.state
    };
  }
}
