from textblob import TextBlob
import pandas as pd
# clickbait 2.0 - more comprehensive scoring system
import re

def add_title_sentiment(df):

    print("Starting sentiment calculation...")

    def get_sentiment(text):
        if pd.isna(text):
            return 0
        return TextBlob(text).sentiment.polarity

    df["title_sentiment"] = df["title"].apply(get_sentiment)

    print("Sentiment calculation finished.")

    return df
    


def add_clickbait_score(df):

    power_words = [
        "shocking", "unbelievable", "secret",
        "exposed", "amazing", "insane",
        "ultimate", "truth", "never",
        "must watch", "you won’t believe"
    ]

    def compute_score(title):

        if pd.isna(title):
            return 0

        score = 0
        title_lower = title.lower()

        # 1️⃣ ALL CAPS ratio
        words = title.split()
        caps_words = [w for w in words if w.isupper()]
        if len(words) > 0:
            caps_ratio = len(caps_words) / len(words)
            score += caps_ratio * 1.5

        # 2️⃣ Contains number
        if any(char.isdigit() for char in title):
            score += 1

        # 3️⃣ Exclamation marks
        score += title.count("!") * 0.5

        # 4️⃣ Power words
        for word in power_words:
            if word in title_lower:
                score += 2

        # 5️⃣ Question mark
        if "?" in title:
            score += 1

        # 6️⃣ Title length deviation
        length = len(title)
        optimal = 60
        score += max(0, 1 - abs(length - optimal) / 60)

        return round(score, 2)

    df["clickbait_score"] = df["title"].apply(compute_score)

    return df

def add_seo_score(df):

    def compute_seo(row):

        title = str(row["title"]) if pd.notna(row["title"]) else ""
        description = str(row["description"]) if pd.notna(row["description"]) else ""
        tags = str(row["tags"]) if pd.notna(row["tags"]) else ""

        score = 0

        # 1️⃣ Title length optimization (ideal 50–70 chars)
        title_len = len(title)
        if 50 <= title_len <= 70:
            score += 20
        else:
            score += max(0, 20 - abs(title_len - 60))

        # 2️⃣ Description richness
        desc_len = len(description)
        if desc_len > 250:
            score += 20
        else:
            score += (desc_len / 250) * 20

        # 3️⃣ Tag count
        tag_list = tags.split("|") if "|" in tags else tags.split(",")
        tag_count = len([t for t in tag_list if t.strip() != ""])
        score += min(tag_count, 10) * 2  # max 20

        # 4️⃣ Keyword overlap (title words in description)
        title_words = set(title.lower().split())
        desc_words = set(description.lower().split())

        if len(title_words) > 0:
            overlap_ratio = len(title_words & desc_words) / len(title_words)
            score += overlap_ratio * 20

        # 5️⃣ Hashtag usage
        hashtag_count = description.count("#")
        score += min(hashtag_count, 5) * 4  # max 20

        return round(score, 2)

    df["seo_score"] = df.apply(compute_seo, axis=1)

    return df