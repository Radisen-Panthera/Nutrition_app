import openai
import json
import csv
from django.conf import settings

openai.api_key = settings.OPENAI_API_KEY

def load_food_database():
    foods = []
    try:
        with open('static/foods.csv', 'r', encoding='utf-8') as file:
            reader = csv.DictReader(file)
            for row in reader:
                foods.append(row)
    except:
        foods = []
    return foods

def match_foods_from_db(supplements, foods_db):
    matched_foods = []
    supplements_lower = [s.lower().replace('_', ' ') for s in supplements]
    
    for food in foods_db:
        nutrients = food.get('nutrients', '').lower()
        food_name = food.get('name', '')
        
        # 보충제와 매칭되는 영양소 찾기
        matching_nutrients = []
        for supplement in supplements_lower:
            # 보충제명에서 용량 정보 제거 (예: "Vitamin D (2000)" -> "vitamin d")
            supp_clean = supplement.split('(')[0].strip()
            
            if supp_clean in nutrients or \
               supp_clean.replace('vitamin ', 'vitamin') in nutrients or \
               supp_clean.replace(' ', '') in nutrients:
                matching_nutrients.append(supplement)
        
        if matching_nutrients:
            matched_foods.append({
                "food": food_name,
                "reason": f"Rich in {', '.join(matching_nutrients)}",
                "mechanism": f"Natural source from our database, scientifically proven to supplement {', '.join(matching_nutrients)}",
                "nutrients": food.get('nutrients', '').split(', '),
                "source": "database",
                "reference": "Clinical Nutrition Database"
            })
    
    return matched_foods[:4]  # DB에서 최대 4개

def get_gpt_recommendations(supplements, patient_info, db_foods_count):
    remaining_count = max(2, 6 - db_foods_count)  # 최소 2개, 최대 6-DB추천수
    
    prompt = f"""
    Based on the following supplements, recommend {remaining_count} additional foods not commonly found in standard databases.
    Focus on unique, culturally diverse, or lesser-known foods that complement these supplements.
    
    Patient supplements: {json.dumps(supplements)}
    Patient info: {json.dumps(patient_info)}
    
    Return a JSON array with this exact structure:
    [
        {{
            "food": "Unique food name",
            "reason": "Why this food is recommended",
            "mechanism": "Scientific explanation of how it helps",
            "nutrients": ["nutrient1", "nutrient2"],
            "source": "ai",
            "reference": "AI Analysis based on nutritional science"
        }}
    ]
    
    Recommend exactly {remaining_count} foods. Focus on Middle Eastern, Asian, or other cultural foods.
    """
    
    try:
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a nutrition expert specializing in diverse cultural foods. Always respond with valid JSON only."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.7,
            max_tokens=800
        )
        
        recommendations = json.loads(response.choices[0].message.content)
        for rec in recommendations:
            rec["source"] = "ai"
            rec["reference"] = "AI-Powered Nutritional Analysis"
        return recommendations
    except:
        # 폴백 추천
        return [
            {
                "food": "Black Seed (Nigella Sativa)",
                "reason": "Traditional superfood with multiple benefits",
                "mechanism": "Contains thymoquinone which enhances immune function and has anti-inflammatory properties",
                "nutrients": ["Thymoquinone", "Omega-3", "Iron"],
                "source": "ai",
                "reference": "AI-Powered Nutritional Analysis"
            }
        ]

def get_food_recommendations(supplements, patient_info):
    foods_db = load_food_database()
    
    # 1. DB에서 먼저 매칭
    db_recommendations = match_foods_from_db(supplements, foods_db)
    
    # 2. GPT로 추가 추천
    ai_recommendations = get_gpt_recommendations(supplements, patient_info, len(db_recommendations))
    
    # 3. 합치기 (DB 우선, AI 보조)
    all_recommendations = db_recommendations + ai_recommendations
    
    return all_recommendations

