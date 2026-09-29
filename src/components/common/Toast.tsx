import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
      {toasts.map(toast => {
        const isSuccess = toast.type === 'success';
        const isError = toast.type === 'error';

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-2xl shadow-xl border backdrop-blur-md transition-all animate-in slide-in-from-bottom-5 duration-200 ${
              isSuccess
                ? 'bg-emerald-950/90 text-white border-emerald-700/60'
                : isError
                ? 'bg-rose-950/90 text-white border-rose-700/60'
                : 'bg-slate-900/90 text-white border-slate-700/60'
            }`}
          >
            {isSuccess && <CheckCircle2 size={20} className="text-emerald-400 shrink-0 mt-0.5" />}
            {isError && <AlertCircle size={20} className="text-rose-400 shrink-0 mt-0.5" />}
            {!isSuccess && !isError && <Info size={20} className="text-blue-400 shrink-0 mt-0.5" />}

            <div className="flex-1 text-xs font-medium leading-relaxed">
              {toast.message}
            </div>

            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-white p-0.5 transition-colors"
            >
              <X size={15} />
            </button>
          </div>
        );
      })}
    </div>
  );
};
