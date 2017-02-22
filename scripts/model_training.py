import pandas as pd

from sklearn.pipeline import Pipeline

from sklearn.feature_extraction.text import CountVectorizer

from sklearn.linear_model import SGDClassifier

from sklearn.externals import joblib
import re


DATA_SOURCE_FILE = "data/twitter_neg_200000.csv"
DATA_SOURCE_FILE2 = "data/twitter_pos_200000.csv"
TEST_DATA_SOURCE = "data/out_trimmed.csv"

def remove_repetitions(s):
    if len(s) < 4:
        return s

    i = 3
    while i < len(s):
        if s[i] == s[i-1] == s[i-2] == s[i-3]:
            s = s[:i] + s[i+1:]
        else:
            i += 1
    return s


vectorizer = CountVectorizer(ngram_range=(1, 3),
                             binary=True,
                             max_df=0.075,
                             min_df=0.000035,
                             )

tokenize = vectorizer.build_tokenizer()


def no_specials_tokenizer(s):
    tokens = tokenize(s)
    return [remove_repetitions(token) for token in tokens if not re.match('^@.*$|^#.*$|^https?:.*$', token)]

vectorizer.tokenizer = no_specials_tokenizer

def load_sentiment_data():
    data_neg = pd.read_csv(DATA_SOURCE_FILE, quotechar='"', delimiter=",", skipinitialspace=True, encoding="utf-8-sig")
    data_pos = pd.read_csv(DATA_SOURCE_FILE2, quotechar='"', delimiter=",", skipinitialspace=True, encoding="utf-8-sig")
    data_raw = pd.concat([data_neg, data_pos])

    return data_raw



def train_model(data, text_key, label_key):


    # data = data_raw[~data_raw['SentimentText'].str.contains('rt @')]  # Remove retweets

    classifier = Pipeline([('vect', vectorizer),
                        ('clf', SGDClassifier(loss='hinge', alpha=0.0001))])

    classifier.fit(data[text_key], data[label_key])
    classifier.stop_words_ = None

    print("Done")

    return classifier




def load_test_data():
    return pd.read_csv(TEST_DATA_SOURCE, quotechar='"', delimiter=",", skipinitialspace=True, encoding="utf-8-sig")

#predictions = classifier.predict(test_features)

# test_subset = pd.concat([test_data.query('Sentiment == 0')[-5000:], test_data.query('Sentiment == 1')[-5000:]])
# test_features = test_subset['SentimentText']
# test_labels = test_subset['Sentiment']

#scores = cross_val_score(classifier, data['SentimentText'], data['Sentiment'], cv=5)