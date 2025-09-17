from django.urls import path, include, re_path
from django.conf import settings
from django.conf.urls.static import static
from django.views.generic import TemplateView
from django.views.static import serve
import os

urlpatterns = [
    path('api/', include('api.urls')),
]

# Vite 빌드 파일을 위한 정적 파일 서빙
if settings.DEBUG:
    from django.urls import re_path
    
    # Vite assets 파일 서빙 (JS, CSS 등)
    urlpatterns += [
        re_path(r'^assets/(?P<path>.*)$', serve, {
            'document_root': os.path.join(settings.BASE_DIR.parent, 'frontend', 'dist', 'assets'),
        }),
        re_path(r'^favicon\.ico$', serve, {
            'document_root': os.path.join(settings.BASE_DIR.parent, 'frontend', 'dist'),
            'path': 'favicon.ico',
        }),
    ]
    
    # 기존 media/static 파일 서빙
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

# React SPA를 위한 catch-all 라우트 (반드시 맨 마지막에 위치)
urlpatterns += [
    re_path(r'^.*', TemplateView.as_view(template_name='index.html')),
]