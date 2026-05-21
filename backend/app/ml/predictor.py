from pathlib import Path
import joblib

BASE_DIR = Path(__file__).resolve().parent

MODEL_PATH = BASE_DIR / "trained" / "ai_detection_model.pkl"

model = joblib.load(MODEL_PATH)


def predict_text(text: str):

    prediction = model.predict([text])[0]

    probability = model.predict_proba([text])[0][1]

    return {
        "prediction": "AI" if prediction == 1 else "Human",
        "ai_probability": round(probability * 100, 2)
    }