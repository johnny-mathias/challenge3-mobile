import {
  ID,
  OracleDate,
  Timestamp,
  YesNo,
} from './common.types';

import { Animal } from './animal.types';
import { UserProfile } from './user-profile.types';

export interface AnimalResponsibility {
  id: ID;

  relationType: string;

  isPrimary?: YesNo;

  startDate?: OracleDate;
  endDate?: OracleDate;

  createdAt?: Timestamp;

  tAnimalId: ID;
  tUserProfileId: ID;

  animal?: Animal;
  userProfile?: UserProfile;
}