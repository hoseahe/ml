from fastapi import APIRouter, HTTPException
from mysql.connector import Error
from models import UserCreate
from database import get_db_connection

router = APIRouter(prefix="/api/users", tags=["users"])

@router.post("")
async def create_user(user: UserCreate):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    try:
        cursor.execute(
            "INSERT INTO users (wechat_openid, nickname, avatar_url) VALUES (%s, %s, %s) ON DUPLICATE KEY UPDATE nickname=%s, avatar_url=%s",
            (user.wechat_openid, user.nickname, user.avatar_url, user.nickname, user.avatar_url)
        )
        conn.commit()
        user_id = cursor.lastrowid
        if user_id == 0:
            cursor.execute("SELECT id FROM users WHERE wechat_openid = %s", (user.wechat_openid,))
            result = cursor.fetchone()
            user_id = result['id']
        return {"success": True, "user_id": user_id}
    except Error as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        cursor.close()
        conn.close()

@router.get("/{wechat_openid}")
async def get_user(wechat_openid: str):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    try:
        cursor.execute("SELECT * FROM users WHERE wechat_openid = %s", (wechat_openid,))
        user = cursor.fetchone()
        if not user:
            raise HTTPException(status_code=404, detail="用户不存在")
        return user
    finally:
        cursor.close()
        conn.close()
