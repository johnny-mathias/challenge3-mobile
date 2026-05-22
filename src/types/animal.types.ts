import {
  ID,
  OracleDate,
  Timestamp,
  YesNo,
} from './common.types';

import { Breed } from './breed.types';
import { Species } from './species.types';

export interface Animal {
  id: ID;

  name: string;
  nickname?: string;
  gender?: string;

  birthDate?: OracleDate;

  rga?: string;
  microchipCode?: string;

  isNeutered?: YesNo;

  weight?: number;
  height?: number;

  color?: string;
  status?: string;

  photoUrl?: string;

  createdAt?: Timestamp;
  updatedAt?: Timestamp;

  tSpeciesId: ID;
  tBreedId: ID;

  species?: Species;
  breed?: Breed;
}