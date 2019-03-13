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
    this.createUIStore();
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
    query.ui.selectEntity(1, 'isLoading');
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
