'use client';

import { useState, useCallback } from 'react';
import { sha256HexBrowser } from '@/lib/hash';
import { config } from '@/lib/config';

interface FileUploaderProps {
  onFileSelect: (file: File, hash: string) => void;
  onError: (error: string) => void;
  disabled?: boolean;
}

export function FileUploader({ onFileSelect, onError, disabled = false }: FileUploaderProps) {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileChange = useCallback(async (file: File) => {
    if (disabled) return;
    
    // Validation du type
    if (!config.limits.allowedTypes.includes(file.type as any)) {
      onError(`Type de fichier non autorisé. Formats acceptés : PDF, DOCX, PNG`);
      return;
    }
    
    // Validation de la taille
    if (file.size > config.limits.maxFileSize) {
      onError(`Fichier trop volumineux. Taille maximale : ${config.limits.maxFileSize / 1024 / 1024}MB`);
      return;
    }
    
    try {
      setIsProcessing(true);
      const hash = await sha256HexBrowser(file);
      onFileSelect(file, hash);
    } catch (error) {
      onError(error instanceof Error ? error.message : 'Erreur lors du calcul du hash');
    } finally {
      setIsProcessing(false);
    }
  }, [onFileSelect, onError, disabled]);

  const onDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileChange(files[0]);
    }
  }, [handleFileChange]);

  const onDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  }, []);

  const onInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileChange(files[0]);
    }
  }, [handleFileChange]);

  return (
    <div
      className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
        disabled ? 'border-gray-200 bg-gray-50' : 'border-gray-300 bg-white hover:border-blue-400'
      }`}
      onDrop={onDrop}
      onDragOver={onDragOver}
    >
      {isProcessing ? (
        <div className="flex items-center justify-center space-x-2">
          <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-600 border-t-transparent" />
          <span className="text-gray-600">Calcul du hash...</span>
        </div>
      ) : (
        <>
          <p className="text-gray-600 mb-3">
            Glissez-déposez un fichier ici ou cliquez pour sélectionner
          </p>
          <input
            type="file"
            accept=".pdf,.docx,.png"
            onChange={onInputChange}
            disabled={disabled}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 disabled:opacity-50"
          />
          <p className="text-xs text-gray-500 mt-2">
            Formats acceptés : PDF, DOCX, PNG (max {config.limits.maxFileSize / 1024 / 1024}MB)
          </p>
        </>
      )}
    </div>
  );
}
