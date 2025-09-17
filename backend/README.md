# Backend (Django REST Framework)

이 프로젝트의 백엔드는 Django REST Framework 기반 API 서버입니다 


## 프로젝트 구조
```backend/
├── api/ # 주요 앱 (비즈니스 로직)
│ ├── gpt_service.py # GPT 기반 추천/리포트 생성 로직
│ ├── models.py # Analysis 모델 정의
│ ├── serializers.py # 직렬화 로직
│ ├── urls.py # API 라우팅
│ └── views.py # 뷰 (업로드/리포트/분석 API)
│
├── config/ # Django 프로젝트 설정
│ ├── settings.py
│ ├── urls.py
│ └── wsgi.py
│
├── static/ # 정적 리소스
│ └── foods.csv # 예시 CSV 파일
│
├── db.sqlite3 # 개발용 SQLite DB
├── manage.py # Django 관리 스크립트
└── requirements.txt # Python 의존성
```


## 실행 방법

### 1. 환경 준비
- Python 3.10 이상  
- Django 4.x + Django REST Framework  
- 가상환경 사용 권장 (`venv`)  

### 2. 설치 및 실행
```bash
# 가상환경 생성 및 활성화
python -m venv venv
source venv/bin/activate   # Mac/Linux
venv\Scripts\activate      # Windows

# 의존성 설치
pip install -r requirements.txt

# DB 마이그레이션
python manage.py migrate

# 개발 서버 실행
python manage.py runserver
```

API 서버는 http://127.0.0.1:8000/ 에서 실행됩니다.

## 주요 파일 설명
### manage.py
Django 명령 실행 진입점 (runserver, migrate 등)

### api/urls.py
등록된 엔드포인트:

- POST /api/upload/ → CSV 업로드 및 분석
- GET /api/analysis/<id>/ → 분석 데이터 조회
- GET /api/report/<id>/ → HTML 리포트 조회
- GET /api/report/<id>/download/ → 리포트 다운로드

### api/views.py
- UploadCSVView: CSV 업로드 및 환자 데이터 분석 → DB 저장
- GetReportView: HTML 리포트 조회
- DownloadReportView: HTML 리포트 다운로드
- GetAnalysisView: JSON 기반 데이터 반환

## api/models.py
### Analysis 모델

- patient_data: 환자 원본 데이터(JSON)
- supplements: 복용 보충제 목록(JSON)
- recommendations: GPT 음식 추천(JSON)
- report_html: HTML 리포트(Text)
- created_at: 생성 시각

## API 사용 예시
1) CSV 업로드
```bash
Copy code
POST /api/upload/
Content-Type: multipart/form-data
file: foods.csv
Response:
{
  "patients": [
    {
      "id": 1,
      "patient_id": "123",
      "patient_name": "John Doe",
      "age": "45",
      "supplements": ["Vitamin D", "Iron (10mg)"],
      "recommendations": ["Eat more leafy greens", "Include fish oil"]
    }
  ],
  "total_patients": 1,
  "message": "Successfully analyzed 1 patients"
}
```
2) 분석 결과 조회
```
GET /api/analysis/1/
Response:

json
Copy code
{
  "id": 1,
  "patient_data": {...},
  "supplements": [...],
  "recommendations": [...],
  "report_html": "<html>...</html>",
  "created_at": "2025-09-17T12:34:56Z"
}
```

## 배포 시 참고
- SQLite → PostgreSQL/MySQL 교체 권장
- .env 파일에 SECRET_KEY, DEBUG, ALLOWED_HOSTS 환경변수 관리
- 운영 시 DEBUG=False, ALLOWED_HOSTS 반드시 지정

## 정적 파일 수집:

| python manage.py collectstatic

