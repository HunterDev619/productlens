'use client';

import { CircleNotch, Upload } from '@phosphor-icons/react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import React from 'react';

import { startCombinedAnalysis, waitForCombinedAnalysisCanProceed } from '@/services/ai/combined-analysis-v2';
import { cn } from '@/utils';

type UploadModePanelProps = {
  onSuccessAction: (data: { productSpecifications: any; workflowInstanceId: string }) => Promise<void> | void;
  onResetAction?: () => void;
  onLoadingChangeAction?: (loading: boolean) => void;
};

export default function UploadModePanel({ onSuccessAction, onResetAction, onLoadingChangeAction }: UploadModePanelProps) {
  const [imageFile, setImageFile] = React.useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);
  const [isDragging, setIsDragging] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [isProcessing, setIsProcessing] = React.useState(false);
  const abortControllerRef = React.useRef<AbortController | null>(null);

  React.useEffect(() => {
    onLoadingChangeAction?.(isProcessing);
  }, [isProcessing, onLoadingChangeAction]);

  const handleFileSelect = (file?: File) => {
    if (!file) {
      return;
    }
    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleBrowseChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    handleFileSelect(file);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileSelect(e.dataTransfer.files?.[0]);
  };

  const handleCancel = () => {
    setIsProcessing(false);
    setImageFile(null);
    setPreviewUrl(null);
    setErrorMessage(null);
    onResetAction?.();
  };

  const analyseImage = async () => {
    if (!imageFile || isProcessing) {
      return;
    }

    setIsProcessing(true);
    setErrorMessage(null);
    abortControllerRef.current = new AbortController();

    try {
      const start = await startCombinedAnalysis({ image_file: imageFile });
      const ready = await waitForCombinedAnalysisCanProceed(start.workflowInstanceId);
      await onSuccessAction({ productSpecifications: ready.product_specifications, workflowInstanceId: ready.workflowInstanceId });
    } catch (error: any) {
      if (error?.name !== 'AbortError') {
        setErrorMessage(error?.message || 'Failed to analyse product image');
      }
    } finally {
      setIsProcessing(false);
      abortControllerRef.current = null;
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div
        className={cn(
          'rounded-xl border-2 border-dashed bg-gradient-to-br from-gray-50 to-gray-100 transition-all duration-300',
          isDragging ? 'border-emerald-500 bg-emerald-50 shadow-lg shadow-emerald-500/20' : 'border-gray-300',
          errorMessage && 'border-red-300 bg-red-50',
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          type="file"
          accept="image/jpeg,image/jpg,image/png"
          onChange={handleBrowseChange}
          className="hidden"
          id="file-upload"
        />
        <label
          htmlFor="file-upload"
          className="flex cursor-pointer flex-col items-center justify-center px-4 py-8 sm:px-6 sm:py-12"
        >
          <div className="relative mb-3 sm:mb-4">
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-emerald-400 to-teal-400 opacity-30 blur-lg" />
            <div className="relative rounded-full bg-white p-3 shadow-lg sm:p-4">
              <Upload size={24} className="text-emerald-600 sm:h-8 sm:w-8" weight="duotone" />
            </div>
          </div>
          <p className="mb-1.5 text-center text-sm font-semibold break-words text-gray-900 sm:mb-2 sm:text-base lg:text-lg">
            {imageFile ? imageFile.name : 'Click to select or drag and drop'}
          </p>
          <p className="text-xs text-gray-500 sm:text-sm">JPG, JPEG, PNG (max 5MB)</p>
        </label>
      </div>

      {errorMessage && (
        <p className="ml-1 text-xs text-red-600 sm:text-sm">{errorMessage}</p>
      )}

      {previewUrl && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative h-48 w-full overflow-hidden rounded-xl border border-gray-200 bg-gray-100 sm:h-56 lg:h-64"
        >
          <Image
            src={previewUrl}
            alt="Preview"
            fill
            className="object-contain"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 80vw, 60vw"
          />
        </motion.div>
      )}

      <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:justify-center sm:gap-4 sm:pt-4">
        {isProcessing && (
          <motion.button
            type="button"
            onClick={handleCancel}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full rounded-full border-2 border-gray-300 bg-white px-6 py-3 text-sm font-semibold text-gray-700 shadow-lg transition-all duration-300 hover:bg-gray-50 sm:w-auto sm:px-8 sm:py-4 sm:text-base lg:text-lg"
          >
            Cancel
          </motion.button>
        )}
        <motion.button
          type="button"
          onClick={analyseImage}
          disabled={isProcessing || !imageFile}
          whileHover={{ scale: isProcessing ? 1 : 1.02 }}
          whileTap={{ scale: isProcessing ? 1 : 0.98 }}
          className={cn(
            'group relative w-full rounded-full px-8 py-3 text-sm font-semibold text-white shadow-xl transition-all duration-300 sm:w-auto sm:px-10 sm:py-4 sm:text-base lg:px-12 lg:text-lg',
            'bg-gradient-to-r from-emerald-500 via-emerald-600 to-teal-600',
            'hover:shadow-2xl hover:shadow-emerald-500/50',
            'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100',
            isProcessing || !imageFile ? 'cursor-not-allowed' : 'cursor-pointer',
          )}
        >
          {isProcessing
            ? (
                <span className="flex items-center justify-center gap-2">
                  <CircleNotch size={18} className="animate-spin sm:h-[22px] sm:w-[22px]" />
                  Analysing...
                </span>
              )
            : (
                <>
                  <span className="relative z-10">Analyse Product</span>
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-emerald-600 to-teal-700 opacity-0 transition-opacity group-hover:opacity-100" />
                </>
              )}
        </motion.button>
      </div>
    </div>
  );
}
