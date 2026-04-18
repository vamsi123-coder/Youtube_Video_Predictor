from pydantic import BaseModel
from typing import List, Optional

class VideoInput(BaseModel):
    title: str
    description: str
    tags: str
    video_length: float
    category_id: str
    upload_hour: int

class KeywordInput(BaseModel):
    title: str
    description: str
    tags: str
    category_id: str

class UploadTimeInput(BaseModel):
    category_id: str

class CompareInput(BaseModel):
    titles: List[str]
    description: str
    tags: str
    video_length: float
    category_id: str
    upload_hour: int