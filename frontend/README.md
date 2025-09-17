# Frontend (React + TypeScript + Vite)

이 프로젝트의 프론트엔드는 **React + TypeScript + Vite** 기반 SPA입니다.  
CSV 파일 업로드 → Django API 분석 요청 → 환자별 음식 추천 및 HTML 리포트 조회를 지원합니다.  

TailwindCSS 환경은 설정되어 있으나, 현재는 **CSS 변수 + 전역(App.css) + 컴포넌트별 CSS** 위주로 스타일링하며 Tailwind utility class는 사용하지 않습니다.  

---

## 프로젝트 구조
```text
frontend/
├── dist/                    # 빌드 결과물 (배포용)
├── node_modules/            # 패키지 의존성
├── src/
│   ├── components/          # UI 컴포넌트
│   │   ├── FileUpload.tsx
│   │   ├── PatientSelector.tsx
│   │   ├── FoodRecommendations.tsx
│   │   ├── ReportViewer.tsx
│   │   └── ...
│   ├── hooks/
│   │   └── useTranslation.ts   # i18n 훅
│   ├── locales/              # 다국어 JSON
│   │   ├── en.json
│   │   ├── ko.json
│   │   ├── ar.json
│   │   └── zh.json
│   ├── services/
│   │   └── api.ts            # Django API 연동
│   ├── types/
│   │   └── index.ts
│   ├── App.tsx               # 루트 컴포넌트
│   ├── main.tsx              # 엔트리 포인트
│   ├── App.css               # 전역 스타일 (Glassmorphism UI)
│   └── index.css             # Tailwind 초기화/전역 스타일
│
├── index.html                # Vite 엔트리 HTML
├── package.json              # 의존성/스크립트
├── vite.config.ts            # Vite 설정 (포트/프록시 포함)
├── tsconfig.json             # TS 설정
└── .gitignore
```

---

## 실행 방법

### 1. 환경 준비
- Node.js 18 이상
- npm 또는 yarn

### 2. 설치 & 실행
```bash
cd frontend

# 패키지 설치
npm install

# 개발 서버 실행
npm run dev
```

개발 서버: [http://localhost:30001](http://localhost:30001)  
(Django 백엔드 프록시는 `vite.config.ts`에서 `/api` → `http://localhost:8000` 으로 연결됨)

### 3. 빌드 & 프리뷰
```bash
npm run build
npm run preview
```


## 주요 파일 설명

### main.tsx
앱 엔트리포인트. `App.tsx`를 root DOM에 렌더링합니다.  

```tsx
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

### App.tsx
- CSV 업로드 → 분석 결과 표시 → 리포트 다운로드 전체 UI 관리  
- 상태 관리:  
  - `patients` (환자 목록)  
  - `selectedPatient` (선택 환자)  
  - `showReport` (리포트 뷰어 표시 여부)  
- 다국어 지원 (`useTranslation`)  
- Framer Motion으로 애니메이션 적용  
- react-hot-toast로 알림 표시  

### ervices/api.ts
Django API 연동부  
- `uploadCSV(file)` → CSV 업로드  
- `getAnalysis(id)` → 분석 결과 조회  
- `getAnalysisReport(id)` → HTML 리포트 다운로드  

```ts
const response = await api.post('/api/upload/', formData);
return response.data;
```

### locales/*.json
- 지원 언어: 영어(en), 한국어(ko), 아랍어(ar), 중국어(zh)  
- `useTranslation.ts` 훅을 통해 언어 전환 가능  

### App.css
전역 스타일 정의  
- Glassmorphism 효과  
- CSS 변수(`--primary`, `--secondary`, …) 기반 테마  
- floating shapes 배경 애니메이션 포함  

예시:  
```css
:root {
  --primary: #1a1f3a;
  --secondary: #d4af37;
  --accent: #8b7355;
  --light: #f8f5f0;
}

body {
  font-family: 'Inter', sans-serif;
  background: linear-gradient(135deg, #1a1f3a, #2c3454);
  color: var(--light);
}
```

## 다국어(i18n)
- JSON 기반 다국어 관리 (`locales/`)  
- `useTranslation` 훅으로 현재 언어 조회 및 변경  
- `dir="rtl"` 적용으로 아랍어 RTL 지원  


## 배포 시 참고
- 운영 환경에서는 Django와 동일 도메인에서 정적 파일을 제공하도록 `vite.config.ts` 조정 필요  
- Django `collectstatic` 또는 Nginx 같은 정적 서버 사용 권장  
- `.env` 파일을 도입하여 API URL을 환경별로 관리 가능  

