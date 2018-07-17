import { ID } from '../../../../../../akita/src';

export type Genre = {
  id: ID;
  name: string;
};

/**
 * A factory function that creates Genres
 * @param params
 */
export function createGenre(params: Partial<Genre>) {
  return {
    ...params
  } as Genre;
}
