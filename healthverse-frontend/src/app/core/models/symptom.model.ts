export interface SymptomPredictionResponse {
  id: number;
  patient: number;
  symptoms: string[];
  predicted_disease: string;
  confidence: number;
  suggested_medicines: string[];
  created_at: string;
  low_confidence: boolean;
}

/** Mirrors ml_model/symptom_vocab.json after training — keep in sync with the backend. */
export const KNOWN_SYMPTOMS: string[] = [
  'abdominal_pain', 'body_ache', 'burning_urination', 'chest_discomfort', 'chills',
  'cough', 'diarrhea', 'fatigue', 'frequent_urination', 'headache', 'high_fever',
  'itchy_eyes', 'light_sensitivity', 'mild_fever', 'nasal_congestion', 'nausea',
  'neck_stiffness', 'runny_nose', 'shortness_of_breath', 'sneezing', 'sore_throat',
  'vomiting',
];
