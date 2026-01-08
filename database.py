import mysql.connector
from mysql.connector import Error
from fastapi import HTTPException
import os

# 数据库配置（从环境变量获取）
DB_CONFIG = {
    "host": os.getenv("MYSQL_HOST", "11.142.154.110"),
    "port": int(os.getenv("MYSQL_PORT", "3306")),
    "database": os.getenv("MYSQL_DATABASE", "1akmr4xp"),
    "user": os.getenv("MYSQL_USER", "with_rjnreclbvckkitot"),
    "password": os.getenv("MYSQL_PASSWORD", "")
}

# 数据库连接函数
def get_db_connection():
    try:
        connection = mysql.connector.connect(**DB_CONFIG)
        return connection
    except Error as e:
        print(f"数据库连接失败: {str(e)}")
        print(f"连接配置: host={DB_CONFIG['host']}, port={DB_CONFIG['port']}, database={DB_CONFIG['database']}, user={DB_CONFIG['user']}")
        raise HTTPException(status_code=500, detail=f"数据库连接失败: {str(e)}")
