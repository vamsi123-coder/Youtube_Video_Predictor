import pandas as pd
import numpy as np
import sys
import os

# Ensure src module is accessible for feature functions
BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../../"))
if BASE_DIR not in sys.path:
    sys.path.append(BASE_DIR)

from src.feature_engineering import add_title_sentiment, add_clickbait_score, add_seo_score


def get_monetization_label(x):
    if x < 0.02:
        return "Low"
    elif x < 0.05:
        return "Medium"
    return "High"


def predict(data, likes_model, engagement_model, likes_features, engagement_features):

    df = pd.DataFrame([data])

    # Add proxy statistics for new videos based on baseline averages
    df["channel_subscriber_count"] = 100000 
    df["channel_video_count"] = 50

    # Apply real feature engineering logic
    df = add_title_sentiment(df)
    df = add_clickbait_score(df)
    df = add_seo_score(df)
    
    # Calculate derived stats properly
    df["subscriber_per_video"] = df["channel_subscriber_count"] / (df["channel_video_count"] + 1)
    df["log_video_length"] = np.log1p(df["video_length"])

    # Day of week fallback (serving layer specific default, since no timestamp is passed in API)
    df["day_of_week"] = 2 

    # YouTube Category Mapping
    CATEGORY_MAP = {
        "Film & Animation": 1,
        "Autos & Vehicles": 2,
        "Music": 10,
        "Pets & Animals": 15,
        "Sports": 17,
        "Travel & Events": 19,
        "Gaming": 20,
        "People & Blogs": 22,
        "Comedy": 23,
        "Entertainment": 24,
        "News & Politics": 25,
        "Howto & Style": 26,
        "Education": 27,
        "Science & Technology": 28,
        "Nonprofits & Activism": 29
    }

    # Explicitly recreate one-hot category encoding flags
    cat_input = str(df.loc[0, "category_id"]).strip()
    
    if cat_input.isdigit():
        category_id = int(cat_input)
    else:
        # Match case-insensitive map, default to 24 (Entertainment)
        category_id = next((v for k, v in CATEGORY_MAP.items() if k.lower() == cat_input.lower()), 24)

    category_col = f"cat_{category_id}"

    # -------- Likes input --------
    likes_df = pd.DataFrame([[0.0]*len(likes_features)], columns=likes_features)

    for col in df.columns:
        if col in likes_df.columns:
            likes_df.loc[0, col] = float(df.loc[0, col])
            
    if category_col in likes_df.columns:
        likes_df.loc[0, category_col] = 1.0

    # -------- Engagement input --------
    eng_df = pd.DataFrame([[0.0]*len(engagement_features)], columns=engagement_features)

    for col in df.columns:
        if col in eng_df.columns:
            eng_df.loc[0, col] = float(df.loc[0, col])
            
    if category_col in eng_df.columns:
        eng_df.loc[0, category_col] = 1.0

    # predict
    log_likes = likes_model.predict(likes_df)
    likes = np.expm1(log_likes)

    engagement = engagement_model.predict(eng_df)[0]

    return {
        "predicted_likes": float(likes[0]),
        "engagement_rate": float(engagement),
        "monetization": get_monetization_label(float(engagement))
    }