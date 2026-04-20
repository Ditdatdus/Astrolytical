export interface UserDetails {
  firstName: string;
  lastName: string;
  dob: string;
  timeOfBirth: string;
  placeOfBirth: string;
  question: string;
  language: string;
  currentDate: string;
  analysisDate: string;
  timeframe: string;
}

export interface AstrologyInsights {
  numerology: string;
  westernAstrology: string;
  kpSystem: string;
  chineseAstrology: string;
  conclusion: string;
  lifePathNumber: number;
  chineseZodiacAnimal: string;
}

export async function getAstrologyInsights(details: UserDetails): Promise<AstrologyInsights> {
  const response = await fetch('/api/insights', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(details),
  });

  if (!response.ok) {
    let errMsg = "API error";
    try {
      const errObj = await response.json();
      errMsg = errObj.error || errMsg;
    } catch (e) {
      // Ignored
    }
    throw new Error(errMsg);
  }

  return response.json();
}
