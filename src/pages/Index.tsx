import { useState, useEffect } from 'react';
import { Activity, Users, Settings, Bell, Heart, TrendingUp, LogOut } from 'lucide-react';
import { PatientList } from '@/components/PatientList';
import { PatientDetails } from '@/components/PatientDetails';
import { PatientForm } from '@/components/PatientForm';
import { AddNoteModal } from '@/components/AddNoteModal';
import { DeleteConfirmModal } from '@/components/DeleteConfirmModal';
import { useToast } from '@/hooks/use-toast';
import {
  getPatients,
  getPatient,
  createPatient,
  updatePatient,
  deletePatient,
  getVisitNotes,
  createVisitNote,
  updateVisitNote,
} from '@/lib/patientService';
import type { Patient, VisitNote, PatientFormData, VisitNoteFormData } from '@/types/patient';

const Index = () => {
  const { toast } = useToast();

  // State
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [visitNotes, setVisitNotes] = useState<VisitNote[]>([]);

  // Loading states
  const [isLoadingPatients, setIsLoadingPatients] = useState(true);
  const [isLoadingNotes, setIsLoadingNotes] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Modal states
  const [showPatientForm, setShowPatientForm] = useState(false);
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);
  const [showAddNoteModal, setShowAddNoteModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Load patients on mount
  useEffect(() => {
    loadPatients();
  }, []);

  // Load visit notes when patient is selected
  useEffect(() => {
    if (selectedPatient) {
      loadVisitNotes(selectedPatient.id);
    }
  }, [selectedPatient?.id]);

  const loadPatients = async () => {
    try {
      setIsLoadingPatients(true);
      const data = await getPatients();
      setPatients(data);
    } catch (error) {
      console.error('Error loading patients:', error);
      toast({
        title: 'Error',
        description: 'Failed to load patients. Please check your Firebase configuration.',
        variant: 'destructive',
      });
    } finally {
      setIsLoadingPatients(false);
    }
  };

  const loadVisitNotes = async (patientId: string) => {
    try {
      setIsLoadingNotes(true);
      const data = await getVisitNotes(patientId);
      setVisitNotes(data);
    } catch (error) {
      console.error('Error loading visit notes:', error);
      toast({
        title: 'Error',
        description: 'Failed to load visit notes.',
        variant: 'destructive',
      });
    } finally {
      setIsLoadingNotes(false);
    }
  };

  const handleSelectPatient = async (patient: Patient) => {
    setSelectedPatient(patient);
  };

  const handleBackToPatientList = () => {
    setSelectedPatient(null);
  };

  const handleAddPatient = () => {
    setEditingPatient(null);
    setShowPatientForm(true);
  };

  const handleEditPatient = () => {
    if (selectedPatient) {
      setEditingPatient(selectedPatient);
      setShowPatientForm(true);
    }
  };

  const handleSavePatient = async (data: PatientFormData) => {
    try {
      setIsSaving(true);
      if (editingPatient) {
        await updatePatient(editingPatient.id, data);
        const updated = await getPatient(editingPatient.id);
        if (updated) {
          setSelectedPatient(updated);
        }
        toast({
          title: 'Patient Updated',
          description: `${data.name}'s record has been updated successfully.`,
        });
      } else {
        await createPatient(data);
        toast({
          title: 'Patient Added',
          description: `${data.name} has been added to your records.`,
        });
      }
      await loadPatients();
      setShowPatientForm(false);
    } catch (error) {
      console.error('Error saving patient:', error);
      toast({
        title: 'Error',
        description: 'Failed to save patient. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeletePatient = async () => {
    if (!selectedPatient) return;

    try {
      setIsSaving(true);
      await deletePatient(selectedPatient.id);
      toast({
        title: 'Patient Deleted',
        description: `${selectedPatient.name}'s record has been deleted.`,
      });
      setSelectedPatient(null);
      setVisitNotes([]);
      await loadPatients();
      setShowDeleteConfirm(false);
    } catch (error) {
      console.error('Error deleting patient:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete patient. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const [editingNote, setEditingNote] = useState<VisitNote | null>(null);

  const handleAddNote = async (data: VisitNoteFormData) => {
    if (!selectedPatient) return;

    try {
      setIsSaving(true);
      if (editingNote) {
        await updateVisitNote(editingNote.id, data);
        toast({
          title: 'Visit Note Updated',
          description: 'The visit note has been updated successfully.',
        });
      } else {
        await createVisitNote(selectedPatient.id, data);
        toast({
          title: 'Visit Note Added',
          description: 'The visit note has been saved successfully.',
        });
      }
      await loadVisitNotes(selectedPatient.id);
      setShowAddNoteModal(false);
      setEditingNote(null);
    } catch (error) {
      console.error('Error saving visit note:', error);
      toast({
        title: 'Error',
        description: 'Failed to save visit note. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleEditNote = (note: VisitNote) => {
    setEditingNote(note);
    setShowAddNoteModal(true);
  };

  return (
    <div className="min-h-[100dvh] bg-background flex flex-col overflow-hidden">
      {/* Header */}
      <header className="bg-card/80 backdrop-blur-lg border-b border-border sticky top-0 z-40 flex-shrink-0">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
          {/* Logo & Title */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Mobile Back Button */}
            {selectedPatient && (
              <button
                onClick={handleBackToPatientList}
                className="md:hidden p-2 -ml-2 hover:bg-muted rounded-xl transition-colors"
                aria-label="Back to patient list"
              >
                <TrendingUp className="h-5 w-5 text-foreground rotate-180" /> {/* Using TrendingUp as pseudo-arrow, or simple < className='rotate-180' /> logic */}
              </button>
            )}

            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg shadow-primary/20">
              <Activity className="h-5 w-5 sm:h-6 sm:w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-bold text-foreground">MediRecord</h1>
              <p className="text-[10px] sm:text-xs text-muted-foreground">Patient Management System</p>
            </div>
          </div>

          {/* Stats & Actions */}
          <div className="flex items-center gap-3 sm:gap-6">
            {/* Quick Stats - Hidden on Mobile */}
            <div className="hidden lg:flex items-center gap-6 mr-4">
              <div className="flex items-center gap-2 text-sm">
                <div className="w-8 h-8 rounded-lg bg-clinical-blue-light flex items-center justify-center">
                  <Users className="h-4 w-4 text-[hsl(var(--clinical-blue))]" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">{patients.length}</p>
                  <p className="text-[10px] text-muted-foreground">Patients</p>
                </div>
              </div>
              <div className="w-px h-8 bg-border" />
              <div className="flex items-center gap-2 text-sm">
                <div className="w-8 h-8 rounded-lg bg-clinical-green-light flex items-center justify-center">
                  <Heart className="h-4 w-4 text-[hsl(var(--clinical-green))]" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">Active</p>
                  <p className="text-[10px] text-muted-foreground">Status</p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <button className="p-2 sm:p-2.5 hover:bg-muted rounded-xl transition-colors relative">
              <Bell className="h-5 w-5 text-muted-foreground" />
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-primary" />
            </button>
            <button
              className="p-2 sm:p-2.5 hover:bg-muted rounded-xl transition-colors hidden sm:block"
              onClick={() => {
                localStorage.removeItem('isAuthenticated');
                window.location.reload();
              }}
              title="Logout"
            >
              <LogOut className="h-5 w-5 text-muted-foreground" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-screen-2xl mx-auto w-full flex overflow-hidden relative">
        {/* Patient List Sidebar */}
        <aside
          className={`
            w-full md:w-[320px] lg:w-[380px] flex-shrink-0 border-r border-border bg-background
            absolute md:relative inset-0 z-10 transition-transform duration-300 md:translate-x-0
            ${selectedPatient ? '-translate-x-full md:translate-x-0' : 'translate-x-0'}
          `}
        >
          <PatientList
            patients={patients}
            selectedPatientId={selectedPatient?.id}
            onSelectPatient={handleSelectPatient}
            onAddPatient={handleAddPatient}
            isLoading={isLoadingPatients}
          />
        </aside>

        {/* Patient Details Section */}
        <section
          className={`
            flex-1 bg-background overflow-hidden w-full
            absolute md:relative inset-0 z-20 md:z-auto transition-transform duration-300 md:translate-x-0
            ${selectedPatient ? 'translate-x-0' : 'translate-x-full md:translate-x-0'}
          `}
        >
          {selectedPatient ? (
            <PatientDetails
              patient={selectedPatient}
              visitNotes={visitNotes}
              onEdit={handleEditPatient}
              onDelete={() => setShowDeleteConfirm(true)}
              onAddNote={() => {
                setEditingNote(null);
                setShowAddNoteModal(true);
              }}
              onEditNote={handleEditNote}
              isLoadingNotes={isLoadingNotes}
            />
          ) : (
            <div className="h-full hidden md:flex flex-col items-center justify-center text-center p-8">
              <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center mb-6 shadow-lg">
                <Users className="h-12 w-12 text-muted-foreground/40" />
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-3">
                Select a Patient
              </h2>
              <p className="text-muted-foreground max-w-md leading-relaxed mb-6">
                Choose a patient from the list to view their complete medical profile,
                visit history, and manage their records.
              </p>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-clinical-blue" />
                  <span>{patients.length} patients registered</span>
                </div>
              </div>
            </div>
          )}
        </section>
      </main>

      {/* Modals */}
      {showPatientForm && (
        <PatientForm
          initialData={
            editingPatient
              ? {
                name: editingPatient.name,
                age: editingPatient.age,
                disease: editingPatient.disease,
                diagnosis: editingPatient.diagnosis,
                phone: editingPatient.phone,
                address: editingPatient.address,
                medicine: editingPatient.medicine,
              }
              : undefined
          }
          onSubmit={handleSavePatient}
          onCancel={() => setShowPatientForm(false)}
          isLoading={isSaving}
          isEditing={!!editingPatient}
        />
      )}

      {showAddNoteModal && selectedPatient && (
        <AddNoteModal
          patientName={selectedPatient.name}
          initialData={editingNote ? { note: editingNote.note, medicines: editingNote.medicines } : undefined}
          onSubmit={handleAddNote}
          onCancel={() => {
            setShowAddNoteModal(false);
            setEditingNote(null);
          }}
          isLoading={isSaving}
        />
      )}

      {showDeleteConfirm && selectedPatient && (
        <DeleteConfirmModal
          patientName={selectedPatient.name}
          onConfirm={handleDeletePatient}
          onCancel={() => setShowDeleteConfirm(false)}
          isLoading={isSaving}
        />
      )}
    </div>
  );
};

export default Index;
