import axios from 'axios';

// 상대 경로 사용 - Django가 같은 포트에서 서빙
export const API_BASE_URL = '';  // 빈 문자열로 설정하여 현재 도메인 사용

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'multipart/form-data',
  },
});

export const uploadCSV = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await api.post('/api/upload/', formData);
  return response.data;
};

export const getAnalysis = async (id: number) => {
  const response = await api.get(`/api/analysis/${id}/`);
  return response.data;
};

// 보고서 다운로드 함수 (있다면)
export const getAnalysisReport = async (analysisId: number) => {
  const response = await api.get(`/api/analysis/${analysisId}/report`, {
    responseType: 'blob'
  });
  return response.data;
};