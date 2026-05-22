import {
  ID,
  OracleDate,
  Timestamp,
  YesNo,
} from './common.types';

import { User } from './user.types';

export interface UserProfile {
  id: ID;

  profileType: string;
  fullName: string;
  cpf: string;

  phone?: string;
  birthDate?: OracleDate;
  photoUrl?: string;

  isActive?: YesNo;

  createdAt?: Timestamp;
  updatedAt?: Timestamp;

  tUserId: ID;

  user?: User;
}