import React, { createContext, useContext, useState, useCallback } from 'react';
import { ToastItem } from '../types';
import { AlertCircle, CheckCircle2, Info, X } from 'lucide-react';

interface ToastContextValue {
  toasts: ToastItem[];
  showToast: (toast: Omit<ToastItem, 'id'>) => string;
  showSuccess: (title: string, message?: string) => string;
  showError: (title: string, message?: string, onRetry?: () => void) => string;
  showInfo: (title: string, message?: string) => string;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    ({ type, title, message, duration, onRetry }: Omit<ToastItem, 'id'>): string => {
      const id = Math.random().toString(36).substring(2, 9);
      const effectiveDuration = duration ?? (onRetry ? 9000 : type === 'error' ? 6000 : 4000);

      const newItem: ToastItem = {
        id,
        type,
        title,
        message,
        duration: effectiveDuration,
        onRetry,
      };

      setToasts((prev) => [...prev, newItem]);

      if (effectiveDuration > 0) {
        setTimeout(() => {
          removeToast(id);
        }, effectiveDuration);
      }

      return id;
    },
    [removeToast]
  );

  const showSuccess = useCallback(
    (title: string, message?: string) => showToast({ type: 'success', title, message }),
    [showToast]
  );

  const showError = useCallback(
    (title: string, message?: string, onRetry?: () => void) =>
      showToast({ type: 'error', title, message, onRetry }),
    [showToast]
  );

  const showInfo = useCallback(
    (title: string, message?: string) => showToast({ type: 'info', title, message }),
    [showToast]
  );

  return (
    <ToastContext.Provider
      value={{
        toasts,
        showToast,
        showSuccess,
        showError,
        showInfo,
        removeToast,
      }}
    >
      {children}
      {/* Toast Notification Container */}
      <div
        aria-live="polite"
        className="fixed bottom-4 right-4 z-50 flex flex-col gap-2.5 max-w-sm sm:max-w-md w-full pointer-events-none p-4 sm:p-0"
      >
        {toasts.map((toast) => (
          <div
            key={toast.id}
            role="alert"
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl shadow-xl border transition-all duration-300 animate-slide-in ${
              toast.type === 'success'
                ? 'bg-white border-emerald-200 text-slate-800'
                : toast.type === 'error'
                ? 'bg-white border-rose-200 text-slate-800'
                : 'bg-white border-blue-200 text-slate-800'
            }`}
          >
            <div className="shrink-0 mt-0.5">
              {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-600" />}
              {toast.type === 'error' && <AlertCircle className="w-5 h-5 text-rose-600" />}
              {toast.type === 'info' && <Info className="w-5 h-5 text-blue-600" />}
            </div>

            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-semibold text-slate-900 leading-tight">{toast.title}</h4>
              {toast.message && <p className="text-xs text-slate-600 mt-1 leading-relaxed">{toast.message}</p>}

              {toast.onRetry && (
                <button
                  type="button"
                  onClick={() => {
                    toast.onRetry?.();
                    removeToast(toast.id);
                  }}
                  className="mt-2.5 inline-flex items-center gap-1.5 px-3 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-semibold rounded-lg border border-rose-200 transition-colors focus:ring-2 focus:ring-rose-500"
                >
                  <span>↻ Retry Update</span>
                </button>
              )}
            </div>

            <button
              type="button"
              onClick={() => removeToast(toast.id)}
              className="shrink-0 text-slate-400 hover:text-slate-600 p-1 rounded-md transition-colors"
              aria-label="Dismiss notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export function useToast(): ToastContextValue {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
