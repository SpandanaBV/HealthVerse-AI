"""
Trains the symptom -> disease prediction model used by the AI endpoint.

NOTE: This uses a synthetic symptom-disease dataset so the training/prediction
LOGIC can be tested end-to-end in this sandbox (no internet access here).
Swap `build_synthetic_dataset()` for your real dataset (e.g. the Kaggle
"Disease Prediction Using Machine Learning" dataset) when you run this for
real — the rest of the pipeline (encoding, training, saving) stays the same.
"""
import json
import random
import joblib
import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, classification_report

random.seed(42)
np.random.seed(42)

# ---- 1. Define diseases, their symptom signatures, and suggested medicines ----
DISEASE_PROFILES = {
    "Common Cold": {
        "symptoms": ["cough", "sneezing", "sore_throat", "runny_nose", "mild_fever"],
        "medicines": ["Paracetamol", "Cetirizine", "Vitamin C"],
    },
    "Influenza": {
        "symptoms": ["high_fever", "body_ache", "fatigue", "cough", "chills"],
        "medicines": ["Oseltamivir", "Paracetamol", "Rest & fluids"],
    },
    "Migraine": {
        "symptoms": ["headache", "nausea", "light_sensitivity", "vomiting"],
        "medicines": ["Sumatriptan", "Ibuprofen", "Rest in dark room"],
    },
    "Gastroenteritis": {
        "symptoms": ["nausea", "vomiting", "diarrhea", "abdominal_pain", "mild_fever"],
        "medicines": ["Oral Rehydration Salts", "Loperamide", "Probiotics"],
    },
    "Allergic Rhinitis": {
        "symptoms": ["sneezing", "runny_nose", "itchy_eyes", "nasal_congestion"],
        "medicines": ["Cetirizine", "Fluticasone nasal spray"],
    },
    "Bronchitis": {
        "symptoms": ["cough", "chest_discomfort", "fatigue", "mild_fever", "shortness_of_breath"],
        "medicines": ["Dextromethorphan", "Paracetamol", "Steam inhalation"],
    },
    "Urinary Tract Infection": {
        "symptoms": ["abdominal_pain", "burning_urination", "frequent_urination", "mild_fever"],
        "medicines": ["Nitrofurantoin", "Increased water intake"],
    },
    "Tension Headache": {
        "symptoms": ["headache", "neck_stiffness", "fatigue"],
        "medicines": ["Ibuprofen", "Paracetamol", "Stress management"],
    },
}

ALL_SYMPTOMS = sorted({s for profile in DISEASE_PROFILES.values() for s in profile["symptoms"]})
DISEASES = list(DISEASE_PROFILES.keys())

print(f"Symptom vocabulary ({len(ALL_SYMPTOMS)}): {ALL_SYMPTOMS}")
print(f"Diseases ({len(DISEASES)}): {DISEASES}")


def build_synthetic_dataset(n_per_disease=150, noise_prob=0.15, missing_prob=0.2):
    """
    For each disease, generate patient records with its core symptoms present
    (some randomly missing to mimic real variability) plus a chance of one or
    two unrelated 'noise' symptoms to mimic comorbidity/reporting noise.
    """
    rows = []
    for disease, profile in DISEASE_PROFILES.items():
        core = profile["symptoms"]
        for _ in range(n_per_disease):
            row = {s: 0 for s in ALL_SYMPTOMS}
            for s in core:
                if random.random() > missing_prob:
                    row[s] = 1
            # add occasional noise symptoms from other diseases
            if random.random() < noise_prob:
                noise_symptom = random.choice(ALL_SYMPTOMS)
                row[noise_symptom] = 1
            row["disease"] = disease
            rows.append(row)
    return pd.DataFrame(rows)


df = build_synthetic_dataset()
print(f"\nDataset shape: {df.shape}")
print(df["disease"].value_counts())

X = df[ALL_SYMPTOMS]
y = df["disease"]

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

model = RandomForestClassifier(n_estimators=200, max_depth=10, random_state=42)
model.fit(X_train, y_train)

y_pred = model.predict(X_test)
acc = accuracy_score(y_test, y_pred)
print(f"\nTest accuracy: {acc:.2%}")
print(classification_report(y_test, y_pred))

# ---- Save model + supporting metadata for the Django endpoint ----
joblib.dump(model, "symptom_model.pkl")

with open("symptom_vocab.json", "w") as f:
    json.dump(ALL_SYMPTOMS, f)

with open("disease_medicines.json", "w") as f:
    json.dump({d: p["medicines"] for d, p in DISEASE_PROFILES.items()}, f, indent=2)

print("\nSaved: symptom_model.pkl, symptom_vocab.json, disease_medicines.json")


# ---- Quick sanity check: simulate a real prediction call ----
def predict(symptom_list):
    vec = [1 if s in symptom_list else 0 for s in ALL_SYMPTOMS]
    probs = model.predict_proba([vec])[0]
    best_idx = int(np.argmax(probs))
    disease = model.classes_[best_idx]
    confidence = float(probs[best_idx])
    with open("disease_medicines.json") as f:
        meds = json.load(f)
    return {
        "predicted_disease": disease,
        "confidence": round(confidence, 3),
        "suggested_medicines": meds.get(disease, []),
    }


test_input = ["headache", "nausea", "light_sensitivity"]
result = predict(test_input)
print(f"\nSanity check — input symptoms: {test_input}")
print("Prediction:", result)
