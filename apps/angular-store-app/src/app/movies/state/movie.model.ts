import { ID } from '@datorama/akita';
import { Actor } from '../actors/state/actor.model';
import { Genre } from '../genres/state/genre.model';

export type Movie = {
  id: ID;
  title: string;
  genres: ID[];
  actors: ID[];
};

export interface FullMovie {
  id: ID;
  title: string;
  genres: Genre[];
  actors: Actor[];
}
