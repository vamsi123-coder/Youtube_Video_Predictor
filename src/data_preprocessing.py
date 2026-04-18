import pandas as pd
import re

def optimize_memory(df):

    # Convert category to categorical
    df["category_id"] = df["category_id"].astype("category")

    # Convert numeric columns safely
    df["views"] = pd.to_numeric(df["views"], errors="coerce")
    df["likes"] = pd.to_numeric(df["likes"], errors="coerce")
    df["comment_count"] = pd.to_numeric(df["comment_count"], errors="coerce")

    df["channel_subscriber_count"] = pd.to_numeric(
        df["channel_subscriber_count"], errors="coerce"
    )
    df["channel_video_count"] = pd.to_numeric(
        df["channel_video_count"], errors="coerce"
    )
    df["channel_view_count"] = pd.to_numeric(
        df["channel_view_count"], errors="coerce"
    )

    # Fill missing values
    df["channel_subscriber_count"] = df["channel_subscriber_count"].fillna(0)
    df["channel_video_count"] = df["channel_video_count"].fillna(1)
    df["channel_view_count"] = df["channel_view_count"].fillna(0)

    return df


def clean_data(df):

    df = df.dropna(subset=["views", "likes", "comment_count"])

    df = df[df["views"] > 0]
    df = df[df["likes"] >= 0]
    df = df[df["comment_count"] >= 0]

    df = df.dropna(subset=["title"])

    return df


def add_engagement_rate(df):

    df["engagement_rate"] = (
        df["likes"] + df["comment_count"]
    ) / df["views"]

    df = df[df["engagement_rate"] <= 1]

    return df


def convert_duration_to_seconds(df):

    def iso_to_seconds(duration):
        if pd.isna(duration):
            return 0

        # Extract hours, minutes, seconds from ISO 8601
        pattern = re.compile(
            r'PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?'
        )
        match = pattern.match(duration)

        if not match:
            return 0

        hours = int(match.group(1)) if match.group(1) else 0
        minutes = int(match.group(2)) if match.group(2) else 0
        seconds = int(match.group(3)) if match.group(3) else 0

        return hours * 3600 + minutes * 60 + seconds

    df["video_length"] = df["duration"].apply(iso_to_seconds)

    df.drop("duration", axis=1, inplace=True)

    return df

def extract_time_features(df):

    df["publish_time"] = pd.to_datetime(
        df["publish_time"], errors="coerce"
    )

    df["upload_hour"] = df["publish_time"].dt.hour
    df["day_of_week"] = df["publish_time"].dt.dayofweek

    df.drop("publish_time", axis=1, inplace=True)

    return df

import numpy as np

def add_advanced_features(df):

    # 1️⃣ Channel strength ratio
    df["subscriber_per_video"] = (
        df["channel_subscriber_count"] / (df["channel_video_count"] + 1)
    )

    # 2️⃣ Log transform video length (reduces skew)
    df["log_video_length"] = np.log1p(df["video_length"])

    return df