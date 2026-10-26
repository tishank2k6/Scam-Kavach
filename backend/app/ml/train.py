import os
import json
import csv
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.calibration import CalibratedClassifierCV
from sklearn.pipeline import Pipeline
from sklearn.metrics import confusion_matrix, precision_score, recall_score, f1_score, accuracy_score
import joblib

CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
DATASET_PATH = os.path.join(CURRENT_DIR, "dataset", "sample_scam_data.csv")
MODEL_OUTPUT_PATH = os.path.join(CURRENT_DIR, "scam_model.joblib")
METRICS_OUTPUT_PATH = os.path.join(CURRENT_DIR, "metrics_report.json")

def train_and_evaluate():
    print(f"Loading benchmark dataset from {DATASET_PATH}...")
    texts = []
    labels = []
    with open(DATASET_PATH, "r", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            texts.append(row["text"])
            labels.append(int(row["label"]))

    X = np.array(texts)
    y = np.array(labels)

    # Stratified Train/Test Split (75% Train, 25% Test)
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.25, random_state=42, stratify=y
    )

    print(f"Dataset split: {len(X_train)} training samples, {len(X_test)} testing samples.")

    # Model Pipeline: TF-IDF + Calibrated Logistic Regression
    pipeline = Pipeline([
        ("tfidf", TfidfVectorizer(
            ngram_range=(1, 2),
            max_features=1200,
            sublinear_tf=True,
            strip_accents="unicode",
            lowercase=True
        )),
        ("clf", CalibratedClassifierCV(
            estimator=LogisticRegression(C=1.5, solver="lbfgs", max_iter=500, random_state=42),
            method="sigmoid",
            cv=3
        ))
    ])

    print("Fitting model pipeline with calibrated probability output...")
    pipeline.fit(X_train, y_train)

    # Predictions on unseen test set
    y_pred = pipeline.predict(X_test)
    y_proba = pipeline.predict_proba(X_test)[:, 1]

    # Calculate transparent evaluation metrics
    acc = float(accuracy_score(y_test, y_pred))
    prec = float(precision_score(y_test, y_pred, zero_division=0))
    rec = float(recall_score(y_test, y_pred, zero_division=0))
    f1 = float(f1_score(y_test, y_pred, zero_division=0))
    cm = confusion_matrix(y_test, y_pred).tolist()

    report = {
        "model_type": "TF-IDF + Calibrated Logistic Regression (Sigmoid)",
        "train_samples": len(X_train),
        "test_samples": len(X_test),
        "accuracy": round(acc, 4),
        "precision": round(prec, 4),
        "recall": round(rec, 4),
        "f1_score": round(f1, 4),
        "confusion_matrix": {
            "true_negatives": cm[0][0],
            "false_positives": cm[0][1],
            "false_negatives": cm[1][0],
            "true_positives": cm[1][1]
        },
        "limitations": [
            "Trained on curated synthetic and reported student/job recruitment samples.",
            "Model is an assistive screening tool, not definitive legal proof of fraud.",
            "Heuristic rules complement the model to detect novel phrase variants."
        ]
    }

    # Save model
    joblib.dump(pipeline, MODEL_OUTPUT_PATH)
    print(f"Model saved successfully to {MODEL_OUTPUT_PATH}")

    # Save metrics JSON
    with open(METRICS_OUTPUT_PATH, "w", encoding="utf-8") as f:
        json.dump(report, f, indent=2)
    print(f"Metrics report exported to {METRICS_OUTPUT_PATH}")
    print(json.dumps(report, indent=2))

    return pipeline, report

if __name__ == "__main__":
    train_and_evaluate()
