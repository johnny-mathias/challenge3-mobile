export interface Page<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}

export interface GuardianDTO {
  id: number;
  name: string;
  email: string;
}

export interface AnimalDTO {
  id: number;
  name: string;
  species: string;
  age: number;
  weight: number;
  guardianId: number;
}

export interface AnimalInput {
  name: string;
  species: string;
  age: number;
  weight: number;
  guardianId: number;
}

export type ClinicStatus = 'PENDING' | 'APPROVED' | 'DENIED' | 'REMOVED';

export interface ClinicDTO {
  id: number;
  name: string;
  address: string;
  phone: string;
  email: string;
  clinicStatus: ClinicStatus;
  cnpj: string;
  specialties: string[];
}

export interface AppointmentDTO {
  id: number;
  date: string;
  time: string;
  status: string;
  cancelReason?: string;
  animalId: number;
  animalName: string;
  clinicId: number;
  clinicName: string;
  veterinarianId?: number;
  veterinarianName?: string;
  guardianName: string;
}

export interface AppointmentInput {
  date: string;
  time: string;
  status: string;
  animalId: number;
  clinicId: number;
  veterinarianId?: number;
}
