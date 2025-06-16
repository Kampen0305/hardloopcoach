declare module '@google/genai' {
  export interface GenerateContentResponse { text: string }
  export class GoogleGenAI {
    constructor(config: { apiKey?: string });
    models: {
      generateContent(options: any): Promise<GenerateContentResponse>;
    };
  }
}

