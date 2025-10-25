
import { GoogleGenAI, Type } from "@google/genai";
import { Document } from '../types';

if (!process.env.API_KEY) {
    console.warn("API_KEY environment variable not set. Using a placeholder.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || 'MISSING_API_KEY' });

const model = 'gemini-flash-latest';

const responseSchema = {
    type: Type.OBJECT,
    properties: {
        "Relevant with securities fraud under federal or state law": { type: Type.BOOLEAN },
        "Relevant with accounting fraud or violations of GAAP": { type: Type.BOOLEAN },
        "Relevant with fiduciary duty violations by officers or directors": { type: Type.BOOLEAN },
        "Relevant with fraudulent conveyance or preferential transfers in bankruptcy": { type: Type.BOOLEAN },
        "Relevant with conspiracy to commit fraud or obstruction of justice": { type: Type.BOOLEAN },
        reasoning: {
            type: Type.STRING,
            description: 'A concise, clear, and legally defensible reason for the decisions based on the document content.'
        }
    },
    required: [
        "Relevant with securities fraud under federal or state law",
        "Relevant with accounting fraud or violations of GAAP",
        "Relevant with fiduciary duty violations by officers or directors",
        "Relevant with fraudulent conveyance or preferential transfers in bankruptcy",
        "Relevant with conspiracy to commit fraud or obstruction of justice",
        'reasoning'
    ]
};

const systemInstruction = `You are an expert AI assistant for eDiscovery. Your task is to analyze a document in the context of a specific legal discovery query.
For each of the following categories, determine if the document is relevant by setting the corresponding boolean flag:
- "Relevant with securities fraud under federal or state law"
- "Relevant with accounting fraud or violations of GAAP"
- "Relevant with fiduciary duty violations by officers or directors"
- "Relevant with fraudulent conveyance or preferential transfers in bankruptcy"
- "Relevant with conspiracy to commit fraud or obstruction of justice"
Finally, provide a single, concise, clear, and legally defensible 'reasoning' for all your decisions combined. Your reasoning must be based solely on the provided document text.
Respond ONLY with the specified JSON object format.`;

// FIX: Redefined GeminiResponse to not extend RelevanceDetails, as the 'reasoning' property (string)
// is incompatible with the index signature of RelevanceDetails ([key: string]: boolean).
// The new interface explicitly lists all properties from the response schema.
export interface GeminiResponse {
    "Relevant with securities fraud under federal or state law": boolean;
    "Relevant with accounting fraud or violations of GAAP": boolean;
    "Relevant with fiduciary duty violations by officers or directors": boolean;
    "Relevant with fraudulent conveyance or preferential transfers in bankruptcy": boolean;
    "Relevant with conspiracy to commit fraud or obstruction of justice": boolean;
    reasoning: string;
}

export async function processDocumentWithGemini(document: Document, query: string): Promise<GeminiResponse> {
    try {
        const prompt = `Discovery Query: "${query}"\n\n---\n\nDocument Text:\n\n${document.content}`;
        
        const response = await ai.models.generateContent({
            model: model,
            contents: prompt,
            config: {
                systemInstruction: systemInstruction,
                responseMimeType: "application/json",
                responseSchema: responseSchema,
                temperature: 0.1,
            }
        });

        const jsonString = response.text.trim();
        const parsedResponse = JSON.parse(jsonString) as GeminiResponse;

        if (!parsedResponse.reasoning) {
            throw new Error('Invalid JSON response from API: missing reasoning');
        }

        return parsedResponse;
    } catch (error) {
        console.error(`Error processing document ${document.id}:`, error);
        // Fallback response on error
        return {
            "Relevant with securities fraud under federal or state law": false,
            "Relevant with accounting fraud or violations of GAAP": false,
            "Relevant with fiduciary duty violations by officers or directors": false,
            "Relevant with fraudulent conveyance or preferential transfers in bankruptcy": false,
            "Relevant with conspiracy to commit fraud or obstruction of justice": false,
            reasoning: `An error occurred during processing. Error: ${error instanceof Error ? error.message : String(error)}`,
        };
    }
}
