import { ID, EntityState } from '../src/types';
import { StoreConfig } from '../src/storeConfig';
import { EntityStore } from '../src/entityStore';
import { arrayRemove } from '../src/arrayRemove';
import { arrayAdd } from '../src';

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

  it('should remove by predicate', () => {
    const article: Article = {
      id: 1,
      title: '',
      comments: [{ id: 1, text: 'a' }, { id: 2, text: 'b' }, { id: 3, text: 'c' }]
    };

    store.add(article);
    store.update(1, arrayRemove<Article, Comment>('comments', comment => comment.text === 'a'));
    expect(store._value().entities[1].comments.length).toBe(2);
    expect(store._value().entities[1].comments).toEqual([article.comments[1], article.comments[2]]);
    store.update(1, entity => ({
      comments: arrayRemove(entity.comments, 3)
    }));
    expect(store._value().entities[1].comments).toEqual([article.comments[1]]);
    store.remove();
  });

  it('should work with non-objects', () => {
    const updateNames = arrayAdd<ArticlesState, string>('names', ['a', 'b', 'c']);
    store.update(updateNames);
    expect(store._value().names).toEqual(['a', 'b', 'c']);
    const removeNames = arrayRemove<ArticlesState>('names', 'a');
    store.update(removeNames);
    expect(store._value().names).toEqual(['b', 'c']);
    const removeAll = arrayRemove<ArticlesState>('names', ['b', 'c']);
    store.update(removeAll);
    expect(store._value().names).toEqual([]);

    const updateNames2 = arrayAdd<ArticlesState, string>('names', ['a', 'b', 'c']);
    store.update(updateNames2);

    store.update(state => ({
      names: arrayRemove(state.names, 'b')
    }));
    expect(store._value().names).toEqual(['a', 'c']);
    store.update(state => ({
      names: arrayRemove(state.names, ['a', 'c'])
    }));

    expect(store._value().names).toEqual([]);
  });

  it('should remove by index', () => {
    const article: Article = {
      id: 1,
      title: '',
      comments: [{ id: 1, text: '' }, { id: 2, text: '' }]
    };

    store.add(article);
    store.update(1, state => ({
      comments: arrayRemove(state.comments, (_, index) => index === 0)
    }));

    const storeValue = store._value().entities[1];
    expect(storeValue.comments.length).toBe(1);
    expect(storeValue.comments[1]).toBeUndefined();
    expect(storeValue.comments[0].id).toBe(2);
    store.remove();
  });

  it('should remove by indexes', () => {
    const article: Article = {
      id: 1,
      title: '',
      comments: [{ id: 1, text: '' }, { id: 2, text: '' }, { id: 3, text: '' }]
    };

    store.add(article);
    store.update(1, state => ({
      comments: arrayRemove(state.comments, (_, index) => [0, 1].includes(index))
    }));

    const storeValue = store._value().entities[1];
    expect(storeValue.comments.length).toBe(1);
    expect(storeValue.comments[1]).toBeUndefined();
    expect(storeValue.comments[2]).toBeUndefined();
    expect(storeValue.comments[0].id).toBe(3);
    store.remove();
  });
});
