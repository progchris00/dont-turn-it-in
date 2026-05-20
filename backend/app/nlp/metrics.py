import re
import math
import statistics
from collections import Counter

import nltk
from nltk.tokenize import word_tokenize, sent_tokenize

# Download once if not yet downloaded
# nltk.download('punkt')

VOWELS = "aeiouy"


def count_syllables(word):
    word = word.lower()
    word = re.sub(r'[^a-z]', '', word)

    if not word:
        return 0

    syllable_count = 0
    prev_char_was_vowel = False

    for char in word:
        is_vowel = char in VOWELS

        if is_vowel and not prev_char_was_vowel:
            syllable_count += 1

        prev_char_was_vowel = is_vowel

    # Remove silent trailing 'e'
    if word.endswith("e") and syllable_count > 1:
        syllable_count -= 1

    return max(1, syllable_count)


def clean_words(words):
    return [
        word.lower()
        for word in words
        if re.search(r'\w', word)
    ]


def extract_ai_detection_features(text):
    # -----------------------------
    # Tokenization
    # -----------------------------
    sentences = sent_tokenize(text)
    raw_words = word_tokenize(text)

    words = clean_words(raw_words)

    if not words:
        return {}

    total_words = len(words)
    total_sentences = len(sentences)
    unique_words = len(set(words))

    avg_word_length = sum(len(word) for word in words) / total_words

    sentence_lengths = [
        len(word_tokenize(sentence))
        for sentence in sentences
    ]

    avg_sentence_length = (
        sum(sentence_lengths) / total_sentences
        if total_sentences > 0 else 0
    )

    sentence_length_variance = (
        statistics.stdev(sentence_lengths)
        if len(sentence_lengths) > 1 else 0
    )

    lexical_diversity = unique_words / total_words

    unique_word_percentage = (
        unique_words / total_words
    ) * 100

    syllable_counts = [
        count_syllables(word)
        for word in words
    ]

    avg_syllables_per_word = (
        sum(syllable_counts) / total_words
    )

    punctuation_count = len(
        re.findall(r'[^\w\s]', text)
    )

    punctuation_density = (
        punctuation_count / len(text)
        if len(text) > 0 else 0
    )

    frequency_distribution = Counter(words)

    most_common_word, most_common_count = (
        frequency_distribution.most_common(1)[0]
    )

    repetition_ratio = (
        most_common_count / total_words
    )

    long_words = [
        word for word in words
        if len(word) >= 7
    ]

    long_word_ratio = (
        len(long_words) / total_words
    )

    short_sentences = [
        length for length in sentence_lengths
        if length < 8
    ]

    short_sentence_ratio = (
        len(short_sentences) / total_sentences
        if total_sentences > 0 else 0
    )

    features = {
        "total_words": total_words,
        "total_sentences": total_sentences,
        "unique_words": unique_words,

        "average_word_length": round(avg_word_length, 3),
        "average_syllables_per_word": round(avg_syllables_per_word, 3),

        "average_sentence_length": round(avg_sentence_length, 3),
        "sentence_length_variance": round(sentence_length_variance, 3),

        "lexical_diversity": round(lexical_diversity, 3),
        "unique_word_percentage": round(unique_word_percentage, 3),

        "punctuation_density": round(punctuation_density, 5),

        "most_common_word": most_common_word,
        "most_common_word_count": most_common_count,
        "repetition_ratio": round(repetition_ratio, 3),

        "long_word_ratio": round(long_word_ratio, 3),
        "short_sentence_ratio": round(short_sentence_ratio, 3),
    }

    return features