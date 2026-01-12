import { useState } from 'react';
import { Search, Plus, User, Calendar, Stethoscope, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Patient } from '@/types/patient';
import { format } from 'date-fns';

interface PatientListProps {
  patients: Patient[];
  selectedPatientId?: string;
  onSelectPatient: (patient: Patient) => void;
  onAddPatient: () => void;
  isLoading?: boolean;
}

export function PatientList({
  patients,
  selectedPatientId,
  onSelectPatient,
  onAddPatient,
  isLoading,
}: PatientListProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPatients = patients.filter((patient) => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return true; // Show all if search is just whitespace

    // Safety checks for all fields
    const nameMatch = (patient.name || '').toLowerCase().includes(query);
    const diseaseMatch = (patient.disease || '').toLowerCase().includes(query);
    const diagnosisMatch = (patient.diagnosis || '').toLowerCase().includes(query);

    return nameMatch || diseaseMatch || diagnosisMatch;
  });

  const getAgeGroup = (age: number) => {
    if (age < 18) return { label: 'Child', color: 'clinical-badge-purple' };
    if (age < 40) return { label: 'Adult', color: 'clinical-badge-blue' };
    if (age < 60) return { label: 'Middle-aged', color: 'clinical-badge-orange' };
    return { label: 'Senior', color: 'clinical-badge-green' };
  };

  return (
    <div className="h-full flex flex-col bg-card">
      <div className="p-4 border-b border-border bg-card">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-foreground">Patients</h2>
            <p className="text-xs text-muted-foreground">
              {filteredPatients.length} of {patients.length} patients
            </p>
          </div>
          <Button variant="clinical" size="sm" onClick={onAddPatient} className="gap-1.5">
            <Plus className="h-4 w-4" />
            Add
          </Button>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search patients or conditions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="clinical-input pl-10 py-2"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-2">
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="clinical-card p-4 animate-pulse">
                <div className="flex items-start gap-3">
                  <div className="w-11 h-11 rounded-xl bg-muted" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-muted rounded w-3/4" />
                    <div className="h-3 bg-muted rounded w-1/2" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredPatients.length === 0 ? (
          <div className="empty-state py-16">
            <div className="empty-state-icon">
              <Users className="h-10 w-10 text-muted-foreground/50" />
            </div>
            <h3 className="empty-state-title">{searchQuery ? 'No patients found' : 'No patients yet'}</h3>
            <p className="empty-state-description">
              {searchQuery ? 'Try adjusting your search query' : 'Add your first patient to get started'}
            </p>
            {!searchQuery && (
              <Button variant="clinical" onClick={onAddPatient} className="mt-5 gap-2">
                <Plus className="h-4 w-4" />
                Add Patient
              </Button>
            )}
          </div>
        ) : (
          filteredPatients.map((patient) => {
            const isSelected = patient.id === selectedPatientId;
            const ageGroup = getAgeGroup(patient.age);
            return (
              <button
                key={patient.id}
                onClick={() => onSelectPatient(patient)}
                className={`w-full text-left clinical-card p-4 transition-all duration-200 ${isSelected ? 'patient-card-active' : 'hover:shadow-md hover:border-primary/10'
                  }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${isSelected ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                    }`}>
                    <User className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3 className="font-medium text-foreground truncate">{patient.name}</h3>
                      <span className={`clinical-badge ${ageGroup.color} text-[10px] flex-shrink-0`}>{patient.age}y</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-2">
                      <Stethoscope className="h-3 w-3 flex-shrink-0" />
                      <span className="truncate">{patient.disease}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground/70">
                      <Calendar className="h-3 w-3" />
                      <span>Added {format(patient.createdAt, 'MMM d, yyyy')}</span>
                    </div>
                  </div>
                </div>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}
