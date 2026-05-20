import re
import spacy

def clean_text(text):
    text = text.lower()
    text = re.sub(r'[^a-zA-Z0-9\s]', '', text)
    return text

nlp = spacy.load('en_core_web_sm')

def tokenize(text):
    doc = nlp(text)
    words = [token.text for token in doc]
    sentences = list(doc.sents)

    return words, sentences

