import { skip, take } from 'rxjs/operators';
import { createWidget, createWidgetCompleted, WidgetsQuery, WidgetsStore } from './setup';
import { AkitaFiltersPlugin } from '../src/plugins/akita-filters/akita-filters-plugin';
import { Order } from '../src/internal/sort';

const widgetsStore = new WidgetsStore();
const widgetsQuery = new WidgetsQuery(widgetsStore);
const filters = new AkitaFiltersPlugin(widgetsQuery);

describe('AkitaFiltersPlugin', () => {
  describe('Manages Filters', () => {
    describe('Filters', () => {
      beforeEach(() => {
        filters.filtersStore.remove();

        filters.setFilter({ id: 'filter1', predicate: filter => filter.id % 2 === 0 });
        filters.setFilter({ id: 'filter2', predicate: filter => filter });
        filters.setFilter({ id: 'filter3', predicate: filter => filter });
      });

      it('should take all filters by default', () => {
        expect(filters.filtersQuery.getCount()).toEqual(3);
        expect(filters.filtersQuery.hasEntity('filter1')).toEqual(true);
        expect(filters.filtersQuery.hasEntity('filter2')).toEqual(true);
        expect(filters.filtersQuery.hasEntity('filter3')).toEqual(true);
      });

      it('should add filter if not exist with all default values', () => {
        filters.setFilter({ id: 'filter4', predicate: filter => filter.id });
        expect(filters.filtersQuery.getCount()).toEqual(4);
        expect(filters.filtersQuery.getEntity('filter4').id).toEqual('filter4');
        expect(filters.filtersQuery.getEntity('filter4').hide).toEqual(false);
        expect(filters.filtersQuery.getEntity('filter4').name).toBeUndefined();
        expect(filters.filtersQuery.getEntity('filter4').order).toEqual(10);
      });

      it('should update filter if exist with new value', () => {
        filters.setFilter({ id: 'filter3', hide: true, name: 'Filter 3', order: 2 });
        expect(filters.filtersQuery.getCount()).toEqual(3);
        expect(filters.filtersQuery.getEntity('filter3').id).toEqual('filter3');
        expect(filters.filtersQuery.getEntity('filter3').hide).toEqual(true);
        expect(filters.filtersQuery.getEntity('filter3').name).toEqual('Filter 3');
        expect(filters.filtersQuery.getEntity('filter3').order).toEqual(2);

        filters.setFilter({ id: 'filter2', value: 'aaaa' });
        expect(filters.filtersQuery.getEntity('filter2').value).toEqual('aaaa');
        expect(filters.filtersQuery.getEntity('filter2').name).toEqual('Filter2: aaaa');
      });

      it('should remove filter 2', () => {
        filters.removeFilter('filter2');
        expect(filters.filtersQuery.getCount()).toEqual(2);
        expect(filters.filtersQuery.hasEntity('filter1')).toEqual(true);
        expect(filters.filtersQuery.hasEntity('filter2')).toEqual(false);
        expect(filters.filtersQuery.hasEntity('filter3')).toEqual(true);
      });

      it('should set / get value  ', () => {
        filters.setFilter({ id: 'filter1', value: true });
        filters.setFilter({ id: 'filter2', value: 'aaaa' });
        expect(filters.filtersQuery.getEntity('filter1').value).toEqual(true);
        expect(filters.getFilterValue('filter1')).toEqual(true);

        expect(filters.filtersQuery.getEntity('filter2').value).toEqual('aaaa');
        expect(filters.getFilterValue('filter2')).toEqual('aaaa');

        expect(filters.filtersQuery.getEntity('filter3').value).toBeUndefined();
        expect(filters.getFilterValue('filter3')).toBeNull();
      });

      it('should call getFilters() and get only filters not hidden ', () => {
        filters.setFilter({ id: 'filter2', hide: true });
        const filtersAll = filters.getFilters();

        expect(filtersAll.length).toEqual(2);
        expect(filtersAll[0].id).toEqual('filter1');
        expect(filtersAll[1].id).toEqual('filter3');
      });
    });
    describe('SelectAll with Filters ', () => {
      beforeEach(() => {
        widgetsStore.remove();
        filters.filtersStore.remove();
        widgetsStore.add([createWidget(1), createWidget(2), createWidget(3), createWidget(4)]);
        widgetsStore.update(2, { complete: true });
        widgetsStore.update(3, { complete: true });
      });

      it('should select all if no filters', () => {
        filters
          .selectAllByFilters()
          .pipe(take(1))
          .subscribe(result => {
            expect(Array.isArray(result)).toBeTruthy();
            expect(result.length).toEqual(4);
            expect(result[0].id).toEqual(1);
            expect(result[1].id).toEqual(2);
            expect(result[2].id).toEqual(3);
            expect(result[3].id).toEqual(4);
          });
      });

      it('should apply filter if provided when select all', () => {
        filters.setFilter({ id: 'filter1', predicate: filter => filter.id % 2 === 1 });

        filters
          .selectAllByFilters()
          .pipe(take(1))
          .subscribe(result => {
            expect(Array.isArray(result)).toBeTruthy();
            expect(result.length).toEqual(2);
            expect(result[0].id).toEqual(1);
            expect(result[1].id).toEqual(3);
          });
      });

      it('should apply 2 filter if provided when select all', () => {
        filters.setFilter({ id: 'filter1', predicate: filter => filter.id % 2 === 1 });
        filters.setFilter({ id: 'filter2', predicate: filter => filter.complete });

        filters
          .selectAllByFilters()
          .pipe(take(1))
          .subscribe(result1 => {
            expect(Array.isArray(result1)).toBeTruthy();
            expect(result1.length).toEqual(1);
            expect(result1[0].id).toEqual(3);
          });
      });

      it('should apply 2 filter in current order if provided when select all', () => {
        filters.setFilter({ id: 'filter2', predicate: filter => filter.complete });
        filters.setFilter({ id: 'filter1', predicate: filter => filter.id % 2 === 1 });

        filters
          .selectAllByFilters()
          .pipe(take(1))
          .subscribe(result2 => {
            expect(Array.isArray(result2)).toBeTruthy();
            expect(result2.length).toEqual(1);
            expect(result2[0].id).toEqual(3);

          });
      });

      it('should apply 2 filter with specified order if order is specified when select all', () => {
        filters.setFilter({ id: 'filter1', predicate: filter => filter.id % 2 === 1, order: 2 });
        filters.setFilter({ id: 'filter2', predicate: filter => filter.complete, order: 1 });

        filters
          .selectAllByFilters()
          .pipe(take(1))
          .subscribe(result2 => {
            expect(Array.isArray(result2)).toBeTruthy();
            expect(result2.length).toEqual(1);
            expect(result2[0].id).toEqual(3);
          });
      });
    });

    describe('SelectAll when any change in filter, or entities', () => {
      jest.useFakeTimers();

      beforeEach(() => {
        widgetsStore.remove();
        filters.filtersStore.remove();
        widgetsStore.add([createWidget(1), createWidgetCompleted(2), createWidgetCompleted(3), createWidget(4)]);
      });

      it('should call set filter must send a new value', done3 => {
        jest.setTimeout(2000);
        let count = 0;
        filters
          .selectAllByFilters()
          .pipe(
            skip(1),
            take(1)
          )
          .subscribe(result2 => {
            expect(Array.isArray(result2)).toBeTruthy();
            expect(result2.length).toEqual(2);
            expect(result2[0].id).toEqual(2);
            expect(result2[1].id).toEqual(3);

            done3();
          });

        jest.runAllTimers();
        filters.setFilter({ id: 'filter2', predicate: filter => filter.complete });
        jest.runAllTimers();
      });

      it('should send a new value when add new entity', done3 => {
        jest.setTimeout(3000);
        let count = 0;
        filters.setFilter({ id: 'filter2', predicate: filter => filter.complete });

        filters
          .selectAllByFilters()
          .pipe(
            skip(1),
            take(1)
          )
          .subscribe(result2 => {
            expect(Array.isArray(result2)).toBeTruthy();
            expect(result2.length).toEqual(3);
            expect(result2[0].id).toEqual(2);
            expect(result2[1].id).toEqual(3);
            expect(result2[2].id).toEqual(6);

            done3();
          });

        jest.runAllTimers();
        widgetsStore.add(createWidgetCompleted(6));
        jest.runAllTimers();
      });
    });

    describe('SelectALL with Sort ', () => {
      jest.useFakeTimers();

      beforeEach(() => {
        widgetsStore.remove();
        filters.filtersStore.remove();
        widgetsStore.add([createWidget(1), createWidget(2), createWidget(3), createWidget(4)]);
        widgetsStore.update(2, { complete: true });
        widgetsStore.update(3, { complete: true });
      });

      it('should not sort if no sort specified', () => {
        filters
          .selectAllByFilters()
          .pipe(take(1))
          .subscribe(result => {
            expect(Array.isArray(result)).toBeTruthy();
            expect(result.length).toEqual(4);
            expect(result[0].id).toEqual(1);
            expect(result[1].id).toEqual(2);
            expect(result[2].id).toEqual(3);
            expect(result[3].id).toEqual(4);
          });
      });

      it('should apply sort if provided in other sens', () => {
        jest.setTimeout(1000);

        filters.setSortBy({ sortBy: 'id', sortByOrder: Order.DESC });
        jest.runAllTimers();

        filters
          .selectAllByFilters()
          .pipe(take(1))
          .subscribe(result => {
            expect(Array.isArray(result)).toBeTruthy();
            expect(result.length).toEqual(4);
            expect(result[0].id).toEqual(4);
            expect(result[1].id).toEqual(3);
            expect(result[2].id).toEqual(2);
            expect(result[3].id).toEqual(1);
          });
      });

      it('should apply filter and sort', () => {
        filters.setSortBy({ sortBy: 'id', sortByOrder: Order.DESC });
        filters.setFilter({ id: 'filter1', predicate: filter => filter.id % 2 === 1 });

        filters
          .selectAllByFilters()
          .pipe(take(1))
          .subscribe(result => {
            expect(Array.isArray(result)).toBeTruthy();
            expect(result.length).toEqual(2);
            expect(result[0].id).toEqual(3);
            expect(result[1].id).toEqual(1);
          });
      });
    });
  });
});
