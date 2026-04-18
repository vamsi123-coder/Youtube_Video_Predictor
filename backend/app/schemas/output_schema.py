from pydantic import BaseModel, Field
from typing import List, Dict

class PredictionOutput(BaseModel):
    predicted_likes: float = Field(..., example=15000.5)
    engagement_rate: float = Field(..., example=0.08)
    monetization: str = Field(..., example="High")

class KeywordSuggestion(BaseModel):
    keyword: str
    relevance: str  # "high", "medium", "low"
    source: str     # "title_gap", "trending", "related"

class KeywordOutput(BaseModel):
    current_tags: List[str]
    suggested_keywords: List[KeywordSuggestion]
    missing_in_description: List[str]
    seo_tips: List[str]

class HourData(BaseModel):
    hour: int
    score: float
    label: str

class UploadTimeOutput(BaseModel):
    best_hours: List[int]
    hour_scores: List[HourData]
    recommendation: str
    category: str

class CompareResult(BaseModel):
    title: str
    predicted_likes: float
    engagement_rate: float
    monetization: str
    seo_score: float
    clickbait_score: float
    sentiment: float

class CompareOutput(BaseModel):
    results: List[CompareResult]
    best_title: str
    summary: str