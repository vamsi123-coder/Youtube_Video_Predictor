# from src.data_loader import load_dataset

# df = load_dataset("data/youtube_trending_videos_global.csv")

# print("Dataset Loaded Successfully")
# print(df.shape)
# print(df.head())


# from src.data_loader import load_dataset
# from src.data_preprocessing import (
#     optimize_memory,
#     clean_data,
#     add_engagement_rate
# )

# df = load_dataset("data/youtube_trending_videos_global.csv")
# df = optimize_memory(df)
# df = clean_data(df)
# df = add_engagement_rate(df)

# print("Preprocessing completed successfully")
# print(df.shape)
# print(df[["likes", "views", "engagement_rate"]].head())


# Preprocessing pipeline


from src.feature_engineering import add_title_sentiment
from src.feature_engineering import add_clickbait_score
from src.feature_engineering import add_seo_score

from src.model_training import train_engagement_model
# To increase the number of features we can add a model to predict engagement_rate instead of likes, using the same features as the likes model 
# And then we can use the predictions of this model as a feature in the likes model, this way we can capture the relationship between engagement_rate and likes
from src.data_preprocessing import add_advanced_features

from src.data_loader import load_dataset
from src.data_preprocessing import (
    optimize_memory,
    clean_data,
    add_engagement_rate,
    convert_duration_to_seconds,
    extract_time_features
)

df = load_dataset("data/youtube_trending_videos_global.csv", nrows=1000)
df = optimize_memory(df)
df = clean_data(df)
df = add_engagement_rate(df)
df = convert_duration_to_seconds(df)
df = extract_time_features(df)
df = add_advanced_features(df)

print("Structural feature engineering completed")
print(df.shape)
print(df[["video_length", "upload_hour", "day_of_week"]].head())

df = add_title_sentiment(df)
print("Sentiment feature added")

df = add_clickbait_score(df)
print("Clickbait feature added")

df = add_seo_score(df)
print("SEO feature added")

from src.model_training import train_likes_model

model_likes, likes_features = train_likes_model(df)
model_engagement, eng_features = train_engagement_model(df)

from src.model_training import save_models

save_models(model_likes, model_engagement, likes_features, eng_features)
