import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'dist')));

app.post('/api/insights', async (req, res) => {
    try {
        const ai = new GoogleGenAI({ apiKey: "AIzaSyDv5lL4Ellzqz32rU5Sy-ONQT_p4QiiWoM" });
        const details = req.body;

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

        const response = await ai.models.generateContent({
            model: "gemini-flash-latest",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        numerology: { type: Type.STRING, description: "Numerology analysis text" },
                        lifePathNumber: { type: Type.NUMBER, description: "The calculated Life Path number" },
                        westernAstrology: { type: Type.STRING, description: "Western astrology insights text" },
                        kpSystem: { type: Type.STRING, description: "Krishnamurthi Paddhati (KP) system analysis text" },
                        chineseAstrology: { type: Type.STRING, description: "Chinese astrology analysis text" },
                        chineseZodiacAnimal: { type: Type.STRING, description: "Emoji symbol for the Chinese Zodiac animal" },
                        conclusion: { type: Type.STRING, description: "Final synthesized conclusion text" },
                    },
                    required: ["numerology", "lifePathNumber", "westernAstrology", "kpSystem", "chineseAstrology", "chineseZodiacAnimal", "conclusion"],
                },
            },
        });

        const text = response.text;
        if (!text) {
            return res.status(500).json({ error: "No response from AI" });
        }
        res.json(JSON.parse(text));
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message || 'An error occurred' });
    }
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
