import { ID } from '@datorama/akita';

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
