import { ID } from '../../../../../akita/src';
import { Genre } from '../genres/state';
import { Actor } from '../actors/state';

export type Movie = {
  id: ID;
  title: string;
  genres: (ID | Genre)[];
  actors: (ID | Actor)[];
};
