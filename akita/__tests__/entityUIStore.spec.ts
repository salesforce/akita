import { EntityState, EntityStore, EntityUIStore, ID, QueryEntity, StoreConfig } from '../src';
import { EntityUIQuery } from '../src/queryEntity';

interface Article {
  id: ID;
  title: string;
}

interface ArticleUI {
  isLoading: boolean;
  isOpen: boolean;
}

interface ArticlesState extends EntityState<Article> {}

interface ArticlesUIState extends EntityState<ArticleUI> {
  rootProp: string;
}

@StoreConfig({ name: 'articles' })
class ArticlesStore extends EntityStore<ArticlesState, Article> {
  ui: EntityUIStore<ArticlesUIState, ArticleUI>;

  constructor() {
    super();
    this.createUIStore().setInitialEntityState(entity => ({ isLoading: false, isOpen: true }));
  }
}

class ArticlesQuery extends QueryEntity<ArticlesState, Article> {
  ui: EntityUIQuery<ArticlesUIState, ArticleUI>;

  constructor(store) {
    super(store);
    this.createUIQuery();
  }
}

const store = new ArticlesStore();
const query = new ArticlesQuery(store);

describe('EntityUIState', () => {
  it('should create a ui store', () => {
    expect(store.ui).toBeInstanceOf(EntityStore);
  });

  it('should create a ui query', () => {
    expect(query.ui).toBeInstanceOf(QueryEntity);
  });

  it('should set the default state when add entity to the store and remove it upon delete', () => {
    spyOn(store.ui, 'set').and.callThrough();
    spyOn(store.ui, 'add').and.callThrough();

    store.set([{ id: 1, title: 'hello' }, { id: 2, title: 'hello2' }]);
    expect(store.ui.set).toHaveBeenCalledTimes(1);
    expect(store.ui.add).not.toHaveBeenCalled();
    expect(store.ui._value().ids.length).toBe(2);
    expect(store.ui._value().entities).toEqual({
      1: {
        id: 1,
        isLoading: false,
        isOpen: true
      },
      2: {
        id: 2,
        isLoading: false,
        isOpen: true
      }
    });

    store.add([{ id: 3, title: 'hello3' }, { id: 4, title: 'hello4' }]);
    expect(store.ui.add).toHaveBeenCalledTimes(1);
    expect(store.ui._value().ids.length).toBe(4);
    expect(store.ui._value().entities).toEqual(
      expect.objectContaining({
        3: {
          id: 3,
          isLoading: false,
          isOpen: true
        },
        4: {
          id: 4,
          isLoading: false,
          isOpen: true
        }
      })
    );

    store.remove(2);
    expect(store.ui._value().entities[2]).toBeUndefined();
    expect(store.ui._value().ids.length).toBe(3);
  });

  it('should destroy the ui store when destroying the parent store', () => {
    spyOn(store.ui, 'destroy').and.callThrough();
    store.destroy();
    expect(store.ui.destroy).toHaveBeenCalledTimes(1);
  });
});

@StoreConfig({ name: 'articles' })
class Articles2Store extends EntityStore<ArticlesState, Article, ArticleUI> {
  constructor() {
    super();
    this.createUIStore({}, { storeName: 'myname' });
  }
}

const store2 = new Articles2Store();

describe('EntityUIState - custom options', () => {
  it('should set the name', () => {
    expect((store2 as any).ui).toBeInstanceOf(EntityStore);
    expect((store2 as any).ui.storeName).toBe('myname');
  });
});
