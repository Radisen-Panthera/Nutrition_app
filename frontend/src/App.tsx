import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Toaster, toast } from 'react-hot-toast';
import FileUpload from './components/FileUpload';
import LanguageSelector from './components/LanguageSelector';
import PatientSelector from './components/PatientSelector';
import FoodRecommendations from './components/FoodRecommendations';
import ReportViewer from './components/ReportViewer';
import { uploadCSV } from './services/api';
import { useTranslation } from './hooks/useTranslation';
import './App.css';

interface Patient {
  id: number;
  patient_id: string;
  patient_name: string;
  age: string;
  supplements: string[];
  recommendations: any[];
}

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [patients, setPatients] = useState<Patient[] | null>(null);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [showReport, setShowReport] = useState(false);
  const { t, currentLang, setLanguage } = useTranslation();

  const handleFileUpload = async (file: File) => {
    setIsLoading(true);
    try {
      const response = await uploadCSV(file);
      if (response.patients && response.patients.length > 0) {
        setPatients(response.patients);
        toast.success(`${response.total_patients} patients analyzed successfully`);
      } else {
        toast.error('No valid patient data found');
      }
    } catch (error) {
      toast.error(t('analysis.error'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectPatient = (patient: Patient) => {
    setSelectedPatient(patient);
  };

  const resetAnalysis = () => {
    setPatients(null);
    setSelectedPatient(null);
    setShowReport(false);
  };

  const goBackToPatientList = () => {
    setSelectedPatient(null);
    setShowReport(false);
  };

  return (
    <div className="app" dir={currentLang === 'ar' ? 'rtl' : 'ltr'}>
      <Toaster position="top-center" />
      
      <div className="gradient-overlay" />
      <div className="floating-shapes">
        <div className="shape shape-1" />
        <div className="shape shape-2" />
        <div className="shape shape-3" />
      </div>

      <header className="header">
        <motion.div 
          className="logo-container"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <div className="logo">
            <span className="logo-text">ONCOCROSS</span>
            <span className="logo-subtitle">Precision Nutrition Analysis</span>
          </div>
        </motion.div>
        
        <LanguageSelector 
          currentLang={currentLang}
          onLanguageChange={setLanguage}
        />
      </header>

      <main className="main-content">
        <AnimatePresence mode="wait">
          {!patients ? (
            <motion.div
              key="upload"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="upload-section"
            >
              <div className="hero-text">
                <h1 className="hero-title">
                  {t('hero.title')}
                </h1>
                <p className="hero-subtitle">
                  {t('hero.subtitle')}
                </p>
              </div>
              
              <FileUpload 
                onFileUpload={handleFileUpload}
                isLoading={isLoading}
              />
            </motion.div>
          ) : !selectedPatient ? (
            <motion.div
              key="patient-select"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="results-section"
            >
              <PatientSelector 
                patients={patients}
                onSelectPatient={handleSelectPatient}
              />
              <div style={{ textAlign: 'center', marginTop: '2rem' }}>
                <button onClick={resetAnalysis} className="secondary-button">
                  {t('patients.startNew')}
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="results"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="results-section"
            >
              {/* Prediction Header */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                  textAlign: 'center',
                  marginBottom: '2rem',
                  padding: '1rem',
                  background: 'linear-gradient(135deg, rgba(147, 51, 234, 0.05), rgba(79, 70, 229, 0.05))',
                  borderRadius: '12px',
                  border: '1px solid rgba(147, 51, 234, 0.2)'
                }}
              >
                <div style={{
                  fontSize: '0.875rem',
                  color: '#6366f1',
                  marginBottom: '0.5rem',
                  fontWeight: '500'
                }}>
                  Predicted by
                </div>
                <div style={{
                  fontSize: '1.5rem',
                  fontWeight: '700',
                  background: 'linear-gradient(135deg, #ffffffff, #c2eb51ff)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}>
                  RAPTOR AI from ONCOCROSS
                </div>
                <div style={{
                  marginTop: '0.5rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.25rem 1rem',
                  background: 'rgba(16, 185, 129, 0.1)',
                  borderRadius: '9999px',
                  border: '1px solid rgba(16, 185, 129, 0.3)'
                }}>
                  <span style={{
                    width: '8px',
                    height: '8px',
                    background: '#10b981',
                    borderRadius: '50%',
                    animation: 'pulse 2s infinite'
                  }} />
                  <span style={{
                    fontSize: '0.75rem',
                    color: '#10b981',
                    fontWeight: '600'
                  }}>
                    TOP 10% ACCURACY
                  </span>
                </div>
              </motion.div>

              {!showReport ? (
                <>
                  <FoodRecommendations 
                    data={selectedPatient}
                    onViewReport={() => setShowReport(true)}
                    onReset={goBackToPatientList}
                  />
                </>
              ) : (
                <ReportViewer 
                  analysisId={selectedPatient.id}
                  onBack={() => setShowReport(false)}
                  onReset={goBackToPatientList}
                />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="footer">
        <div className="footer-content" style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem'
          }}>
            <span style={{
              fontSize: '0.875rem',
              color: '#9ca3af',
              fontWeight: '500'
            }}>
              Presented by
            </span>
            <span style={{
              fontSize: '1.125rem',
              fontWeight: '700',
              background: 'linear-gradient(135deg, #ffffffff, #cbe546ff)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              RAPTOR AI
            </span>
            <span style={{
              fontSize: '0.875rem',
              color: '#9ca3af'
            }}>
              from
            </span>
            <span style={{
              fontSize: '1rem',
              fontWeight: '600',
              color: '#e5e7eb'
            }}>
              ONCOCROSS
            </span>
          </div>
          <p style={{
            fontSize: '0.75rem',
            color: '#6b7280'
          }}>
            © 2025 ONCOCROSS | Advanced AI-Powered Healthcare Solutions
          </p>
        </div>
      </footer>

      <style>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }
      `}</style>
    </div>
  );
}

export default App;