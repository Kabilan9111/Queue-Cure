export const calculatePriority = (symptoms) => {
  if (!symptoms || typeof symptoms !== 'string') {
    return {
      priorityScore: 2.0,
      severity: 'Low',
      aiRecommendation: 'Routine checkup recommended.'
    };
  }

  const text = symptoms.toLowerCase();

  const rules = [
    {
      severity: 'Critical',
      baseScore: 9.0,
      keywords: ['chest pain', 'heart attack', 'cannot breathe', 'difficulty breathing', 'stroke', 'unconscious', 'heavy bleeding', 'pregnancy bleeding', 'severe abdominal pain', '104+', 'seizure', 'severe trauma', 'emergency'],
      recommendation: 'Emergency symptoms detected. Immediate medical attention strictly required.'
    },
    {
      severity: 'High',
      baseScore: 7.0,
      keywords: ['pregnancy pain', 'persistent vomiting', 'migraine', 'fracture', 'infection', 'dizziness', 'high fever', 'blood pressure', 'kidney pain', 'severe headache', 'bleeding'],
      recommendation: 'Severe symptoms detected. Expedited consultation recommended.'
    },
    {
      severity: 'Medium',
      baseScore: 4.0,
      keywords: ['headache', 'stomach pain', 'cough', 'cold', 'skin allergy', 'itching', 'back pain', 'joint pain', 'gastric issue', 'fever', 'vomiting', 'pain'],
      recommendation: 'Moderate symptoms. Standard priority consultation.'
    },
    {
      severity: 'Low',
      baseScore: 1.0,
      keywords: ['follow up', 'routine checkup', 'annual checkup', 'prescription refill', 'consultation', 'report review', 'general enquiry', 'checkup'],
      recommendation: 'Routine request. Standard queue placement.'
    }
  ];

  for (const rule of rules) {
    for (const keyword of rule.keywords) {
      if (text.includes(keyword)) {
        // Generate a deterministic decimal score for variations
        const bonus = (Math.min(text.length, 100) / 100) * 0.9;
        const finalScore = parseFloat((rule.baseScore + bonus).toFixed(1));
        
        return {
          priorityScore: finalScore > 10 ? 10.0 : finalScore,
          severity: rule.severity,
          aiRecommendation: rule.recommendation
        };
      }
    }
  }

  // Fallback for unknown
  return {
    priorityScore: 3.5,
    severity: 'Low',
    aiRecommendation: 'Uncategorized symptoms. Standard queue placement.'
  };
};
