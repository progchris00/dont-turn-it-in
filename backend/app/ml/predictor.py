from pathlib import Path
import joblib
import pandas as pd

BASE_DIR = Path(__file__).resolve().parent

MODEL_PATH = BASE_DIR / "trained" / "ai_detection_model.pkl"

model = joblib.load(MODEL_PATH)

def predict_text(text):

    word_count = len(text.split())

    sentences = text.split('.')

    avg_sentence_length = (
        word_count / max(len(sentences), 1)
    )

    sample_df = pd.DataFrame([
        {
            "text_content": text,
            "word_count": word_count,
            "avg_sentence_length": avg_sentence_length
        }
    ])

    prediction = model.predict(sample_df)[0]

    probability = model.predict_proba(sample_df)[0][1]

    return {
        "prediction": "AI" if prediction == 1 else "Human",
        "ai_probability": round(probability * 100, 2)
    }