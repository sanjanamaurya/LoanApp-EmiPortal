import React, { useState, useRef } from 'react';
import { UploadCloud, File, AlertCircle, CheckCircle2, Trash2 } from 'lucide-react';
import { DocumentMetadata } from '../../types';
import { formatFileSize } from '../../utils/format';
import { validateFile } from '../../utils/validators';

export interface FileDropzoneProps {
  value?: DocumentMetadata | null;
  onChange: (doc: DocumentMetadata | null) => void;
  error?: string;
}

export const FileDropzone: React.FC<FileDropzoneProps> = ({ value, onChange, error }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleProcessFile = (file: File) => {
    setLocalError(null);
    const validation = validateFile({
      name: file.name,
      size: file.size,
      type: file.type,
    });

    if (!validation.valid) {
      setLocalError(validation.error || 'Invalid file');
      return;
    }

    // Generate preview data URL for images
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        onChange({
          name: file.name,
          size: file.size,
          type: file.type,
          previewUrl: e.target?.result as string,
        });
      };
      reader.readAsDataURL(file);
    } else {
      // PDF or non-image
      onChange({
        name: file.name,
        size: file.size,
        type: file.type,
      });
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleProcessFile(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const activeError = error || localError;

  return (
    <div className="w-full space-y-3">
      {!value ? (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
          className={`relative border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-200 ${
            isDragOver
              ? 'border-brand-500 bg-brand-50/50'
              : activeError
              ? 'border-rose-300 bg-rose-50/30'
              : 'border-slate-300 hover:border-brand-400 bg-slate-50/60 hover:bg-white'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png"
            className="sr-only"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                handleProcessFile(e.target.files[0]);
              }
            }}
          />

          <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center mb-3">
            <UploadCloud className="w-6 h-6" />
          </div>

          <p className="text-sm font-bold text-slate-800">
            Click to upload <span className="font-normal text-slate-500">or drag & drop</span>
          </p>
          <p className="text-xs text-slate-500 mt-1">
            PAN Card / Address Proof: PDF, JPG, or PNG (Max 2 MB)
          </p>
        </div>
      ) : (
        <div className="p-4 rounded-2xl border border-slate-200 bg-white flex items-center justify-between gap-4 shadow-sm">
          <div className="flex items-center gap-3.5 min-w-0">
            {value.previewUrl ? (
              <img
                src={value.previewUrl}
                alt="Document thumbnail"
                className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0"
              />
            ) : (
              <div className="w-12 h-12 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center shrink-0">
                <File className="w-6 h-6" />
              </div>
            )}

            <div className="min-w-0">
              <p className="text-sm font-bold text-slate-900 truncate">{value.name}</p>
              <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-500">
                <span>{formatFileSize(value.size)}</span>
                <span>•</span>
                <span className="flex items-center gap-1 text-emerald-600 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Ready for submission
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            >
              Replace
            </button>
            <button
              type="button"
              onClick={() => {
                onChange(null);
                setLocalError(null);
                if (fileInputRef.current) fileInputRef.current.value = '';
              }}
              className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors"
              aria-label="Remove document"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png"
            className="sr-only"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                handleProcessFile(e.target.files[0]);
              }
            }}
          />
        </div>
      )}

      {activeError && (
        <p className="flex items-center gap-1.5 text-xs text-rose-600 font-medium">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{activeError}</span>
        </p>
      )}
    </div>
  );
};
