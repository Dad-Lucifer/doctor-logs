import { Button } from '@/components/ui/button';
import { AlertTriangle, User, X, FileX } from 'lucide-react';

interface DeleteConfirmModalProps {
  patientName: string;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function DeleteConfirmModal({
  patientName,
  onConfirm,
  onCancel,
  isLoading,
}: DeleteConfirmModalProps) {
  return (
    <div className="fixed inset-0 bg-foreground/30 backdrop-blur-sm flex items-center justify-center z-50 p-4 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-card w-full max-w-sm rounded-2xl shadow-2xl border border-border flex flex-col max-h-[90dvh] animate-in zoom-in-95 duration-200 overflow-hidden">

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {/* Header Icon */}
          <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-destructive/10 flex items-center justify-center mx-auto mb-4 sm:mb-5 flex-shrink-0">
            <AlertTriangle className="h-6 w-6 sm:h-8 sm:w-8 text-destructive" />
          </div>

          {/* Text Content */}
          <div className="text-center mb-4 sm:mb-6">
            <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-2">
              Delete Patient Record
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Are you sure you want to permanently delete{' '}
              <span className="font-semibold text-foreground break-words">{patientName}'s</span>{' '}
              medical record?
            </p>
          </div>

          {/* Warning Box */}
          <div className="flex items-start gap-3 p-3 bg-destructive/5 border border-destructive/10 rounded-xl mb-4 text-left">
            <FileX className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
            <div className="text-xs text-muted-foreground">
              <p className="font-medium text-foreground mb-0.5">This action cannot be undone</p>
              <p className="leading-relaxed">All visit notes and medical history will be permanently removed.</p>
            </div>
          </div>
        </div>

        {/* Fixed Footer Actions */}
        <div className="p-4 sm:p-6 pt-0 sm:pt-0 mt-auto flex gap-3">
          <Button
            variant="outline"
            className="flex-1 h-10 sm:h-11 text-sm sm:text-base"
            onClick={onCancel}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            className="flex-1 h-10 sm:h-11 text-sm sm:text-base shadow-sm"
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? 'Deleting...' : 'Delete Patient'}
          </Button>
        </div>
      </div>
    </div>
  );
}
