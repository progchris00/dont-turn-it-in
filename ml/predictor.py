from pathlib import Path
import joblib

PROJECT_ROOT = Path(__file__).resolve().parents[1]
MODEL_PATH = PROJECT_ROOT / 'models' / 'ai_detection_model.pkl'
model = joblib.load(MODEL_PATH)

def predict_text(text):

    prediction = model.predict([text])[0]

    probability = model.predict_proba([text])[0][1]

    return {
        "prediction": "AI-assisted" if prediction == 1 else "Human",
        "ai_probability": round(probability * 100, 2)
    }


sample = "The RAG-Based Conversational Decision Support Algorithm enables the proposed system to provide context-aware and policy-grounded responses to tourists, Bantay-Bundok personnel, and administrators through a Retrieval-Augmented Generation (RAG) framework. The algorithm retrieves relevant information from a vector database containing tourism policies, environmental guidelines, safety protocols, operational procedures, and other localized knowledge sources before generating responses using a Large Language Model (LLM). This approach helps ensure that generated outputs remain grounded on verified and contextually relevant information."

result = predict_text(sample)

print(result)