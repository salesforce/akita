# v5.0.0

- Remove `queryParamsMap` and `paramsMap` from store.
- The new state is now in the following structure:

```typescript
ActiveRouteState = {
  url: string;
  urlAfterRedirects: string;
  fragment: string;
  params: HashMap<any>;
  queryParams: HashMap<any>;
  data: HashMap<any>;
  navigationExtras: HashMap<any> | undefined;
}
```

- The state will be updated in the `resolveEnd` event. Fix [this](https://github.com/datorama/akita-ng-router-store/issues/12) issue.
- Add `navigationExtras` property.
- The default generic type of each query is `any`
