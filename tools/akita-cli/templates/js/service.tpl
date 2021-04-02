import { {{ camelCase name }}Store } from './{{dashCase name}}.store';

export async function update(id, data) {
  await Promise.resolve();
  {{ camelCase name }}Store.update(id, data);
}

export async function remove(id) {
  await Promise.resolve();
  {{ camelCase name }}Store.remove(id);
}
