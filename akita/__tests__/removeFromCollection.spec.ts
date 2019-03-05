import { ID, EntityState } from '../src/types';
import { StoreConfig } from '../src/storeConfig';
import { EntityStore } from '../src/entityStore';
import { arrayRemove } from '../src/arrayRemove';

interface Comment {
  id: ID;
  text: string;
}

interface Article {
  id: ID;
  comments: Comment[];
  title: string;
}

interface ArticlesState extends EntityState<Article> {}

@StoreConfig({ name: 'articles' })
class ArticlesStore extends EntityStore<ArticlesState, Article> {}

const store = new ArticlesStore();

describe('arrayRemove', () => {
  it('should remove one', () => {
    const article: Article = {
      id: 1,
      title: '',
      comments: [{ id: 1, text: '' }, { id: 2, text: '' }]
    };

    store.add(article);
    store.update(1, arrayRemove<Article>('comments', 2));
    expect(store._value().entities[1].comments.length).toBe(1);
    expect(store._value().entities[1].comments[1]).toBeUndefined();
    store.remove();
  });

  it('should remove multi', () => {
    const article: Article = {
      id: 1,
      title: '',
      comments: [{ id: 1, text: '' }, { id: 2, text: '' }, { id: 3, text: '' }]
    };

    store.add(article);
    store.update(1, arrayRemove<Article>('comments', [1, 3]));
    expect(store._value().entities[1].comments.length).toBe(1);
    expect(store._value().entities[1].comments).toEqual([article.comments[1]]);
    store.remove();
  });
});
