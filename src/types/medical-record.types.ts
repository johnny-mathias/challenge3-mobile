import {
  ID,
  Timestamp,
} from './common.types';

import { Animal } from './animal.types';
import { UserProfile } from './user-profile.types';
import { MedicalRecordVersion } from './medical-record-version.types';

export interface MedicalRecord {
  id: ID;

  createdAt?: Timestamp;
  updatedAt?: Timestamp;

  tAnimalId: ID;
  tUserProfileId: ID;
  tMedicalRecordVersionId: ID;

  animal?: Animal;
  userProfile?: UserProfile;

  currentVersion?: MedicalRecordVersion;
}