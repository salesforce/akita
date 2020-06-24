import { arrayToggle, byId, byKey } from '../lib/arrayToggle';
import { EntityStore } from '../lib/entityStore';
import { StoreConfig } from '../lib/storeConfig';
import { EntityState, ID } from '../lib/types';

interface Comment {
  id: ID;
  text: string;
}

interface Article {
  id: ID;
  comments: Comment[];
  title: string;
}

interface ArticlesState extends EntityState<Article> {
  names: string[];
}

@StoreConfig({ name: 'articles' })
class ArticlesStore extends EntityStore<ArticlesState, Article> {
  constructor() {
    super({ names: [] });
  }
}

describe('arrayToggle', () => {
  let store: ArticlesStore;

  beforeEach(() => {
    store = new ArticlesStore();
  });

  afterEach(() => {
    store.destroy();
  });

  it('should add new item if none exist', () => {
    store.add({
      id: 1,
      title: '',
      comments: [],
    });

    store.update(1, (state) => {
      return {
        comments: arrayToggle(state.comments, { id: 1, text: 'comment' }, byId()),
      };
    });

    expect(store._value().entities[1].comments.length).toBe(1);
    expect(store._value().entities[1].comments[0].id).toBe(1);
    expect(store._value().entities[1].comments[0].text).toBe('comment');
  });

  it('should remove item if one exist', () => {
    store.add({
      id: 1,
      title: '',
      comments: [{ id: 1, text: 'comment' }],
    });

    store.update(1, (state) => {
      return {
        comments: arrayToggle(state.comments, { id: 1, text: 'comment' }, byKey('id')),
      };
    });

    expect(store._value().entities[1].comments.length).toBe(0);
  });
});
