import React from 'react';
import { motion } from 'framer-motion';
import { ChefHat, Pill, FileText, RotateCcw, Sparkles, ArrowRight } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';
import './FoodRecommendations.css';

interface FoodRecommendationsProps {
  data: {
    id: number;
    supplements: string[];
    recommendations: Array<{
      food: string;
      reason: string;
      mechanism: string;
      nutrients: string[];
    }>;
  };
  onViewReport: () => void;
  onReset: () => void;
}

const FoodRecommendations: React.FC<FoodRecommendationsProps> = ({ 
  data, 
  onViewReport, 
  onReset 
}) => {
  const { t } = useTranslation();

  return (
    <div className="recommendations-container">
      <motion.div 
        className="recommendations-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="recommendations-title">
          <Sparkles className="title-icon" />
          {t('results.title')}
        </h2>
        <p className="recommendations-subtitle">{t('results.subtitle')}</p>
      </motion.div>

      <div className="supplements-section glass-card">
        <h3 className="section-title">
          <Pill className="section-icon" />
          {t('results.supplements')}
        </h3>
        <div className="supplements-grid">
          {data.supplements.map((supplement, index) => (
            <motion.div
              key={index}
              className="supplement-pill"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              {supplement}
            </motion.div>
          ))}
        </div>
      </div>

      <div className="foods-section">
        <h3 className="section-title">
          <ChefHat className="section-icon" />
          {t('results.recommendations')}
        </h3>
        
        <div className="foods-grid">
          {data.recommendations.map((rec, index) => (
            <motion.div
              key={index}
              className="food-card glass-card"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.15 }}
              whileHover={{ scale: 1.02, y: -5 }}
            >
              <div className="food-header">
                <h4 className="food-name">{rec.food}</h4>
                <div className="food-number">{String(index + 1).padStart(2, '0')}</div>
              </div>
              
              <div className="food-content">
                <div className="food-reason">
                  <span className="label">{t('results.reason')}:</span>
                  <p>{rec.reason}</p>
                </div>
                
                <div className="food-mechanism">
                  <span className="label">{t('results.mechanism')}:</span>
                  <p>{rec.mechanism}</p>
                </div>
                
                <div className="nutrients-list">
                  {rec.nutrients.map((nutrient, nIndex) => (
                    <span key={nIndex} className="nutrient-badge">
                      {nutrient}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <motion.div 
        className="actions-section"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <button 
          onClick={onViewReport}
          className="premium-button report-button"
        >
          <FileText size={20} />
          {t('results.viewReport')}
          <ArrowRight size={20} />
        </button>
        
        <button 
          onClick={onReset}
          className="secondary-button"
        >
          <RotateCcw size={20} />
          {t('results.newAnalysis')}
        </button>
      </motion.div>
    </div>
  );
};

export default FoodRecommendations;