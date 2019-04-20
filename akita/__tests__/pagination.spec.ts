import { Todo, TodosStore } from './setup';
import { QueryEntity } from '../src/queryEntity';
import { PaginationResponse, PaginatorPlugin } from '../src/plugins/paginator/paginatorPlugin';
import { switchMap } from 'rxjs/operators';
import { Observable, of, timer } from 'rxjs';

let store = new TodosStore();

class TodosQuery extends QueryEntity<any, Todo> {
  constructor() {
    super(store);
  }
}

const query = new TodosQuery();
const paginator = new PaginatorPlugin(query);

const count = 100;
const data = [];

for (let i = 0; i < count; i++) {
  data.push({
    id: i + 1,
    email: `email ${i + 1}`
  });
}

export function getData(params = { sortBy: 'email', perPage: 10, page: 1 }) {
  const offset = (params.page - 1) * +params.perPage;
  const paginatedItems = data.slice(offset, offset + +params.perPage);

  return {
    currentPage: params.page,
    perPage: +params.perPage,
    total: data.length,
    lastPage: Math.ceil(data.length / +params.perPage),
    data: paginatedItems
  };
}

const getContacts = function(params): Observable<PaginationResponse<any>> {
  return of(getData(params));
};

describe('Paginator', () => {
  let res;
  const requestFunc = jest.fn();

  paginator.pageChanges
    .pipe(
      switchMap(page => {
        const req = requestFunc.mockReturnValue(
          getContacts({
            page,
            perPage: 10
          })
        );

        return paginator.getPage(req);
      })
    )
    .subscribe(v => {
      res = v;
    });

  it('should set the pagination params', () => {
    expect(paginator.currentPage).toEqual(1);
    expect(paginator.pagination.currentPage).toEqual(1);
    expect(paginator.pagination.perPage).toEqual(10);
    expect(paginator.pagination.total).toEqual(100);
    expect(paginator.pagination.lastPage).toEqual(10);
    expect(paginator.pagination.data.length).toEqual(10);
  });

  it('should call the request function only in first time', () => {
    spyOn(paginator, 'update').and.callThrough();
    spyOn(paginator, 'setLoading').and.callThrough();
    spyOn(paginator, 'selectPage').and.callThrough();
    paginator.nextPage();
    expect(requestFunc).toHaveBeenCalledTimes(2);
    expect(paginator.update).toHaveBeenCalledTimes(1);
    expect(paginator.selectPage).toHaveBeenCalledTimes(1);
    expect(paginator.setLoading).toHaveBeenCalledTimes(2);
    paginator.setPage(2);
    expect(paginator.update).toHaveBeenCalledTimes(1);
    expect(paginator.setLoading).toHaveBeenCalledTimes(2);
    expect(paginator.selectPage).toHaveBeenCalledTimes(1);
    expect(paginator.selectPage).toHaveBeenCalledWith(2);
    expect(requestFunc).toHaveBeenCalledTimes(2);
  });

  it('should update the store', () => {
    expect(query.getAll().length).toEqual(20);
  });

  it('should have in cache page 1 and 2', () => {
    expect(paginator.hasPage(1)).toBeTruthy();
    expect(paginator.hasPage(2)).toBeTruthy();
  });

  it('should return the first page from cache', () => {
    paginator.setPage(1);
    expect(requestFunc).toHaveBeenCalledTimes(2);
    expect(res).toEqual({
      currentPage: 1,
      perPage: 10,
      total: 100,
      lastPage: 10,
      data: [
        { id: 1, email: 'email 1' },
        { id: 2, email: 'email 2' },
        { id: 3, email: 'email 3' },
        { id: 4, email: 'email 4' },
        { id: 5, email: 'email 5' },
        { id: 6, email: 'email 6' },
        { id: 7, email: 'email 7' },
        { id: 8, email: 'email 8' },
        { id: 9, email: 'email 9' },
        { id: 10, email: 'email 10' }
      ]
    });
  });

  it('should fetch page 3', () => {
    expect(paginator.hasPage(3)).toBeFalsy();
    paginator.setPage(3);
    expect(requestFunc).toHaveBeenCalledTimes(3);
    expect(paginator.currentPage).toEqual(3);
  });

  describe('isFirst', () => {
    it('should return false', () => {
      expect(paginator.isFirst).toBeFalsy();
    });
    it('should return true', () => {
      paginator.setPage(1);
      expect(paginator.isFirst).toBeTruthy();
    });
  });

  describe('isLast', () => {
    it('should return false', () => {
      expect(paginator.isLast).toBeFalsy();
    });
    it('should return true', () => {
      paginator.setPage(10);
      expect(paginator.isLast).toBeTruthy();
    });
  });

  describe('isPageActive', () => {
    it('should return false', () => {
      expect(paginator.isPageActive(1)).toBeFalsy();
    });
    it('should return true', () => {
      expect(paginator.isPageActive(10)).toBeTruthy();
    });
  });

  describe('setPage', () => {
    it('should set the page', () => {
      paginator.setPage(2);
      expect(paginator.currentPage).toEqual(2);
    });
    it('should not call next() if equal to current page', () => {
      spyOn(paginator.page, 'next');
      paginator.setPage(2);
      expect(paginator.page.next).not.toHaveBeenCalled();
    });
  });

  describe('nextPage', () => {
    it('should set the next page', () => {
      paginator.nextPage();
      expect(paginator.currentPage).toEqual(3);
    });
    it('should not set if current page is last', () => {
      spyOn(paginator, 'setPage').and.callThrough();
      paginator.setLastPage();
      paginator.nextPage();
      expect(paginator.setPage).toHaveBeenCalledTimes(1);
    });
  });

  describe('prevPage', () => {
    it('should set the prev page', () => {
      paginator.prevPage();
      expect(paginator.currentPage).toEqual(9);
    });
    it('should not set if current page is first', () => {
      spyOn(paginator, 'setPage').and.callThrough();
      paginator.setFirstPage();
      paginator.prevPage();
      expect(paginator.setPage).toHaveBeenCalledTimes(1);
    });
  });

  it('should set first page', () => {
    paginator.setFirstPage();
    expect(paginator.currentPage).toEqual(1);
  });

  it('should set last page', () => {
    paginator.setLastPage();
    expect(paginator.currentPage).toEqual(10);
  });

  describe('from and to', () => {
    it('it should not set page controls by default', () => {
      expect(res.from).toBeUndefined();
      expect(res.to).toBeUndefined();
    });
    it('it should set from and to', () => {
      paginator.withRange();
      paginator.setFirstPage();
      expect(res.from).toEqual(1);
      expect(res.to).toEqual(10);
    });
    it('it should set from and to - 2', () => {
      paginator.withRange();
      paginator.nextPage();
      expect(res.from).toEqual(11);
      expect(res.to).toEqual(20);
    });
  });

  describe('page controls', () => {
    it('it should not set page controls by default', () => {
      paginator.setFirstPage();
      expect(res.pageControls).toBeUndefined();
    });
    it('it should set from and to - 2', () => {
      paginator.withControls();
      paginator.setLastPage();
      expect(res.pageControls.length).toEqual(10);
    });
  });

  describe('clear cache', () => {
    it('it clear the provided page', () => {
      requestFunc.mockClear();
      paginator.setPage(3);
      expect(requestFunc).toHaveBeenCalledTimes(1);
      expect(paginator.hasPage(3)).toBeTruthy();
      paginator.clearPage(3);
      expect(paginator.hasPage(3)).toBeFalsy();
    });
    it('it should clear all', () => {
      paginator.clearCache();
      requestFunc.mockClear();
      expect(paginator.pages).toEqual(new Map());
      paginator.setPage(1);
      expect(requestFunc).toHaveBeenCalledTimes(1);
      paginator.setPage(2);
      expect(requestFunc).toHaveBeenCalledTimes(2);
      paginator.setPage(1);
      expect(requestFunc).toHaveBeenCalledTimes(2);
      paginator.setPage(2);
      expect(requestFunc).toHaveBeenCalledTimes(2);
    });
  });
});

let store2 = new TodosStore();

class Todos2Query extends QueryEntity<any, Todo> {
  constructor() {
    super(store2);
  }
}

describe('cacheTimeout', () => {
  jest.useFakeTimers();
  const query2 = new Todos2Query();
  const paginator2 = new PaginatorPlugin(query2, { cacheTimeout: timer(15000) });
  const requestFunc = jest.fn();

  paginator2.pageChanges
    .pipe(
      switchMap(page => {
        const req = requestFunc.mockReturnValue(
          getContacts({
            page,
            perPage: 10
          })
        );
        return paginator2.getPage(req);
      })
    )
    .subscribe();

  it('should clear cache when cacheTimeout emits', () => {
    spyOn(paginator2, 'clearCache').and.callThrough();
    expect(query2.getAll().length).toEqual(10);
    expect(requestFunc).toHaveBeenCalledTimes(1);
    jest.runAllTimers();
    expect(paginator2.hasPage(1)).toBeFalsy();
    paginator2.setPage(1);
    expect(paginator2.hasPage(1)).toBeTruthy();
    expect(requestFunc).toHaveBeenCalledTimes(2);
    expect(paginator2.clearCache).toHaveBeenCalledTimes(1);
  });
});
