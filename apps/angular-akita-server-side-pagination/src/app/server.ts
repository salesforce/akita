import * as faker from 'faker';
import { timer } from 'rxjs';
import { mapTo } from 'rxjs/operators';
import { sortBy } from 'lodash';

const count = 96;
const data = [];

for (let i = 0; i < count; i++) {
  data.push({
    id: faker.random.number(),
    email: faker.internet.email(),
    name: faker.name.findName(),
    address: faker.address.streetAddress()
  });
}

export function getData(params) {
  console.log('Fetching from server');
  const merged = { ...{ sortBy: 'email', perPage: 10 }, ...params };
  const offset = (merged.page - 1) * +merged.perPage;
  const sorted = sortBy(data, merged.sortBy);
  const paginatedItems = sorted.slice(offset, offset + +merged.perPage);

  return {
    currentPage: merged.page,
    perPage: +merged.perPage,
    total: data.length,
    lastPage: Math.ceil(data.length / +merged.perPage),
    data: paginatedItems
  };
}

export const getContacts = function(params) {
  return timer(1000).pipe(mapTo(getData(params)));
};
