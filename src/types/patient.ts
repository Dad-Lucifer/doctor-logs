export interface Patient {
  id: string;
  name: string;
  age: number;
  disease: string;
  diagnosis?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface VisitNote {
  id: string;
  patientId: string;
  note: string;
  medicines: string;
  visitDate: Date;
  createdAt: Date;
}

export interface PatientFormData {
  name: string;
  age: number;
  disease: string;
  diagnosis?: string;
}

export interface VisitNoteFormData {
  note: string;
  medicines: string;
}
