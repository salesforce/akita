import { randEmail, randFirstName, randNumber, randStreetAddress } from '@ngneat/falso';
import { sortBy } from 'lodash';
import { map, timer } from 'rxjs';

const count = 96;
const data = [];

for (let i = 0; i < count; i++) {
  data.push({
    id: randNumber(),
    email: randEmail(),
    name: randFirstName(),
    address: randStreetAddress(),
  });
}

export function getData(params = { sortBy: 'email', perPage: 10, page: 1 }) {
  console.log('Fetching from server');
  const offset = (params.page - 1) * +params.perPage;
  const sorted = sortBy(contacts, params.sortBy);
  const paginatedItems = sorted.slice(offset, offset + +params.perPage);

  return {
    currentPage: params.page,
    perPage: +params.perPage,
    total: contacts.length,
    lastPage: Math.ceil(contacts.length / +params.perPage),
    data: paginatedItems,
  };
}

export const getContacts = function (params) {
  return timer(300).pipe(map(() => getData(params)));
};
export const contacts = data;
