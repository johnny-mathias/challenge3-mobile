import {
  ID,
  Timestamp,
} from './common.types';

export interface Log {
  id: ID;

  procedureName: string;
  userName: string;

  errorDate?: Timestamp;
  errorCode?: number;
  errorMessage?: string;
}