import React, { useState } from 'react';
import { ApplicationStatus } from '../../types';
import { Button } from '../ui/Button';
import { CheckCircle2, XCircle, Clock, AlertCircle } from 'lucide-react';

export interface StatusActionsProps {
  currentStatus: ApplicationStatus;
  isLoading: boolean;
  onUpdateStatus: (status: ApplicationStatus, remarks?: string) => Promise<boolean>;
}

export const StatusActions: React.FC<StatusActionsProps> = ({
  currentStatus,
  isLoading,
  onUpdateStatus,
}) => {
  const [remarks, setRemarks] = useState('');
  const [actionError, setActionError] = useState<string | null>(null);

  const handleAction = async (status: ApplicationStatus) => {
    setActionError(null);

    // Reject requires remarks with minimum 5 characters
    if (status === 'Rejected') {
      if (!remarks.trim() || remarks.trim().length < 5) {
        setActionError('Remarks are required for rejecting an application (minimum 5 characters).');
        return;
      }
    }

    const success = await onUpdateStatus(status, remarks);
    if (success) {
      setRemarks('');
      setActionError(null);
    }
  };

  const MAX_REMARKS_CHARS = 250;

  return (
    <div className="space-y-4">
      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
        Reviewer Actions & Decision
      </h4>

      {/* Remarks Textarea */}
      <div className="space-y-1.5">
        <label htmlFor="reviewer-remarks" className="text-xs font-bold text-slate-700">
          Reviewer Remarks / Notes
        </label>
        <textarea
          id="reviewer-remarks"
          rows={3}
          maxLength={MAX_REMARKS_CHARS}
          value={remarks}
          onChange={(e) => {
            setRemarks(e.target.value);
            if (actionError) setActionError(null);
          }}
          placeholder="Enter audit notes, underwriter remarks, or justification (required for rejection)..."
          className="w-full text-xs font-medium p-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-colors placeholder:text-slate-400"
          disabled={isLoading}
        />
        <div className="flex items-center justify-between text-[11px] text-slate-500">
          <span>{MAX_REMARKS_CHARS - remarks.length} characters remaining</span>
          {actionError && (
            <span className="flex items-center gap-1 text-rose-600 font-medium">
              <AlertCircle className="w-3.5 h-3.5" />
              {actionError}
            </span>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center gap-2.5 pt-1">
        <Button
          variant="success"
          size="sm"
          isLoading={isLoading}
          disabled={isLoading || currentStatus === 'Approved'}
          leftIcon={<CheckCircle2 className="w-4 h-4" />}
          onClick={() => handleAction('Approved')}
        >
          Approve Application
        </Button>

        <Button
          variant="danger"
          size="sm"
          isLoading={isLoading}
          disabled={isLoading || currentStatus === 'Rejected'}
          leftIcon={<XCircle className="w-4 h-4" />}
          onClick={() => handleAction('Rejected')}
        >
          Reject Application
        </Button>

        {currentStatus !== 'Under Review' && (
          <Button
            variant="outline"
            size="sm"
            isLoading={isLoading}
            disabled={isLoading}
            leftIcon={<Clock className="w-4 h-4" />}
            onClick={() => handleAction('Under Review')}
          >
            Mark Under Review
          </Button>
        )}
      </div>
    </div>
  );
};
