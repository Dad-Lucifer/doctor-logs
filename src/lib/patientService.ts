import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  Timestamp,
  where,
} from 'firebase/firestore';
import { db } from './firebase';
import type { Patient, VisitNote, PatientFormData, VisitNoteFormData } from '@/types/patient';

const PATIENTS_COLLECTION = 'patients';
const VISIT_NOTES_COLLECTION = 'visitNotes';

// Patient operations
export async function getPatients(): Promise<Patient[]> {
  const patientsRef = collection(db, PATIENTS_COLLECTION);
  const q = query(patientsRef, orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt?.toDate() || new Date(),
    updatedAt: doc.data().updatedAt?.toDate() || new Date(),
  })) as Patient[];
}

export async function getPatient(id: string): Promise<Patient | null> {
  const docRef = doc(db, PATIENTS_COLLECTION, id);
  const snapshot = await getDoc(docRef);

  if (!snapshot.exists()) return null;

  const data = snapshot.data();
  return {
    id: snapshot.id,
    ...data,
    createdAt: data.createdAt?.toDate() || new Date(),
    updatedAt: data.updatedAt?.toDate() || new Date(),
  } as Patient;
}

export async function createPatient(data: PatientFormData): Promise<string> {
  const patientsRef = collection(db, PATIENTS_COLLECTION);
  const now = Timestamp.now();

  const docRef = await addDoc(patientsRef, {
    ...data,
    createdAt: now,
    updatedAt: now,
  });

  return docRef.id;
}

export async function updatePatient(id: string, data: Partial<PatientFormData>): Promise<void> {
  const docRef = doc(db, PATIENTS_COLLECTION, id);
  await updateDoc(docRef, {
    ...data,
    updatedAt: Timestamp.now(),
  });
}

export async function deletePatient(id: string): Promise<void> {
  // First delete all visit notes for this patient
  const notesRef = collection(db, VISIT_NOTES_COLLECTION);
  const q = query(notesRef, where('patientId', '==', id));
  const snapshot = await getDocs(q);

  const deletePromises = snapshot.docs.map((doc) => deleteDoc(doc.ref));
  await Promise.all(deletePromises);

  // Then delete the patient
  const docRef = doc(db, PATIENTS_COLLECTION, id);
  await deleteDoc(docRef);
}

// Visit notes operations
export async function getVisitNotes(patientId: string): Promise<VisitNote[]> {
  const notesRef = collection(db, VISIT_NOTES_COLLECTION);
  // Removed orderBy to avoid requiring a composite index immediately
  const q = query(
    notesRef,
    where('patientId', '==', patientId)
  );
  const snapshot = await getDocs(q);

  const notes = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
    visitDate: doc.data().visitDate?.toDate() || new Date(),
    createdAt: doc.data().createdAt?.toDate() || new Date(),
  })) as VisitNote[];

  // Sort in memory instead
  return notes.sort((a, b) => b.visitDate.getTime() - a.visitDate.getTime());
}

export async function createVisitNote(patientId: string, data: VisitNoteFormData): Promise<string> {
  const notesRef = collection(db, VISIT_NOTES_COLLECTION);
  const now = Timestamp.now();

  const docRef = await addDoc(notesRef, {
    patientId,
    ...data,
    visitDate: now,
    createdAt: now,
  });

  return docRef.id;
}

export async function updateVisitNote(id: string, data: Partial<VisitNoteFormData>): Promise<void> {
  const docRef = doc(db, VISIT_NOTES_COLLECTION, id);
  await updateDoc(docRef, {
    ...data,
  });
}
