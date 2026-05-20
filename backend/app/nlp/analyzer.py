from backend.app.nlp.preprocessing import clean_text, tokenize
from backend.app.nlp.sentiment import analyze_sentiment
from backend.app.nlp.metrics import *

def analyze_submission(text):

    cleaned = clean_text(text)

    words, sentences = tokenize(cleaned)

    sentiment = analyze_sentiment(cleaned)

    results = {
        "word_count": word_count(words),
        "sentence_count": sentence_count(sentences),
        "vocab_diversity": vocabulary_diversity(words),
        "avg_sentence_length": average_sentence_length(words, sentences),
        "readability": readability(cleaned),
        "sentiment": sentiment
    }

    return results