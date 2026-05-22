import { ID } from './common.types';
import { Species } from './species.types';

export interface Breed {
  id: ID;
  name: string;
  port: string;
  predispositionJson?: string;

  tSpeciesId: ID;

  species?: Species;
}