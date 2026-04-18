# 🎯 YouTube Video Performance & Monetization Predictor

A full-stack web application that predicts **YouTube video performance (likes, engagement rate)** and **monetization potential (Low / Medium / High)** *before publishing*.

This system uses **Machine Learning, NLP, and AI-based explanations** to help content creators make **data-driven decisions** and improve their content strategy.

🔗 **GitHub Repository:** [vamsi123-coder/Youtube_Video_Predictor](https://github.com/vamsi123-coder/Youtube_Video_Predictor/)

---

## 🚀 Features

- 📊 Predicts video performance (likes & engagement rate)
- 💰 Classifies monetization potential (Low / Medium / High)
- 🧠 NLP-based analysis (sentiment, keywords, clickbait detection)
- 🔑 SEO keyword suggestions
- ⏰ Optimal upload time recommendation
- 🔄 Strategy comparison (test multiple titles/descriptions)
- 🤖 AI-generated explanations & suggestions
- 📈 Interactive dashboard with charts and score indicators
- 🧩 Feature importance analysis

---

## 🛠️ Tech Stack

| Layer | Technologies |
|-------|-------------|
| **Backend** | Python, FastAPI, Scikit-learn, Pandas, NumPy, TextBlob / NLTK, Joblib |
| **Frontend** | React.js, Tailwind CSS, Chart.js / Recharts, Axios |
| **AI Layer** | Llama 3 (via Ollama) |

---

## 💻 Setup & Installation

### 🔹 Backend

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

> Backend runs at: `http://127.0.0.1:8000`

### 🔹 Frontend

```bash
cd frontend
npm install
npm run dev
```

> Frontend runs at: `http://localhost:5173`

---

## 🧠 System Flow

```
User Input → Frontend → Backend API → Feature Engineering → ML Models → Prediction → AI Explanation → Results Display
```

---

## 📊 Data Pipeline

```
Dataset → Data Cleaning → Feature Engineering → Model Training → Model Storage → Prediction
```

Includes:
- Sentiment analysis
- Clickbait detection
- SEO scoring
- Time-based features

---

## 🧪 Model Details

| Task | Model |
|------|-------|
| Likes Prediction | Random Forest Regressor |
| Engagement Prediction | Linear Regression |
| Monetization Classification | Threshold-based on predictions |

---

## 📡 API Endpoint

### `POST /predict`

**Request:**
```json
{
  "title": "string",
  "description": "string",
  "tags": ["string"],
  "upload_time": 14
}
```

**Response:**
```json
{
  "predicted_likes": 12000,
  "engagement_rate": 0.045,
  "monetization": "Medium",
  "explanation": "AI-generated insight..."
}
```

---

## 🧪 Testing & Evaluation

**Tested with:**
- Different titles and keyword combinations
- Various upload timings
- Multiple content strategies

**Metrics:**
- Prediction accuracy
- Response time
- Recommendation effectiveness
- UI usability

---

## 🎯 Key Highlights

- ✔ Pre-publication prediction (major advantage)
- ✔ Combines ML + NLP + AI in a single pipeline
- ✔ Interactive and user-friendly UI
- ✔ Modular and scalable system architecture

---

## 🚀 Future Enhancements

- Real-time trending data integration
- Advanced recommendation system
- Multilingual support
- Personalized creator insights

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

## 👨‍💻 Author

**Vamsi Krishna** — [@vamsi123-coder](https://github.com/vamsi123-coder)

---

> ⭐ If you found this project useful, please consider giving it a star!
