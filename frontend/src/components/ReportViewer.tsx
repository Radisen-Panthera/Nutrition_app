import React from 'react';
import { motion } from 'framer-motion';
import { Download, ArrowLeft, Maximize2 } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';
import { API_BASE_URL } from '../services/api';
import './ReportViewer.css';

interface ReportViewerProps {
  analysisId: number;
  onBack: () => void;
  onReset: () => void;
}

const ReportViewer: React.FC<ReportViewerProps> = ({ analysisId, onBack, onReset }) => {
  const { t } = useTranslation();
  const reportUrl = `${API_BASE_URL}/api/report/${analysisId}/`;
  const downloadUrl = `${API_BASE_URL}/api/report/${analysisId}/download/`;

  const handleDownload = () => {
    window.open(downloadUrl, '_blank');
  };

  const handleFullscreen = () => {
    window.open(reportUrl, '_blank');
  };

  return (
    <motion.div 
      className="report-viewer-container"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
    >
      <div className="report-header glass-card">
        <button 
          onClick={onBack}
          className="back-button"
        >
          <ArrowLeft size={20} />
          {t('report.back')}
        </button>
        
        <h2 className="report-title">{t('report.title')}</h2>
        
        <div className="report-actions">
          <button 
            onClick={handleFullscreen}
            className="icon-button"
            title={t('report.fullscreen')}
          >
            <Maximize2 size={20} />
          </button>
          <button 
            onClick={handleDownload}
            className="download-button premium-button"
          >
            <Download size={20} />
            {t('report.download')}
          </button>
        </div>
      </div>

      <div className="report-frame-container glass-card">
        <iframe 
          src={reportUrl}
          className="report-iframe"
          title="Nutrition Report"
        />
      </div>

      <div className="report-footer">
        <button 
          onClick={onReset}
          className="secondary-button"
        >
          {t('report.newAnalysis')}
        </button>
      </div>
    </motion.div>
  );
};

export default ReportViewer;