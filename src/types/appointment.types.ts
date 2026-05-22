import {
  ID,
  Timestamp,
} from './common.types';

import { Animal } from './animal.types';
import { UserProfile } from './user-profile.types';

export interface Appointment {
  id: ID;

  appointmentType: string;
  status: string;

  scheduledStart: Timestamp;
  scheduledEnd?: Timestamp;

  price?: number;
  notes?: string;

  createdAt?: Timestamp;
  updatedAt?: Timestamp;

  tAnimalId: ID;

  tUserProfileId: ID;
  tUserProfileId2: ID;

  animal?: Animal;

  responsibleProfile?: UserProfile;
  professionalProfile?: UserProfile;
}