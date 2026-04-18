from fastapi import APIRouter
from app.schemas.input_schema import VideoInput
from app.schemas.output_schema import PredictionOutput
from app.services.model_service import predict
from app.utils.load_model import load_models

router = APIRouter()

# Load models once when server starts
likes_model, engagement_model, likes_features, engagement_features = load_models()


@router.post("/predict", response_model=PredictionOutput)
def predict_video(input_data: VideoInput):

    # Convert input to dictionary
    data = input_data.dict()

    # Get prediction
    result = predict(
        data,
        likes_model,
        engagement_model,
        likes_features,
        engagement_features
    )

    return result