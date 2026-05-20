from textblob import TextBlob

def analyze_sentiment(text):
    blob = TextBlob(text)
    
    polarity = blob.sentiment.polarity
    subjectivity = blob.sentiment.subjectivity

    return {
        "polarity": polarity,
        "subjectivity": subjectivity
    }