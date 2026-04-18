import pickle
import os

# Go to project root
BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../../"))

def load_models():

    likes_path = os.path.join(BASE_DIR, "models", "likes_model.pkl")
    engagement_path = os.path.join(BASE_DIR, "models", "engagement_model.pkl")
    likes_features_path = os.path.join(BASE_DIR, "models", "likes_features.pkl")
    eng_features_path = os.path.join(BASE_DIR, "models", "engagement_features.pkl")

    likes_model = pickle.load(open(likes_path, "rb"))
    engagement_model = pickle.load(open(engagement_path, "rb"))
    likes_features = pickle.load(open(likes_features_path, "rb"))
    eng_features = pickle.load(open(eng_features_path, "rb"))

    return likes_model, engagement_model, likes_features, eng_features