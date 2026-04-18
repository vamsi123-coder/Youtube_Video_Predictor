import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_absolute_error, r2_score
import pandas as pd

def train_likes_model(df):

    df["log_likes"] = np.log1p(df["likes"])

    # 🚫 Removed: views, comment_count, channel_view_count
    X = df[
        [
            "title_sentiment",
            "clickbait_score",
            "seo_score",
            "upload_hour",
            "day_of_week",
            "video_length",
            "channel_subscriber_count",
            "channel_video_count"
        ]
    ]

    # Encode category safely
    category_dummies = pd.get_dummies(
        df["category_id"],
        prefix="cat",
        drop_first=True
    )

    X = pd.concat([X, category_dummies], axis=1)

    y = df["log_likes"]

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )

    model = RandomForestRegressor(
        n_estimators=100,
        max_depth=12,   # slightly reduced to avoid overfitting
        random_state=42,
        n_jobs=-1
    )

    model.fit(X_train, y_train)

    predictions = model.predict(X_test)

    # ---- Evaluation on log scale ----
    mae_log = mean_absolute_error(y_test, predictions)
    r2 = r2_score(y_test, predictions)

    print("Likes Model Performance (Log Scale):")
    print("MAE (log):", round(mae_log, 4))
    print("R2 Score:", round(r2, 4))

    # ---- Convert back to original likes scale ----
    y_test_original = np.expm1(y_test)
    pred_original = np.expm1(predictions)

    mae_original = mean_absolute_error(y_test_original, pred_original)

    print("MAE (Original Likes Scale):", round(mae_original, 2))

    return model , X.columns

# engagement model with same features but predicting engagement_rate instead of likes

def train_engagement_model(df):

    # Features (NO leakage)
    X = df[
        [
            "title_sentiment",
            "clickbait_score",
            "seo_score",
            "upload_hour",
            "day_of_week",
            "log_video_length",
            "subscriber_per_video"
        ]
    ]

    # Encode category
    category_dummies = pd.get_dummies(
        df["category_id"],
        prefix="cat",
        drop_first=True
    )

    X = pd.concat([X, category_dummies], axis=1)

    # Target
    y = df["engagement_rate"]

    from sklearn.model_selection import train_test_split
    from sklearn.linear_model import LinearRegression
    from sklearn.metrics import mean_absolute_error, r2_score

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )

    model = LinearRegression()

    model.fit(X_train, y_train)

    predictions = model.predict(X_test)

    mae = mean_absolute_error(y_test, predictions)
    r2 = r2_score(y_test, predictions)

    print("\nEngagement Model Performance:")
    print("MAE:", round(mae, 4))
    print("R2 Score:", round(r2, 4))

    return model, list(X.columns)

import pickle
import os

def save_models(model_likes, model_engagement, likes_features, eng_features):

    os.makedirs("models", exist_ok=True)

    pickle.dump(model_likes, open("models/likes_model.pkl", "wb"))
    pickle.dump(model_engagement, open("models/engagement_model.pkl", "wb"))
    pickle.dump(likes_features, open("models/likes_features.pkl", "wb"))
    pickle.dump(eng_features, open("models/engagement_features.pkl", "wb"))

    print("\nModels saved successfully!")