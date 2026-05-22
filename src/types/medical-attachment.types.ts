import {
  ID,
  Timestamp,
} from './common.types';

import { MedicalRecordVersion } from './medical-record-version.types';
import { UserProfile } from './user-profile.types';

export interface MedicalAttachment {
  id: ID;

  fileName: string;
  fileType?: string;

  fileSize?: number;

  storageUrl: string;

  createdAt?: Timestamp;

  tMedicalRecordVersionId: ID;
  tUserProfileId: ID;

  medicalRecordVersion?: MedicalRecordVersion;
  userProfile?: UserProfile;
}