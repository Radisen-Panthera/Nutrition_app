import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion } from 'framer-motion';
import { Upload, FileSpreadsheet, Sparkles } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';
import './FileUpload.css';

interface FileUploadProps {
  onFileUpload: (file: File) => void;
  isLoading: boolean;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileUpload, isLoading }) => {
  const { t } = useTranslation();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      onFileUpload(acceptedFiles[0]);
    }
  }, [onFileUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv']
    },
    multiple: false,
    disabled: isLoading
  });

  return (
    <motion.div
      className={`upload-container ${isDragActive ? 'drag-active' : ''} ${isLoading ? 'loading' : ''}`}
      whileHover={{ scale: isLoading ? 1 : 1.02 }}
      whileTap={{ scale: isLoading ? 1 : 0.98 }}
    >
      <div {...getRootProps()} className="upload-zone">
        <input {...getInputProps()} />
        
        <div className="upload-icon-wrapper">
          {isLoading ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <Sparkles size={60} className="upload-icon spinning" />
            </motion.div>
          ) : (
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {isDragActive ? (
                <FileSpreadsheet size={60} className="upload-icon" />
              ) : (
                <Upload size={60} className="upload-icon" />
              )}
            </motion.div>
          )}
        </div>

        <div className="upload-text">
          <h3 className="upload-title">
            {isLoading ? t('upload.processing') : 
             isDragActive ? t('upload.drop') : t('upload.title')}
          </h3>
          <p className="upload-subtitle">
            {isLoading ? t('upload.analyzing') : t('upload.subtitle')}
          </p>
        </div>

        {!isLoading && (
          <div className="upload-badge">
            CSV {t('upload.format')}
          </div>
        )}

        {isLoading && (
          <div className="progress-bar">
            <motion.div 
              className="progress-fill"
              initial={{ width: '0%' }}
              animate={{ width: '100%' }}
              transition={{ duration: 3 }}
            />
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default FileUpload;