import { useState } from 'react';
import { X, FileText, Pill, Clock, AlertCircle, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { VisitNoteFormData } from '@/types/patient';
import { format } from 'date-fns';

interface AddNoteModalProps {
  patientName: string;
  initialData?: VisitNoteFormData;
  onSubmit: (data: VisitNoteFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function AddNoteModal({
  patientName,
  initialData,
  onSubmit,
  onCancel,
  isLoading,
}: AddNoteModalProps) {
  const [formData, setFormData] = useState<VisitNoteFormData>(
    initialData || {
      note: '',
      medicines: '',
    }
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.note.trim()) {
      newErrors.note = "Consultation notes are required";
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
      <div className="bg-card w-full max-w-lg rounded-2xl shadow-2xl border border-border flex flex-col max-h-[90dvh] sm:max-h-[85vh] animate-in zoom-in-95 duration-200 overflow-hidden">
        {/* Header - Fixed at top */}
        <div className="flex-shrink-0 flex items-center justify-between p-4 sm:p-5 border-b border-border bg-gradient-to-r from-accent/5 to-transparent">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-accent/10 flex items-center justify-center flex-shrink-0">
              <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-accent" />
            </div>
            <div className="min-w-0">
              <h3 className="text-base sm:text-lg font-semibold text-foreground truncate">
                New Visit Note
              </h3>
              <p className="text-xs text-muted-foreground truncate">
                Recording visit for <span className="font-medium text-foreground">{patientName}</span>
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

        {/* Scrollable Content Area */}
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 sm:space-y-5">
            {/* Timestamp Info */}
            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-xl">
              <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-primary flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  {format(new Date(), 'EEEE, MMMM d, yyyy')}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {format(new Date(), 'h:mm a')} • Auto-recorded
                </p>
              </div>
            </div>

            {/* Doctor's Note */}
            <div>
              <label className="clinical-label flex items-center gap-2 mb-1.5">
                <FileText className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground" />
                Consultation Notes
                <span className="text-destructive">*</span>
              </label>
              <textarea
                value={formData.note}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, note: e.target.value }))
                }
                className={`clinical-input min-h-[120px] sm:min-h-[140px] resize-none w-full text-sm sm:text-base ${errors.note ? 'border-destructive focus:ring-destructive/30' : ''
                  }`}
                placeholder="Enter consultation notes, observations, symptoms, diagnosis..."
                autoFocus
              />
              {errors.note && (
                <p className="flex items-center gap-1.5 text-destructive text-xs mt-2">
                  <AlertCircle className="h-3 w-3" />
                  {errors.note}
                </p>
              )}
            </div>

            {/* Medicines */}
            <div>
              <label className="clinical-label flex items-center gap-2 mb-1.5">
                <Pill className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground" />
                Prescribed Medicines
                <span className="text-xs font-normal text-muted-foreground">(Optional)</span>
              </label>
              <textarea
                value={formData.medicines}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, medicines: e.target.value }))
                }
                className="clinical-input min-h-[80px] sm:min-h-[100px] resize-none w-full text-sm sm:text-base"
                placeholder="List medicines with dosage and frequency..."
              />
            </div>

            {/* Info Banner */}
            <div className="flex items-start gap-3 p-3.5 bg-primary/5 border border-primary/10 rounded-xl">
              <Info className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
              <p className="text-xs text-muted-foreground leading-relaxed">
                Visit notes are <span className="font-medium text-foreground">immutable</span> once created.
              </p>
            </div>
          </div>

          {/* Footer - Fixed at bottom */}
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
              variant="clinical-success"
              className="flex-1 h-10 sm:h-11 text-sm sm:text-base shadow-sm"
              disabled={isLoading}
            >
              {isLoading ? 'Saving...' : 'Save Visit Note'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
