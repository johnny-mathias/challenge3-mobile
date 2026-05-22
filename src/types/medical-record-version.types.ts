import {
  ID,
  Timestamp,
  YesNo,
} from './common.types';

import { Appointment } from './appointment.types';
import { MedicalRecord } from './medical-record.types';
import { UserProfile } from './user-profile.types';

export interface MedicalRecordVersion {
  id: ID;

  versionNumber: number;

  clinicalNotes?: string;

  symptomsJson?: string;
  diagnosisJson?: string;
  medicationsJson?: string;
  allergiesJson?: string;
  vaccinesJson?: string;
  vitalsJson?: string;

  attachmentsCount?: number;

  isCurrentVersion?: YesNo;

  createdAt?: Timestamp;

  tMedicalRecordId: ID;
  tAppointmentId: ID;
  tUserProfileId: ID;

  medicalRecord?: MedicalRecord;
  appointment?: Appointment;
  userProfile?: UserProfile;
}