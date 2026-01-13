import { User, Edit3, Trash2, Plus, Calendar, Clock, Pill, FileText, Activity, Stethoscope } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Patient, VisitNote } from '@/types/patient';
import { format } from 'date-fns';

interface PatientDetailsProps {
  patient: Patient;
  visitNotes: VisitNote[];
  onEdit: () => void;
  onDelete: () => void;
  onAddNote: () => void;
  onEditNote: (note: VisitNote) => void;
  isLoadingNotes?: boolean;
}

export function PatientDetails({ patient, visitNotes, onEdit, onDelete, onAddNote, onEditNote, isLoadingNotes }: PatientDetailsProps) {
  const getAgeCategory = (age: number) => {
    if (age < 18) return 'Pediatric';
    if (age < 40) return 'Young Adult';
    if (age < 60) return 'Middle Adult';
    return 'Senior Adult';
  };

  return (
    <div className="h-full flex flex-col overflow-hidden bg-background w-full">
      {/* Scrollable Header + Content */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {/* Header Section */}
        <div className="p-4 sm:p-6 bg-gradient-to-br from-card to-secondary/30 border-b border-border">
          <div className="max-w-5xl mx-auto space-y-6">
            <div className="flex flex-col sm:flex-row items-start justify-between gap-4 sm:gap-6">
              <div className="flex items-start gap-4 sm:gap-5 w-full sm:w-auto">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg shadow-primary/20 flex-shrink-0">
                  <User className="h-8 w-8 sm:h-10 sm:w-10 text-primary-foreground" />
                </div>
                <div className="min-w-0 flex-1">
                  <h1 className="text-xl sm:text-2xl font-bold text-foreground mb-1 truncate">{patient.name}</h1>
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-sm text-muted-foreground mb-3">
                    <span className="clinical-badge clinical-badge-blue whitespace-nowrap">{patient.age} years old</span>
                    <span className="clinical-badge clinical-badge-purple whitespace-nowrap">{getAgeCategory(patient.age)}</span>
                  </div>
                  <div className="flex flex-col gap-1.5 text-sm w-full">
                    <div className="flex items-start gap-2">
                      <Stethoscope className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      <div>
                        <span className="text-muted-foreground">Condition: </span>
                        <span className="text-foreground font-medium break-words">{patient.disease}</span>
                      </div>
                    </div>
                    {patient.diagnosis && (
                      <div className="flex items-start gap-2">
                        <Activity className="h-4 w-4 text-[hsl(var(--clinical-purple))] mt-0.5 flex-shrink-0" />
                        <div>
                          <span className="text-muted-foreground">Diagnosis: </span>
                          <span className="text-foreground font-medium break-words">{patient.diagnosis}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Actions - Full width on mobile, auto on desktop */}
              <div className="flex items-center gap-2 w-full sm:w-auto mt-2 sm:mt-0">
                <Button variant="outline" size="sm" onClick={onEdit} className="flex-1 sm:flex-none gap-2 h-9 sm:h-10">
                  <Edit3 className="h-4 w-4" />Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onDelete}
                  className="flex-1 sm:flex-none text-destructive hover:text-destructive hover:bg-destructive/10 hover:border-destructive/30 gap-2 h-9 sm:h-10"
                >
                  <Trash2 className="h-4 w-4" />Delete
                </Button>
              </div>
            </div>

            {/* Stats Grid - 2 cols on mobile, 4 on desktop */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
              <div className="stat-card p-3 sm:p-4">
                <div className="stat-icon bg-clinical-blue-light w-8 h-8 sm:w-10 sm:h-10">
                  <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-[hsl(var(--clinical-blue))]" />
                </div>
                <div>
                  <div className="stat-value text-base sm:text-xl">{visitNotes.length}</div>
                  <div className="stat-label text-xs sm:text-sm">Total Visits</div>
                </div>
              </div>
              <div className="stat-card p-3 sm:p-4">
                <div className="stat-icon bg-clinical-green-light w-8 h-8 sm:w-10 sm:h-10">
                  <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-[hsl(var(--clinical-green))]" />
                </div>
                <div>
                  <div className="stat-value text-base sm:text-xl text-lg truncate">
                    {visitNotes.length > 0 ? format(visitNotes[0].visitDate, 'MMM d') : '—'}
                  </div>
                  <div className="stat-label text-xs sm:text-sm">Last Visit</div>
                </div>
              </div>
              <div className="stat-card p-3 sm:p-4">
                <div className="stat-icon bg-clinical-orange-light w-8 h-8 sm:w-10 sm:h-10">
                  <Pill className="h-4 w-4 sm:h-5 sm:w-5 text-[hsl(var(--clinical-orange))]" />
                </div>
                <div>
                  <div className="stat-value text-base sm:text-xl">{visitNotes.filter((n) => n.medicines?.trim()).length}</div>
                  <div className="stat-label text-xs sm:text-sm">Prescriptions</div>
                </div>
              </div>
              <div className="stat-card p-3 sm:p-4">
                <div className="stat-icon bg-clinical-purple-light w-8 h-8 sm:w-10 sm:h-10">
                  <Activity className="h-4 w-4 sm:h-5 sm:w-5 text-[hsl(var(--clinical-purple))]" />
                </div>
                <div>
                  <div className="stat-value text-base sm:text-xl text-lg">{format(patient.createdAt, 'MMM d, yyyy')}</div>
                  <div className="stat-label text-xs sm:text-sm">Since</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Visit History Layout */}
        <div className="p-4 sm:p-6 pb-20 sm:pb-6">
          <div className="max-w-5xl mx-auto">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="text-lg font-semibold text-foreground">Visit History</h2>
                <p className="text-sm text-muted-foreground">All consultations and medical records</p>
              </div>
              <Button variant="clinical-success" onClick={onAddNote} className="gap-2 w-full sm:w-auto shadow-sm">
                <Plus className="h-4 w-4" />New Visit Note
              </Button>
            </div>

            {isLoadingNotes ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="clinical-card p-4 sm:p-6 animate-pulse">
                    <div className="h-4 bg-muted rounded w-1/2 mb-4" />
                    <div className="space-y-2">
                      <div className="h-4 bg-muted rounded w-full" />
                      <div className="h-4 bg-muted rounded w-3/4" />
                    </div>
                  </div>
                ))}
              </div>
            ) : visitNotes.length === 0 ? (
              <div className="empty-state py-12 sm:py-16 clinical-card px-4 text-center">
                <div className="empty-state-icon mx-auto mb-4">
                  <FileText className="h-8 w-8 sm:h-10 sm:w-10 text-muted-foreground/50" />
                </div>
                <h3 className="empty-state-title text-base sm:text-lg">No Visit Notes Yet</h3>
                <p className="empty-state-description text-sm max-w-xs mx-auto">Start recording consultations by adding the first visit note.</p>
                <Button variant="clinical" onClick={onAddNote} className="mt-5 gap-2 w-full sm:w-auto">
                  <Plus className="h-4 w-4" />Add First Visit Note
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {visitNotes.map((note, index) => (
                  <div key={note.id} className="visit-note-card animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-4 border-b border-border">
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="h-4 w-4 text-primary" />
                          <span className="font-medium text-foreground">{format(note.visitDate, 'EEEE, MMMM d, yyyy')}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          <span>{format(note.visitDate, 'h:mm a')}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="clinical-badge clinical-badge-blue w-fit text-xs">Visit #{visitNotes.length - index}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 text-muted-foreground hover:text-primary"
                          onClick={() => onEditNote(note)}
                        >
                          <Edit3 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>

                    <div className="mb-5">
                      <div className="flex items-center gap-2 mb-2">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <h4 className="text-sm font-semibold text-foreground">Consultation Notes</h4>
                      </div>
                      <p className="text-sm text-foreground/90 leading-relaxed pl-0 sm:pl-6 whitespace-pre-wrap">{note.note}</p>
                    </div>

                    {note.medicines?.trim() && (
                      <div className="bg-clinical-green-light/50 rounded-lg p-3 sm:p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Pill className="h-4 w-4 text-[hsl(var(--clinical-green))]" />
                          <h4 className="text-sm font-semibold text-foreground">Prescribed Medicines</h4>
                        </div>
                        <p className="text-sm text-foreground/90 leading-relaxed pl-0 sm:pl-6 whitespace-pre-wrap">{note.medicines}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
