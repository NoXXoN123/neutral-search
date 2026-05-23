import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const port = process.env.PORT || 9003;
const app = express();
app.use(cors());
app.use(express.json());


const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY // API key is hidden in the .env file
	// .env contains GEMINI_API_KEY=<API KEY FROM GOOGLE>
});

app.post('/summarize', async (req, res) => { // API responds to /summarize via POST requests
    const { query, context } = req.body;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-3.1-flash-lite",
            contents: [
                {
                    parts: [{ text: `Summarize these results to answer: "${query}"\n\nResults:\n${context}` }]
                }
            ],
        });

        res.json({ text: response.text });

    } catch (err) {
        console.error("Gemini Error:", err);
        res.status(500).json({ error: "AI Synthesis failed.", details: err.message });
    }
});

app.listen(port, () => console.log(`Secure Backend live on port ${port}`));

