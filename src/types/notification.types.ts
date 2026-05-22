import {
  ID,
  Timestamp,
} from './common.types';

import { UserProfile } from './user-profile.types';

export interface Notification {
  id: ID;

  type?: string;
  title?: string;
  message?: string;

  channel?: string;
  status?: string;

  sentAt?: Timestamp;
  readAt?: Timestamp;

  tUserProfileId: ID;

  userProfile?: UserProfile;
}