
import { GoogleGenAI, Type } from "@google/genai";
import { Document } from '../types';

if (!process.env.API_KEY) {
    console.warn("API_KEY environment variable not set. Using a placeholder.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || 'MISSING_API_KEY' });

const model = 'gemini-2.5-pro';

const responseSchema = {
    type: Type.OBJECT,
    properties: {
        decision: {
            type: Type.STRING,
            enum: ['Relevant', 'Not Relevant'],
            description: 'The relevance decision for the document.'
        },
        reasoning: {
            type: Type.STRING,
            description: 'A concise, clear, and legally defensible reason for the decision based on the document content.'
        }
    },
    required: ['decision', 'reasoning']
};

const systemInstruction = `You are an expert AI assistant for eDiscovery. Your task is to analyze a document in the context of a specific legal discovery query.
Determine if the document is "Relevant" or "Not Relevant" to the query.
Provide a concise, clear, and legally defensible reason for your decision. Your reasoning must be based solely on the provided document text.
Respond ONLY with the specified JSON object format.`;

export interface GeminiResponse {
    decision: 'Relevant' | 'Not Relevant';
    reasoning: string;
}

export async function processDocumentWithGemini(document: Document, query: string): Promise<GeminiResponse> {
    try {
        const prompt = `Discovery Query: "${query}"\n\nDocument ID: ${document.id}\nDocument Name: ${document.name}\n\n---\n\nDocument Text:\n\n${document.content}`;
        
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

        if (!parsedResponse.decision || !parsedResponse.reasoning) {
            throw new Error('Invalid JSON response from API');
        }

        return parsedResponse;
    } catch (error) {
        console.error(`Error processing document ${document.id}:`, error);
        // Fallback response on error
        return {
            decision: 'Not Relevant',
            reasoning: `An error occurred during processing. Error: ${error instanceof Error ? error.message : String(error)}`,
        };
    }
}
