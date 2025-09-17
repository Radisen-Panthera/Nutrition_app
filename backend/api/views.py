import csv
import io
import json
from datetime import datetime
from django.http import JsonResponse, HttpResponse
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Analysis
from .serializers import AnalysisSerializer
from .gpt_service import get_food_recommendations, generate_report_html

class UploadCSVView(APIView):
    def post(self, request):
        file = request.FILES.get('file')
        if not file:
            return Response({'error': 'No file provided'}, status=400)
        
        if not file.name.endswith('.csv'):
            return Response({'error': 'File must be CSV'}, status=400)
        
        decoded_file = file.read().decode('utf-8')
        io_string = io.StringIO(decoded_file)
        reader = csv.DictReader(io_string)
        
        all_patients = []
        all_analyses = []
        
        for row in reader:
            patient_data = row
            supplements = []
            
            # 보충제 관련 컬럼 찾기 (Yes, 숫자값, 또는 비어있지 않은 값)
            for key, value in row.items():
                if value and value.strip() and value.strip().lower() != 'no':
                    # 보충제 관련 키워드 체크
                    supplement_keywords = ['vitamin', 'supplement', 'iron', 'calcium', 'omega', 
                                         'folic', 'magnesium', 'zinc', 'probiotics', 'coq10', 
                                         'glucosamine', 'vitamin_a', 'vitamin_b', 'vitamin_c', 
                                         'vitamin_d', 'vitamin_e']
                    
                    if any(keyword in key.lower() for keyword in supplement_keywords):
                        # 보충제명과 값 함께 저장
                        supplement_name = key.replace('_', ' ').title()
                        if value.lower() == 'yes':
                            supplements.append(supplement_name)
                        elif value.replace('.', '').isdigit():  # 숫자값인 경우
                            supplements.append(f"{supplement_name} ({value})")
            
            if supplements:  # 보충제가 있는 환자만 처리
                patient_info = {
                    'patient_id': row.get('patient_id', 'Unknown'),
                    'patient_name': row.get('patient_name', row.get('name', 'Unknown')),
                    'age': row.get('age', 'N/A'),
                    'gender': row.get('gender', 'N/A'),
                    'diagnosis': row.get('diagnosis', row.get('notes', '')),
                    'supplements': supplements
                }
                
                recommendations = get_food_recommendations(supplements, patient_info)
                
                analysis_data = {
                    'patient_info': patient_info,
                    'patient_data': patient_data,
                    'supplements': supplements,
                    'recommendations': recommendations,
                    'timestamp': datetime.now().isoformat()
                }
                
                report_html = generate_report_html(analysis_data)
                
                analysis = Analysis.objects.create(
                    patient_data=patient_data,
                    supplements=supplements,
                    recommendations=recommendations,
                    report_html=report_html
                )
                
                all_analyses.append({
                    'id': analysis.id,
                    'patient_id': patient_info['patient_id'],
                    'patient_name': patient_info['patient_name'],
                    'age': patient_info['age'],
                    'supplements': supplements,
                    'recommendations': recommendations
                })
        
        return Response({
            'patients': all_analyses,
            'total_patients': len(all_analyses),
            'message': f'Successfully analyzed {len(all_analyses)} patients'
        })

class GetReportView(APIView):
    def get(self, request, analysis_id):
        try:
            analysis = Analysis.objects.get(id=analysis_id)
            response = HttpResponse(analysis.report_html, content_type='text/html')
            response['X-Frame-Options'] = 'ALLOWALL'
            response['Content-Security-Policy'] = "frame-ancestors *"
            return response
        except Analysis.DoesNotExist:
            return Response({'error': 'Report not found'}, status=404)

class DownloadReportView(APIView):
    def get(self, request, analysis_id):
        try:
            analysis = Analysis.objects.get(id=analysis_id)
            response = HttpResponse(analysis.report_html, content_type='text/html')
            response['Content-Disposition'] = f'attachment; filename="nutrition_report_{analysis_id}.html"'
            return response
        except Analysis.DoesNotExist:
            return Response({'error': 'Report not found'}, status=404)

class GetAnalysisView(APIView):
    def get(self, request, analysis_id):
        try:
            analysis = Analysis.objects.get(id=analysis_id)
            serializer = AnalysisSerializer(analysis)
            return Response(serializer.data)
        except Analysis.DoesNotExist:
            return Response({'error': 'Analysis not found'}, status=404)