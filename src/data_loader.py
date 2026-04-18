import pandas as pd

def load_dataset(path, nrows=800000):
    columns_needed = [
        "video_published_at",
        "video_title",
        "video_description",
        "video_category_id",
        "video_tags",
        "video_duration",
        "video_view_count",
        "video_like_count",
        "video_comment_count",
        "channel_subscriber_count",
        "channel_video_count",
        "channel_view_count"
    ]

    df = pd.read_csv(
        path,
        usecols=columns_needed,
        nrows=nrows
    )

    # Rename columns
    df.rename(columns={
        "video_title": "title",
        "video_description": "description",
        "video_tags": "tags",
        "video_view_count": "views",
        "video_like_count": "likes",
        "video_comment_count": "comment_count",
        "video_category_id": "category_id",
        "video_published_at": "publish_time",
        "video_duration": "duration"
    }, inplace=True)

    return df