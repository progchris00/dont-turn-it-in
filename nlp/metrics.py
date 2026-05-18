import textstat

def word_count(words):
    return len(words)


def sentence_count(sentences):
    return len(sentences)


def vocabulary_diversity(words):
    unique_words = set(words)

    return len(unique_words) / len(words)


def average_sentence_length(words, sentences):
    return len(words) / len(sentences)


def readability(text):
    return textstat.flesch_reading_ease(text)