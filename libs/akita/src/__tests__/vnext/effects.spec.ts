// store.attachEffect((commits$) =>
//   commits$.pipe(
//     ofType(Update.Type()),
//     tap((x) => console.log(x)),
//     // mergeMapTo(EMPTY)
//     filter(({ action: { type, args: [state] } }) => state.name === 'error' ), switchMapTo(of(update({ name: 'error2'})))
//   )
// ); //,  filter(({ action: { type, args: [state] } }) => state.name === 'error' ), switchMapTo(of(update({ name: 'error2'})))))

// store.attachMiddleware((store, apply) => {
//   return (commit) => {
//     console.log(commit);
//     return apply(update({ name: 'error2'}));
//   }
// })

import { of } from 'rxjs';
import { filter, switchMapTo } from 'rxjs/operators';
import { EntityState, EntityStore, StoreConfig } from '../../lib';
import { ofType } from '../../lib/actions/core/committed';
import { Update, update } from '../../lib/actions/index';

interface Todo {
  id: number;
  title: string;
  done?: boolean;
}

interface TodosState extends EntityState<Todo, number> {
  name?: string;
}

@StoreConfig({ name: 'TodosStore' })
class TodosStore extends EntityStore<TodosState> {}

describe('commit action', () => {
  let store: TodosStore;

  afterAll(() => {
    if (store) {
      store.destroy();
      store = undefined;
    }
  });

  it('dispatch subsequent action', () => {
    store = new TodosStore({});
    store.attachEffect((commits$) =>
      commits$.pipe(
        ofType(Update.Type()),
        filter(
          ({
            action: {
              type,
              args: [state],
            },
          }) => state.name === 'error'
        ),
        switchMapTo(of(update({ name: 'error2' })))
      )
    );

    expect(store._value().name).toBeUndefined();
    store.apply(update({ name: 'error' }));
    expect(store._value().name).toEqual('error2');
  });
});
