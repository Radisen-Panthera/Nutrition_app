from django.urls import path
from .views import UploadCSVView, GetReportView, DownloadReportView, GetAnalysisView

urlpatterns = [
    path('upload/', UploadCSVView.as_view(), name='upload-csv'),
    path('analysis/<int:analysis_id>/', GetAnalysisView.as_view(), name='get-analysis'),
    path('report/<int:analysis_id>/', GetReportView.as_view(), name='get-report'),
    path('report/<int:analysis_id>/download/', DownloadReportView.as_view(), name='download-report'),
]