import { ID, EntityState } from '../src/types';
import { StoreConfig } from '../src/storeConfig';
import { EntityStore } from '../src/entityStore';
import { arrayAdd } from '../src/arrayAdd';

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

describe('arrayAdd', () => {
  it('should add one', () => {
    const article: Article = {
      id: 1,
      title: '',
      comments: []
    };

    store.add(article);
    const comment = { id: 1, text: 'comment' };
    store.update(1, arrayAdd<Article>('comments', comment));
    expect(store._value().entities[1].comments.length).toBe(1);
    expect(store._value().entities[1].comments[0]).toBe(comment);
    store.remove();
  });

  it('should add multi', () => {
    const article: Article = {
      id: 1,
      title: '',
      comments: []
    };

    store.add(article);
    const comments = [{ id: 1, text: 'comment' }, { id: 2, text: 'comment2' }];
    store.update(1, arrayAdd<Article>('comments', comments));
    expect(store._value().entities[1].comments.length).toBe(2);
    expect(store._value().entities[1].comments[0]).toBe(comments[0]);
    expect(store._value().entities[1].comments[1]).toBe(comments[1]);
    store.remove();
  });
});
