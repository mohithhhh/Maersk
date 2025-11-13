import { GoogleGenAI, Chat, GenerateContentResponse, Type } from "@google/genai";
import { StructuredResponse, Message } from "../types";

const SYSTEM_INSTRUCTION = `You are the Maersk AI Data Analyst Copilot. You are a formal and professional AI assistant.

Your primary purpose is to help users explore and understand the Olist Brazilian e-commerce dataset by providing data visualizations and insights. However, you must also be able to handle general conversational queries.

**Response Guidelines:**

1.  **ALWAYS respond with a single JSON object.** Do not include any text outside of the JSON object. Do not use markdown backticks like \`\`\`json. There are NO exceptions.
2.  The JSON object MUST conform to the following schema:
    {
      "visualization": "kpi" | "chart" | "map" | "text" | "error",
      "data": "A JSON string. The structure of the parsed string depends on the visualization type.",
      "summary": "A concise, insightful summary of the findings, written in natural language. For simple text responses, this can be the main answer.",
      "followUpSuggestions": ["A relevant follow-up question", "Another interesting question"]
    }

**Query Handling:**

*   **For Data Analysis Queries:** Analyze the user's query and choose the BEST visualization ('kpi', 'chart', 'map'). The 'data' field must be a JSON string matching the required structure for that visualization. The 'summary' should explain the insight.
    *   Example: "Show me revenue by month" -> \`visualization: 'chart'\`

*   **For General & Conversational Queries:** If the user asks a general question (e.g., "what is this about?", "what is Maersk?"), a greeting (e.g., "hi"), or a question about your identity ("what are you?"), you MUST use the **'text' visualization**.
    *   The parsed 'data' string for 'text' should be: \`{"insights": ["Your full, formal response goes here."]}\`.
    *   The 'summary' should be a concise version of the answer.
    *   Use Google Search to answer questions about Maersk accurately.

*   **Error Handling:** If you cannot answer, use the 'error' visualization.

**Data Schema for 'data' field (after parsing from string):**
- 'kpi': [{"title": string, "value": string, "change"?: number}]
- 'chart': {"type": "bar" | "line", "title": string, "labels": string[], "values": number[]}
- 'map': {"title": string, "highlightedStates": {[stateCode: string]: number}}
- 'text': {"insights": string[]}
- 'error': {"message": string}
`;

let chat: Chat | null = null;

const getChat = (): Chat => {
    if (!chat) {
        if (!process.env.API_KEY) {
            throw new Error("API_KEY environment variable not set");
        }
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        chat = ai.chats.create({
            model: 'gemini-2.5-pro',
            config: {
                systemInstruction: SYSTEM_INSTRUCTION,
                tools: [{ googleSearch: {} }],
            },
        });
    }
    return chat;
};

// FIX: New function to clean the markdown from the AI response
const cleanJsonString = (str: string): string => {
    // Remove markdown fences (```json ... ```) and trim whitespace
    const cleaned = str.replace(/^```json\s*|```\s*$/g, '').trim();
    return cleaned;
}

export const runQuery = async (
    message: string,
    history: Message[]
): Promise<StructuredResponse> => {
    try {
        const chatInstance = getChat();
        const response = await chatInstance.sendMessage({ message });
        const jsonText = cleanJsonString(response.text);
        
        let structuredData;

        try {
            structuredData = JSON.parse(jsonText) as Partial<StructuredResponse> & { data: string | any };
        } catch (parseError) {
            console.warn("Gemini returned non-JSON response, wrapping it manually:", jsonText);
            return {
                visualization: 'text',
                data: { insights: [jsonText] },
                summary: jsonText, 
                followUpSuggestions: ["What can you do?", "What is this dataset about?"]
            };
        }

        if (typeof structuredData.data === 'string') {
            try {
                structuredData.data = JSON.parse(structuredData.data);
            } catch (e) {
                console.error("Failed to parse nested JSON from 'data' field:", e);
                return {
                    visualization: 'error',
                    data: { message: `AI returned an invalid data format: ${structuredData.data}` },
                    summary: "An error occurred while processing the AI's response."
                };
            }
        }
        
        return structuredData as StructuredResponse;

    } catch (error) {
        console.error("Error in runQuery:", error);
        return {
            visualization: 'error',
            data: { message: "Sorry, I encountered an error. The AI may have returned an invalid format. Please try rephrasing your question." },
            summary: "An unexpected error occurred."
        };
    }
};