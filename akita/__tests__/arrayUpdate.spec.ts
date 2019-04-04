import { ID, EntityState } from '../src/types';
import { StoreConfig } from '../src/storeConfig';
import { EntityStore } from '../src/entityStore';
import { arrayUpdate } from '../src/arrayUpdate';

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
    super({ names: ['a', 'b', 'c'] });
  }
}

const store = new ArticlesStore();

describe('arrayUpdate', () => {
  it('should update one', () => {
    const article: Article = {
      id: 1,
      title: 'title',
      comments: [{ id: 1, text: 'comment' }, { id: 2, text: 'comment2' }]
    };

    store.add(article);

    store.update(1, arrayUpdate<Article, Comment>('comments', 2, { text: 'updated' }));
    expect(store._value().entities[1].comments[1].text).toBe('updated');
    expect(store._value().entities[1].id).toBe(1);
    expect(store._value().entities[1].title).toBe('title');
    store.remove();
  });

  it('should update many', () => {
    const article: Article = {
      id: 1,
      title: '',
      comments: [{ id: 1, text: 'comment' }, { id: 2, text: 'comment2' }, { id: 3, text: 'comment3' }]
    };

    store.add(article);

    store.update(1, arrayUpdate<Article, Comment>('comments', [1, 3], { text: 'updated' }));

    expect(store._value().entities[1].comments[0].text).toBe('updated');
    expect(store._value().entities[1].comments[1].text).toBe('comment2');
    expect(store._value().entities[1].comments[2].text).toBe('updated');
    store.update(1, entity => ({
      comments: arrayUpdate(entity.comments, 1, { text: 'NEW' })
    }));
    expect(store._value().entities[1].comments[0].text).toBe('NEW'); // id = 1
    store.remove();
  });

  it('should update by predicate', () => {
    const article: Article = {
      id: 1,
      title: '',
      comments: [{ id: 1, text: 'comment' }, { id: 2, text: 'comment2' }, { id: 3, text: 'comment3' }]
    };

    store.add(article);

    store.update(1, arrayUpdate<Article, Comment>('comments', comment => comment.text === 'comment2', { text: 'updated' }));

    expect(store._value().entities[1].comments[0].text).toBe('comment');
    expect(store._value().entities[1].comments[1].text).toBe('updated');
    expect(store._value().entities[1].comments[2].text).toBe('comment3');
    store.remove();
  });

  it('should update support a different id key', () => {
    const article: Article = {
      id: 1,
      title: '',
      comments: [{ _id: 1, text: 'comment' } as any, { _id: 2, text: 'comment2' } as any]
    };

    store.add(article);

    store.update(1, arrayUpdate<Article, Comment>('comments', 2, { text: 'updated' }, '_id'));

    expect(store._value().entities[1].comments[0].text).toBe('comment');
    expect(store._value().entities[1].comments[1].text).toBe('updated');
    store.remove();
  });

  it('should work with non-objects', () => {
    const updateName = arrayUpdate<ArticlesState, string>('names', 'b', 'newName');
    store.update(updateName);
    expect(store._value().names).toEqual(['a', 'newName', 'c']);
    const updateNames = arrayUpdate<ArticlesState, string>('names', ['a', 'newName', 'c'], 'NEW');
    store.update(updateNames);
    expect(store._value().names).toEqual(['NEW', 'NEW', 'NEW']);

    store.update(state => ({
      names: arrayUpdate(state.names, 'NEW', 'NEWNEW')
    }));
    expect(store._value().names).toEqual(['NEWNEW', 'NEWNEW', 'NEWNEW']);
  });
});