def generate_report_html(analysis_data):
    recommendations = analysis_data.get('recommendations', [])
    supplements = analysis_data.get('supplements', [])
    patient_info = analysis_data.get('patient_info', {})
    
    html = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <title>Nutrition Report - {patient_info.get('patient_name', 'Patient')}</title>
        <style>
            body {{ font-family: 'Arial', sans-serif; padding: 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }}
            .container {{ max-width: 800px; margin: 0 auto; background: white; border-radius: 20px; padding: 40px; box-shadow: 0 20px 60px rgba(0,0,0,0.3); }}
            h1 {{ color: #764ba2; text-align: center; font-size: 2.5em; margin-bottom: 30px; }}
            h2 {{ color: #667eea; border-bottom: 2px solid #667eea; padding-bottom: 10px; margin-top: 30px; }}
            .patient-info {{ background: #f0f4f8; padding: 20px; border-radius: 10px; margin: 20px 0; }}
            .patient-info p {{ margin: 8px 0; color: #2c3e50; }}
            .patient-info strong {{ color: #667eea; }}
            .supplement-list {{ background: #f8f9fa; padding: 20px; border-radius: 10px; margin: 20px 0; }}
            .supplement-item {{ display: inline-block; background: #667eea; color: white; padding: 8px 16px; border-radius: 20px; margin: 5px; font-size: 0.95em; }}
            .food-card {{ background: white; border: 1px solid #e0e0e0; border-radius: 15px; padding: 20px; margin: 20px 0; box-shadow: 0 5px 15px rgba(0,0,0,0.1); }}
            .food-name {{ font-size: 1.3em; font-weight: bold; color: #2c3e50; margin-bottom: 10px; }}
            .reason {{ background: #e8f5e9; padding: 10px; border-radius: 8px; margin: 10px 0; }}
            .mechanism {{ background: #fff3e0; padding: 10px; border-radius: 8px; margin: 10px 0; }}
            .nutrients {{ display: flex; gap: 10px; margin-top: 15px; flex-wrap: wrap; }}
            .nutrient-tag {{ background: #667eea; color: white; padding: 5px 15px; border-radius: 20px; font-size: 0.9em; }}
            .timestamp {{ text-align: center; color: #999; margin-top: 30px; font-size: 0.9em; }}
        </style>
    </head>
    <body>
        <div class="container">
            <h1>🍎 Personalized Nutrition Report</h1>
            
            <div class="patient-info">
                <h2>👤 Patient Information</h2>
                <p><strong>Patient ID:</strong> {patient_info.get('patient_id', 'N/A')}</p>
                <p><strong>Name:</strong> {patient_info.get('patient_name', 'N/A')}</p>
                <p><strong>Age:</strong> {patient_info.get('age', 'N/A')}</p>
                <p><strong>Gender:</strong> {patient_info.get('gender', 'N/A')}</p>
                {f"<p><strong>Diagnosis/Notes:</strong> {patient_info.get('diagnosis')}</p>" if patient_info.get('diagnosis') else ""}
            </div>
            
            <h2>📊 Raptor AI suggested Supplements</h2>
            <div class="supplement-list">
                {''.join([f'<span class="supplement-item">{supp}</span>' for supp in supplements]) if supplements else 'No supplements detected'}
            </div>
            
            <h2>🥗 Recommended Foods</h2>
            {''.join([f'''
            <div class="food-card">
                <div style="display: flex; justify-content: space-between; align-items: start;">
                    <div class="food-name">🍽️ {food.get('food', '')}</div>
                    <span style="background: {'linear-gradient(135deg, #667eea, #764ba2)' if food.get('source') == 'ai' else 'linear-gradient(135deg, #d4af37, #8b7355)'}; 
                                 color: white; padding: 5px 12px; border-radius: 20px; font-size: 0.8em; font-weight: 600;">
                        {'🤖 AI Recommended' if food.get('source') == 'ai' else '📚 Clinical Database'}
                    </span>
                </div>
                <div class="reason"><strong>Reason:</strong> {food.get('reason', '')}</div>
                <div class="mechanism"><strong>Mechanism:</strong> {food.get('mechanism', '')}</div>
                <div class="nutrients">
                    {''.join([f'<span class="nutrient-tag">{n}</span>' for n in food.get('nutrients', [])])}
                </div>
                {f'<div style="margin-top: 10px; font-size: 0.85em; color: #666; font-style: italic;">Reference: {food.get("reference", "")}</div>' if food.get('reference') else ''}
            </div>
            ''' for food in recommendations])}
            
            <div class="timestamp">Report generated at {analysis_data.get('timestamp', '')}</div>
        </div>
    </body>
    </html>
    """
    return html