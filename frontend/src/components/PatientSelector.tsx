import React from 'react';
import { motion } from 'framer-motion';
import { Users, User, ChevronRight } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';
import './PatientSelector.css';

interface Patient {
  id: number;
  patient_id: string;
  patient_name: string;
  age: string;
  supplements: string[];
  recommendations: any[];  // 추가된 필드
}

interface PatientSelectorProps {
  patients: Patient[];
  onSelectPatient: (patient: Patient) => void;
}

const PatientSelector: React.FC<PatientSelectorProps> = ({ patients, onSelectPatient }) => {
  const { t } = useTranslation();
  
  return (
    <div className="patient-selector-container">
      <div className="patient-selector-header">
        <Users className="header-icon" />
        <h2>{t('patients.title')}</h2>
        <span className="patient-count">{patients.length} {t('patients.count')}</span>
      </div>
      
      <div className="patients-grid">
        {patients.map((patient, index) => (
          <motion.div
            key={patient.id}
            className="patient-card glass-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
            onClick={() => onSelectPatient(patient)}
          >
            <div className="patient-card-header">
              <User className="patient-icon" />
              <div className="patient-info">
                <h3>{patient.patient_name}</h3>
                <p>ID: {patient.patient_id} | {t('patients.age')}: {patient.age}</p>
              </div>
              <ChevronRight className="arrow-icon" />
            </div>
            
            <div className="supplements-preview">
              <span className="preview-label">{t('patients.supplementsDetected')}:</span>
              <div className="supplement-tags">
                {patient.supplements.slice(0, 3).map((supp, idx) => (
                  <span key={idx} className="supplement-tag">{supp}</span>
                ))}
                {patient.supplements.length > 3 && (
                  <span className="more-tag">+{patient.supplements.length - 3} {t('patients.more')}</span>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default PatientSelector;