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
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  
  if (!apiKey) {
    throw new Error("Gemini API key is missing. Please set VITE_GEMINI_API_KEY.");
  }

  const prompt = `
    You are a professional analyst specializing in Numerology, Western Astrology, the Krishnamurthi Paddhati (KP) system, and Chinese Astrology.
    Perform a systematic cross-disciplinary analysis for the following subject:
    
    Name: ${details.firstName} ${details.lastName}
    Date of Birth: ${details.dob}
    Time of Birth: ${details.timeOfBirth}
    Place of Birth: ${details.placeOfBirth}
    
    Analysis Target Date: ${details.analysisDate}
    Analysis Timeframe: ${details.timeframe}
    
    The inquiry is: "${details.question}"
    
    Please provide the entire report in the following language: ${details.language}
    
    IMPORTANT: Use the Analysis Target Date (${details.analysisDate}) and the requested Timeframe (${details.timeframe}) as the temporal parameters for this analysis.
    
    Tone Requirements:
    - Formal, analytical, and objective.
    - Address the subject in the second person.
    - Avoid mystical, "new age", or vague terminology.
    - Focus on the systematic interpretation of data points from the four disciplines.
    
    Please provide the following data points in the JSON response:
    1. numerology: A quantitative assessment based on name and birth date values in relation to the inquiry and temporal parameters.
    2. lifePathNumber: The calculated Numerology Life Path number (1-9, 11, 22, or 33).
    3. westernAstrology: A technical interpretation of planetary positions, aspects, and transits according to Western Astrology for the ${details.timeframe} starting from ${details.analysisDate}.
    4. kpSystem: A technical interpretation using the Krishnamurthi Paddhati (KP) system, focusing on sub-lords and stellar positions for the ${details.timeframe} starting from ${details.analysisDate}.
    5. chineseAstrology: A systematic evaluation based on the zodiacal system and the specific temporal window of the ${details.timeframe} starting from ${details.analysisDate}.
    6. chineseZodiacAnimal: The emoji symbol representing the subject's Chinese Zodiac animal.
    7. conclusion: A formal conclusion that integrates the data from the four disciplines into a coherent, actionable summary tailored to the inquiry.
  `;

  const url = \`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=\${apiKey}\`;

  const requestBody = {
    contents: [
      {
        parts: [
          { text: prompt }
        ]
      }
    ],
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: {
        type: "OBJECT",
        properties: {
          numerology: { type: "STRING", description: "Numerology analysis text" },
          lifePathNumber: { type: "NUMBER", description: "The calculated Life Path number" },
          westernAstrology: { type: "STRING", description: "Western astrology insights text" },
          kpSystem: { type: "STRING", description: "Krishnamurthi Paddhati (KP) system analysis text" },
          chineseAstrology: { type: "STRING", description: "Chinese astrology analysis text" },
          chineseZodiacAnimal: { type: "STRING", description: "Emoji symbol for the Chinese Zodiac animal" },
          conclusion: { type: "STRING", description: "Final synthesized conclusion text" }
        },
        required: ["numerology", "lifePathNumber", "westernAstrology", "kpSystem", "chineseAstrology", "chineseZodiacAnimal", "conclusion"]
      }
    }
  };

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    let errMsg = "API error";
    try {
      const errObj = await response.json();
      errMsg = errObj.error?.message || errMsg;
    } catch (e) {
      // Ignored
    }
    throw new Error(errMsg);
  }

  const responseData = await response.json();
  const textContent = responseData.candidates?.[0]?.content?.parts?.[0]?.text;
  
  if (!textContent) {
    throw new Error("No valid response received from AI");
  }

  return JSON.parse(textContent) as AstrologyInsights;
}
