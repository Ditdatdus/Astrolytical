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
  const apiKey = import.meta.env.VITE_GROQ_API_KEY;

  if (!apiKey) {
    throw new Error("Groq API key is missing. Please set VITE_GROQ_API_KEY.");
  }

  const prompt = `
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

  const url = "https://api.groq.com/openai/v1/chat/completions";

  const requestBody = {
    model: "llama-3.3-70b-versatile",
    messages: [
      {
        role: "system",
        content: "You are a professional analyst specializing in Numerology, Western Astrology, the Krishnamurthi Paddhati (KP) system, and Chinese Astrology. You must respond with a JSON object matching the requested schema."
      },
      {
        role: "user",
        content: prompt
      }
    ],
    response_format: {
      type: "json_object"
    },
    temperature: 0.2
  };

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    let errMsg = "API error";
    try {
      const errObj = await response.json();
      errMsg = errObj.error?.message || errMsg;
    } catch (_e) {
      // Could not parse error body; use generic message
    }
    throw new Error(errMsg);
  }

  interface GroqResponse {
    choices?: Array<{
      message?: {
        content?: string;
      };
    }>;
  }

  const responseData = (await response.json()) as GroqResponse;
  const textContent = responseData.choices?.[0]?.message?.content;
  
  if (!textContent) {
    throw new Error("No valid response received from AI");
  }

  return JSON.parse(textContent) as AstrologyInsights;
}
