from django.db import models

class Analysis(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    patient_data = models.JSONField()
    supplements = models.JSONField()
    recommendations = models.JSONField()
    report_html = models.TextField()
    
    class Meta:
        ordering = ['-created_at']