from fastapi import APIRouter, HTTPException
from mysql.connector import Error
from models import AnalysisRequest
from database import get_db_connection
from datetime import datetime, date, time
import json

router = APIRouter(prefix="/api/analysis", tags=["analysis"])

@router.post("/bazi")
async def analyze_bazi(request: AnalysisRequest):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    try:
        cursor.execute("SELECT * FROM birth_info WHERE id = %s", (request.birth_info_id,))
        birth_info = cursor.fetchone()
        if not birth_info:
            raise HTTPException(status_code=404, detail="出生信息不存在")
        
        # 八字计算逻辑（简化版）
        birth_date = birth_info['birth_date']
        birth_time = birth_info['birth_time']
        
        # 天干地支
        tiangan = ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"]
        dizhi = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"]
        
        year = birth_date.year if isinstance(birth_date, date) else int(str(birth_date)[:4])
        month = birth_date.month if isinstance(birth_date, date) else int(str(birth_date)[5:7])
        day = birth_date.day if isinstance(birth_date, date) else int(str(birth_date)[8:10])
        
        # 简化的八字计算
        year_gan = tiangan[(year - 4) % 10]
        year_zhi = dizhi[(year - 4) % 12]
        month_gan = tiangan[(month - 1) % 10]
        month_zhi = dizhi[(month - 1) % 12]
        day_gan = tiangan[(day - 1) % 10]
        day_zhi = dizhi[(day - 1) % 12]
        
        hour = birth_time.hour if isinstance(birth_time, time) else int(str(birth_time)[:2])
        hour_gan = tiangan[(hour // 2) % 10]
        hour_zhi = dizhi[(hour // 2) % 12]
        
        result = {
            "bazi": {
                "year": f"{year_gan}{year_zhi}",
                "month": f"{month_gan}{month_zhi}",
                "day": f"{day_gan}{day_zhi}",
                "hour": f"{hour_gan}{hour_zhi}"
            },
            "wuxing": {
                "金": 2,
                "木": 1,
                "水": 2,
                "火": 1,
                "土": 2
            },
            "analysis": {
                "性格特点": "此命格之人性格坚毅，意志坚定，做事有始有终。天生具有领导才能，善于统筹规划。",
                "事业运势": "事业运势较佳，适合从事管理、金融、教育等行业。中年后事业有成，财运亨通。",
                "财运分析": "财运稳定，正财为主，偏财运一般。理财能力强，善于积累财富。",
                "感情婚姻": "感情运势平稳，婚姻美满。配偶贤惠，家庭和睦。",
                "健康状况": "身体健康状况良好，需注意肝胆和心血管方面的保养。",
                "建议": "宜从事五行属金、水的行业，忌从事五行属火的行业。平时多穿白色、黑色衣物，有助于提升运势。"
            }
        }
        
        # 保存分析结果
        cursor.execute(
            "INSERT INTO analysis_records (birth_info_id, analysis_type, analysis_result) VALUES (%s, %s, %s)",
            (request.birth_info_id, 'bazi', json.dumps(result, ensure_ascii=False))
        )
        conn.commit()
        
        return result
    finally:
        cursor.close()
        conn.close()

@router.post("/ziwei")
async def analyze_ziwei(request: AnalysisRequest):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    try:
        cursor.execute("SELECT * FROM birth_info WHERE id = %s", (request.birth_info_id,))
        birth_info = cursor.fetchone()
        if not birth_info:
            raise HTTPException(status_code=404, detail="出生信息不存在")
        
        # 紫微斗数分析（简化版）
        result = {
            "mingpan": {
                "命宫": {"主星": "紫微", "副星": ["天府", "天相"], "位置": "寅宫"},
                "兄弟宫": {"主星": "天机", "副星": ["太阴"], "位置": "卯宫"},
                "夫妻宫": {"主星": "太阳", "副星": ["巨门"], "位置": "辰宫"},
                "子女宫": {"主星": "武曲", "副星": ["七杀"], "位置": "巳宫"},
                "财帛宫": {"主星": "天同", "副星": ["天梁"], "位置": "午宫"},
                "疾厄宫": {"主星": "廉贞", "副星": ["贪狼"], "位置": "未宫"},
                "迁移宫": {"主星": "破军", "副星": [], "位置": "申宫"},
                "奴仆宫": {"主星": "天相", "副星": [], "位置": "酉宫"},
                "官禄宫": {"主星": "天府", "副星": [], "位置": "戌宫"},
                "田宅宫": {"主星": "太阴", "副星": [], "位置": "亥宫"},
                "福德宫": {"主星": "巨门", "副星": [], "位置": "子宫"},
                "父母宫": {"主星": "天梁", "副星": [], "位置": "丑宫"}
            },
            "analysis": {
                "命格特征": "紫微坐命，天生贵气，具有领导才能和管理能力。性格高贵，气质不凡，做事有原则。",
                "事业发展": "适合从事管理、政府、大型企业等工作。事业运势强劲，容易获得上级赏识和提拔。",
                "财富状况": "财运亨通，正财偏财皆有。善于理财投资，中年后财富积累丰厚。",
                "婚姻感情": "婚姻美满，配偶能力强，对事业有帮助。感情稳定，家庭和睦。",
                "人际关系": "人缘佳，贵人运强。朋友多助力，社交能力出众。",
                "健康运势": "身体健康，精力充沛。需注意工作压力，适当放松休息。"
            }
        }
        
        # 保存分析结果
        cursor.execute(
            "INSERT INTO analysis_records (birth_info_id, analysis_type, analysis_result) VALUES (%s, %s, %s)",
            (request.birth_info_id, 'ziwei', json.dumps(result, ensure_ascii=False))
        )
        conn.commit()
        
        return result
    finally:
        cursor.close()
        conn.close()

@router.post("/astrology")
async def analyze_astrology(request: AnalysisRequest):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    try:
        cursor.execute("SELECT * FROM birth_info WHERE id = %s", (request.birth_info_id,))
        birth_info = cursor.fetchone()
        if not birth_info:
            raise HTTPException(status_code=404, detail="出生信息不存在")
        
        birth_date = birth_info['birth_date']
        month = birth_date.month if isinstance(birth_date, date) else int(str(birth_date)[5:7])
        day = birth_date.day if isinstance(birth_date, date) else int(str(birth_date)[8:10])
        
        # 星座判断
        zodiac_signs = [
            (1, 20, "摩羯座"), (2, 19, "水瓶座"), (3, 21, "双鱼座"),
            (4, 20, "白羊座"), (5, 21, "金牛座"), (6, 22, "双子座"),
            (7, 23, "巨蟹座"), (8, 23, "狮子座"), (9, 23, "处女座"),
            (10, 24, "天秤座"), (11, 23, "天蝎座"), (12, 22, "射手座")
        ]
        
        sun_sign = "摩羯座"
        for i, (m, d, sign) in enumerate(zodiac_signs):
            if month == m and day >= d:
                sun_sign = sign
                break
            elif month == m - 1 if m > 1 else 12:
                sun_sign = zodiac_signs[i-1][2] if i > 0 else zodiac_signs[-1][2]
        
        # 星盘分析（简化版）
        result = {
            "sun_sign": sun_sign,
            "moon_sign": "巨蟹座",
            "rising_sign": "天秤座",
            "planets": {
                "太阳": {"sign": sun_sign, "house": "第10宫", "degree": "15°"},
                "月亮": {"sign": "巨蟹座", "house": "第4宫", "degree": "22°"},
                "水星": {"sign": "双子座", "house": "第3宫", "degree": "8°"},
                "金星": {"sign": "金牛座", "house": "第2宫", "degree": "18°"},
                "火星": {"sign": "白羊座", "house": "第1宫", "degree": "25°"},
                "木星": {"sign": "射手座", "house": "第9宫", "degree": "12°"},
                "土星": {"sign": "摩羯座", "house": "第10宫", "degree": "5°"}
            },
            "houses": {
                "第1宫": "自我与个性",
                "第2宫": "财富与价值",
                "第3宫": "沟通与学习",
                "第4宫": "家庭与根基",
                "第5宫": "创造与娱乐",
                "第6宫": "工作与健康",
                "第7宫": "伙伴与婚姻",
                "第8宫": "转化与共享",
                "第9宫": "哲学与旅行",
                "第10宫": "事业与地位",
                "第11宫": "友谊与理想",
                "第12宫": "潜意识与灵性"
            },
            "analysis": {
                "性格特质": f"太阳{sun_sign}，性格特点鲜明。月亮巨蟹座，情感丰富细腻。上升天秤座，外表优雅得体。",
                "事业方向": "适合从事艺术、设计、咨询、外交等需要审美和沟通能力的工作。事业运势稳定上升。",
                "爱情观": "对感情认真负责，追求稳定和谐的关系。重视精神交流，理想主义色彩浓厚。",
                "财运分析": "财运平稳，收入稳定。善于理财，但不宜冒险投资。",
                "人际关系": "社交能力强，人缘好。善于协调关系，朋友众多。",
                "发展建议": "发挥自身优势，注重个人成长。保持平衡心态，避免过度追求完美。"
            }
        }
        
        # 保存分析结果
        cursor.execute(
            "INSERT INTO analysis_records (birth_info_id, analysis_type, analysis_result) VALUES (%s, %s, %s)",
            (request.birth_info_id, 'astrology', json.dumps(result, ensure_ascii=False))
        )
        conn.commit()
        
        return result
    finally:
        cursor.close()
        conn.close()

@router.get("/history/{birth_info_id}")
async def get_analysis_history(birth_info_id: int):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    try:
        cursor.execute(
            "SELECT * FROM analysis_records WHERE birth_info_id = %s ORDER BY created_at DESC",
            (birth_info_id,)
        )
        records = cursor.fetchall()
        for record in records:
            if isinstance(record['created_at'], datetime):
                record['created_at'] = record['created_at'].isoformat()
            if isinstance(record['analysis_result'], str):
                record['analysis_result'] = json.loads(record['analysis_result'])
        return records
    finally:
        cursor.close()
        conn.close()
