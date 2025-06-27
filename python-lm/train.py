from sklearn.feature_extraction.text import CountVectorizer
from sklearn.linear_model import LogisticRegression
from questions import questions
from statements import statements
import json

texts = questions + statements
labels = [1]*len(questions) + [0]*len(statements)

# vectorize with ngram range
vectorizer = CountVectorizer(ngram_range=(1,2))
X = vectorizer.fit_transform(texts)

# train
clf = LogisticRegression()
clf.fit(X, labels)

# extract weights and bias
weights = clf.coef_.tolist()      # 2D array
bias = clf.intercept_.tolist()    # 1D array

# get vocabulary
vocab = vectorizer.vocabulary_

# package together
model_data = {
    "weights": weights,
    "bias": bias,
    "vocabulary": vocab
}

with open("model2.json", "w") as f:
    json.dump(model_data, f)
