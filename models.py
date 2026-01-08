from pydantic import BaseModel
from typing import Optional

class UserCreate(BaseModel):
    wechat_openid: str
    nickname: str
    avatar_url: Optional[str] = None

class BirthInfoCreate(BaseModel):
    user_id: int
    nickname: str
    birth_date: str
    birth_time: str
    birth_place: Optional[str] = None
    gender: str
    longitude: Optional[float] = None
    latitude: Optional[float] = None

class BirthInfoUpdate(BaseModel):
    nickname: Optional[str] = None
    birth_date: Optional[str] = None
    birth_time: Optional[str] = None
    birth_place: Optional[str] = None
    gender: Optional[str] = None
    longitude: Optional[float] = None
    latitude: Optional[float] = None

class AnalysisRequest(BaseModel):
    birth_info_id: int
    analysis_type: str
