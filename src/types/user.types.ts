import { ID, Timestamp } from './common.types';

export interface User {
  id: ID;

  email: string;
  password?: string;
  status: string;

  createdAt?: Timestamp;
  updatedAt?: Timestamp;
  lastLoginAt?: Timestamp;
}