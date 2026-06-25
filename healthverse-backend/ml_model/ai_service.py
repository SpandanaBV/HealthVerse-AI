"""
Loads the trained Random Forest model + supporting metadata and exposes a
single `predict_disease()` function for the API view to call.

Run `python ml_model/train_symptom_model.py` once (from the project root,
with the venv active) to generate symptom_model.pkl, symptom_vocab.json,
and disease_medicines.json before using this endpoint.
"""
import json
from functools import lru_cache
from pathlib import Path

import joblib
import pandas as pd
from django.conf import settings


@lru_cache(maxsize=1)
def _load_artifacts():
    model_dir = Path(settings.ML_MODEL_DIR)
    model = joblib.load(model_dir / "symptom_model.pkl")
    with open(model_dir / "symptom_vocab.json") as f:
        vocab = json.load(f)
    with open(model_dir / "disease_medicines.json") as f:
        medicines = json.load(f)
    return model, vocab, medicines


def predict_disease(symptom_list):
    """
    symptom_list: list[str] of symptom keys (must match symptom_vocab.json,
    unrecognized symptoms are silently ignored).

    Returns: {"predicted_disease": str, "confidence": float, "suggested_medicines": list[str]}
    """
    model, vocab, medicines = _load_artifacts()

    row = {s: (1 if s in symptom_list else 0) for s in vocab}
    X = pd.DataFrame([row], columns=vocab)

    probs = model.predict_proba(X)[0]
    best_idx = probs.argmax()
    disease = model.classes_[best_idx]
    confidence = float(probs[best_idx])

    return {
        "predicted_disease": disease,
        "confidence": round(confidence, 3),
        "suggested_medicines": medicines.get(disease, []),
    }
