import { ID, Timestamp } from './common.types';

export interface Species {
  id: ID;
  name: string;
  scientificName?: string;
  createdAt?: Timestamp;
}