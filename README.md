# ViralBoost (formerly RevenueIQ/CreatorAI) - YouTube Analytics ML Inference

ViralBoost is a full-stack web application designed to predict a YouTube video's future performance (Engagement Rate, Predicted Likes, Monetization Level). It leverages a machine learning model trained on a dataset of trending YouTube videos, allowing creators to perform predictive analytics before publishing.

## 🚀 Features

- **Machine Learning**: Predicts absolute `Likes` and relative `Engagement Rate` via a Random Forest regression architecture.
- **Micro-Services Architecture**: Backend powered by `FastAPI` (Python) and `Scikit-Learn`, decoupled from a high-performance `React`/`Vite` frontend.
- **Frontend Dashboard**:
  - Two-faced sleek Light/Dark mode toggle.
  - "What-If" Sensitivity Simulator: Dynamically adjust upload hour, text length, and channel subs to see instant score differentials.
  - Detailed heuristic insights (SEO Score, Sentiment, Clickbait metrics) bridging ML features to actionable UX.
  - Interactive doughnut & radar visualizations via `Chart.js`.
  - Modern web-design: Framer Motion layout animations, glassmorphism, gradient meshes.

---

## 🛠️ Tech Stack

**Backend:**
- Python 3.13
- FastAPI
- Pandas & NumPy
- Scikit-Learn (Random Forest)
- Joblib

**Frontend:**
- React (Vite)
- Framer Motion (Animations)
- Chart.js & React-Chartjs-2
- SweetAlert2
- Vanilla CSS (`index.css` global theme variables)

---

## 💻 Local Setup & Installation

### 1. Backend Setup

From the root of the project, spin up the FastAPI service:

```bash
cd backend

# Install dependencies (if you haven't yet)
pip install -r requirements.txt

# Start the uvicorn development server
python -m uvicorn app.main:app --reload
```
The backend runs on `http://127.0.0.1:8000`. You can view the automated Swagger UI documentation at `http://127.0.0.1:8000/docs`.

### 2. Frontend Setup

In a new terminal window, navigate to the React UI and run the Vite dev server:

```bash
cd frontend

# Install node modules
npm install

# Start Vite dev server
npm run dev
```
The frontend will bind to `http://localhost:5173`. CORS has already been configured on the backend to allow requests from the React origin.

---

## 🧠 Model Training (Optional)

The machine learning models are already pre-trained and serialized via `joblib` in the `models/` directory for fast inference. 

However, if you would like to rebuild the pipeline, engineer features manually from the raw dataset, and save new model binaries:

```bash
python src/data_preprocessing.py
python src/feature_engineering.py
python src/model_training.py
```
This script handles TF-IDF vectorization, interaction terms, missing value imputation, and pipeline exports.

---

## 💡 How It Works (The Data Pipeline)

1. **Frontend Request**: The React UI packages metadata (title, category, tags, subscriber count, upload hour).
2. **Feature Engineering**: The FastAPI service receives the raw string maps. The category ID is encoded, string length metrics are computed, and input structures (via `app/schemas`) are strictly validated using Pydantic.
3. **Inference**: 
   - Uses `likes_model.pkl` to compute exact engagement volume.
   - Uses `engagement_model.pkl` to compute ratio-based viewership.
4. **Result**: A comprehensive monetization level (High/Medium/Low) is appended and served back to the React UI for visualization.

---

## 📄 License
MIT License. Free to use, fork, and build upon.


