import { useState } from 'react';
import {
  X, User, Calendar, Stethoscope, AlertCircle, Activity,
  Phone, MapPin, Pill // <--- Added new icons
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { PatientFormData } from '@/types/patient';

interface PatientFormProps {
  initialData?: PatientFormData;
  onSubmit: (data: PatientFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
  isEditing?: boolean;
}

export function PatientForm({
  initialData,
  onSubmit,
  onCancel,
  isLoading,
  isEditing,
}: PatientFormProps) {
  // Updated initial state to include new fields
  const [formData, setFormData] = useState<PatientFormData>(
    initialData || {
      name: '',
      age: 0,
      disease: '',
      diagnosis: '',
      phone: '',
      address: '',
      medicine: ''
    }
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Patient name is required';
    }

    if (formData.age === undefined || formData.age === null || formData.age < 0 || formData.age > 150) {
      newErrors.age = 'Please enter a valid age (0-150)';
    }

    if (!formData.disease.trim()) {
      newErrors.disease = 'Disease/Problem is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
  };

  return (
    <div className="fixed inset-0 bg-foreground/30 backdrop-blur-sm flex items-center justify-center z-50 p-4 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-card w-full max-w-md rounded-2xl shadow-2xl border border-border flex flex-col max-h-[90dvh] sm:max-h-[85vh] animate-in zoom-in-95 duration-200 overflow-hidden">
        {/* Fixed Header */}
        <div className="flex-shrink-0 flex items-center justify-between p-4 sm:p-5 border-b border-border bg-gradient-to-r from-primary/5 to-transparent">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
              <User className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
            </div>
            <div className="min-w-0">
              <h3 className="text-base sm:text-lg font-semibold text-foreground truncate">
                {isEditing ? 'Edit Patient' : 'New Patient'}
              </h3>
              <p className="text-xs text-muted-foreground truncate">
                {isEditing ? 'Update patient information' : 'Add a new patient record'}
              </p>
            </div>
          </div>
          <button
            onClick={onCancel}
            className="p-2 -mr-2 hover:bg-muted rounded-xl transition-colors flex-shrink-0"
            aria-label="Close modal"
          >
            <X className="h-5 w-5 text-muted-foreground" />
          </button>
        </div>

        {/* Scrollable Form Content */}
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 sm:space-y-5">

            {/* Name Field */}
            <div>
              <label className="clinical-label flex items-center gap-2 mb-1.5">
                <User className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground" />
                Patient Name
                <span className="text-destructive">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                className={`clinical-input w-full text-sm sm:text-base ${errors.name ? 'border-destructive focus:ring-destructive/30' : ''}`}
                placeholder="Enter patient's full name"
                autoFocus={!isEditing}
              />
              {errors.name && (
                <p className="flex items-center gap-1.5 text-destructive text-xs mt-2">
                  <AlertCircle className="h-3 w-3" />
                  {errors.name}
                </p>
              )}
            </div>

            {/* NEW: Phone Number Field */}
            <div>
              <label className="clinical-label flex items-center gap-2 mb-1.5">
                <Phone className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground" />
                Phone Number
              </label>
              <input
                type="tel"
                value={formData.phone || ''}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, phone: e.target.value }))
                }
                className="clinical-input w-full text-sm sm:text-base"
                placeholder="e.g., 123-456-7890"
              />
            </div>

            {/* Age Field */}
            <div>
              <label className="clinical-label flex items-center gap-2 mb-1.5">
                <Calendar className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground" />
                Age
                <span className="text-destructive">*</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={formData.age || ''}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      age: parseInt(e.target.value) || 0,
                    }))
                  }
                  className={`clinical-input w-full text-sm sm:text-base pr-14 ${errors.age ? 'border-destructive focus:ring-destructive/30' : ''}`}
                  placeholder="Enter age"
                  min="0"
                  max="150"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground pointer-events-none">
                  years
                </span>
              </div>
              {errors.age && (
                <p className="flex items-center gap-1.5 text-destructive text-xs mt-2">
                  <AlertCircle className="h-3 w-3" />
                  {errors.age}
                </p>
              )}
            </div>

            {/* NEW: Address Field */}
            <div>
              <label className="clinical-label flex items-center gap-2 mb-1.5">
                <MapPin className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground" />
                Address
              </label>
              <input
                type="text"
                value={formData.address || ''}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, address: e.target.value }))
                }
                className="clinical-input w-full text-sm sm:text-base"
                placeholder="Enter street address"
              />
            </div>

            {/* Disease Field - Main Complaint */}
            <div>
              <label className="clinical-label flex items-center gap-2 mb-1.5">
                <Stethoscope className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground" />
                Main Complaint / Condition
                <span className="text-destructive">*</span>
              </label>
              <textarea
                value={formData.disease}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, disease: e.target.value }))
                }
                className={`clinical-input w-full text-sm sm:text-base min-h-[80px] sm:min-h-[100px] resize-none ${errors.disease ? 'border-destructive focus:ring-destructive/30' : ''
                  }`}
                placeholder="Describe the primary condition or symptoms"
              />
              {errors.disease && (
                <p className="flex items-center gap-1.5 text-destructive text-xs mt-2">
                  <AlertCircle className="h-3 w-3" />
                  {errors.disease}
                </p>
              )}
            </div>

            {/* Diagnosis Field - Optional */}
            <div>
              <label className="clinical-label flex items-center gap-2 mb-1.5">
                <Activity className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground" />
                Diagnosis
                <span className="text-xs font-normal text-muted-foreground">(Optional)</span>
              </label>
              <textarea
                value={formData.diagnosis || ''}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, diagnosis: e.target.value }))
                }
                className="clinical-input w-full text-sm sm:text-base min-h-[60px] sm:min-h-[80px] resize-none"
                placeholder="Enter medical diagnosis if available"
              />
            </div>

            {/* NEW: Medicine Field */}
            <div>
              <label className="clinical-label flex items-center gap-2 mb-1.5">
                <Pill className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground" />
                Prescribed Medicines
              </label>
              <textarea
                value={formData.medicine || ''}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, medicine: e.target.value }))
                }
                className="clinical-input w-full text-sm sm:text-base min-h-[60px] sm:min-h-[80px] resize-none"
                placeholder="List medicines and dosage..."
              />
            </div>

          </div>

          {/* Fixed Footer Actions */}
          <div className="flex-shrink-0 p-4 sm:p-5 border-t border-border bg-card flex gap-3 z-10">
            <Button
              type="button"
              variant="outline"
              className="flex-1 h-10 sm:h-11 text-sm sm:text-base"
              onClick={onCancel}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="clinical"
              className="flex-1 h-10 sm:h-11 text-sm sm:text-base shadow-sm"
              disabled={isLoading}
            >
              {isLoading
                ? 'Saving...'
                : isEditing
                  ? 'Update Patient'
                  : 'Add Patient'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}