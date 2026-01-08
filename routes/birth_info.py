from fastapi import APIRouter, HTTPException
from mysql.connector import Error
from models import BirthInfoCreate, BirthInfoUpdate
from database import get_db_connection
from datetime import datetime, date, time

router = APIRouter(prefix="/api/birth-info", tags=["birth-info"])

@router.post("")
async def create_birth_info(birth_info: BirthInfoCreate):
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute(
            """INSERT INTO birth_info (user_id, nickname, birth_date, birth_time, birth_place, gender, longitude, latitude)
               VALUES (%s, %s, %s, %s, %s, %s, %s, %s)""",
            (birth_info.user_id, birth_info.nickname, birth_info.birth_date, birth_info.birth_time,
             birth_info.birth_place, birth_info.gender, birth_info.longitude, birth_info.latitude)
        )
        conn.commit()
        return {"success": True, "birth_info_id": cursor.lastrowid}
    except Error as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        cursor.close()
        conn.close()

@router.get("/user/{user_id}")
async def get_user_birth_info(user_id: int):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    try:
        cursor.execute("SELECT * FROM birth_info WHERE user_id = %s ORDER BY created_at DESC", (user_id,))
        birth_infos = cursor.fetchall()
        for info in birth_infos:
            if isinstance(info['birth_date'], date):
                info['birth_date'] = info['birth_date'].isoformat()
            if isinstance(info['birth_time'], (time, datetime)):
                info['birth_time'] = info['birth_time'].strftime('%H:%M:%S') if isinstance(info['birth_time'], time) else info['birth_time'].time().strftime('%H:%M:%S')
            if isinstance(info['created_at'], datetime):
                info['created_at'] = info['created_at'].isoformat()
            if isinstance(info['updated_at'], datetime):
                info['updated_at'] = info['updated_at'].isoformat()
        return birth_infos
    finally:
        cursor.close()
        conn.close()

@router.put("/{birth_info_id}")
async def update_birth_info(birth_info_id: int, birth_info: BirthInfoUpdate):
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        updates = []
        values = []
        if birth_info.nickname:
            updates.append("nickname = %s")
            values.append(birth_info.nickname)
        if birth_info.birth_date:
            updates.append("birth_date = %s")
            values.append(birth_info.birth_date)
        if birth_info.birth_time:
            updates.append("birth_time = %s")
            values.append(birth_info.birth_time)
        if birth_info.birth_place:
            updates.append("birth_place = %s")
            values.append(birth_info.birth_place)
        if birth_info.gender:
            updates.append("gender = %s")
            values.append(birth_info.gender)
        if birth_info.longitude is not None:
            updates.append("longitude = %s")
            values.append(birth_info.longitude)
        if birth_info.latitude is not None:
            updates.append("latitude = %s")
            values.append(birth_info.latitude)
        
        if not updates:
            raise HTTPException(status_code=400, detail="没有需要更新的字段")
        
        values.append(birth_info_id)
        sql = f"UPDATE birth_info SET {', '.join(updates)} WHERE id = %s"
        cursor.execute(sql, values)
        conn.commit()
        return {"success": True}
    except Error as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        cursor.close()
        conn.close()

@router.delete("/{birth_info_id}")
async def delete_birth_info(birth_info_id: int):
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("DELETE FROM birth_info WHERE id = %s", (birth_info_id,))
        conn.commit()
        return {"success": True}
    except Error as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        cursor.close()
        conn.close()
