import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatMistralAI } from "@langchain/mistralai";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { config } from '../config/config.js';

// ── 1. MODELS ─────────────────────────────
const geminiFlash = new ChatGoogleGenerativeAI({
  model: "gemini-2.5-flash",
  apiKey: config.GEMINI_API_KEY,
  apiVersion: "v1beta",
  maxRetries: 1,
  temperature: 0.1,
});

const geminiPro = new ChatGoogleGenerativeAI({
  model: "gemini-1.5-pro",
  apiKey: config.GEMINI_API_KEY,
  apiVersion: "v1beta",
  maxRetries: 1,
  temperature: 0.1,
});

const mistralModel = config.MISTRAL_API_KEY 
  ? new ChatMistralAI({
      model: "mistral-medium-latest",
      apiKey: config.MISTRAL_API_KEY,
      temperature: 0.1,
    })
  : null;


/**
 * runAiStream: LangChain based streaming with plan-based selection
 */
const runAiStream = async (systemPrompt, userPrompt, onChunk, plan = 'free') => {
  const messages = [
    new SystemMessage(systemPrompt),
    new HumanMessage(userPrompt),
  ];

  try {
    console.log(`Attempting AI generation with Gemini 2.5 Flash...`);
    const stream = await geminiFlash.stream(messages);
    for await (const chunk of stream) {
      if (chunk.content) {
        onChunk(chunk.content);
      }
    }
    return;
  } catch (err) {
    console.warn('Gemini 2.5 Flash failed, trying Gemini 1.5 Pro:', err.message);
    
    try {
      console.log('Attempting AI generation with Gemini 1.5 Pro...');
      const stream = await geminiPro.stream(messages);
      for await (const chunk of stream) {
        if (chunk.content) {
          onChunk(chunk.content);
        }
      }
      return;
    } catch (proErr) {
      console.warn('Gemini 1.5 Pro failed, checking Mistral fallback:', proErr.message);
      
      if (mistralModel) {
        try {
          console.log('Falling back to Mistral...');
          const stream = await mistralModel.stream(messages);
          for await (const chunk of stream) {
            if (chunk.content) {
              onChunk(chunk.content);
            }
          }
          return;
        } catch (mistralErr) {
          console.error('Mistral fallback failed:', mistralErr.message);
        }
      }
      throw new Error(`AI generation failed on all providers. Flash Error: ${err.message}, Pro Error: ${proErr.message}`);
    }
  }
};

export const generateSummaryStream = async (incident, timeline, onChunk, plan) => {
  const systemPrompt = `You are an expert incident responder. Summarize the incident using professional Markdown.`;
  const userPrompt = `
    Title: ${incident.title}
    Description: ${incident.description}
    Severity: ${incident.severity}
    Status: ${incident.status}
    
    Timeline:
    ${timeline.map(t => `[${t.timestamp || t.createdAt}] ${t.createdBy?.name || 'System'}: ${t.message}`).join('\n')}
    
    Use the structure: # Incident Summary, ## Overview, ## Current Status, ## Next Steps.
  `;

  await runAiStream(systemPrompt, userPrompt, onChunk, plan);
};

export const suggestRootCauseStream = async (incident, timeline, onChunk, plan) => {
  const systemPrompt = `Analyze incident logs and suggest potential root causes using professional Markdown.`;
  const userPrompt = `
    Title: ${incident.title}
    Description: ${incident.description}
    
    Timeline:
    ${timeline.map(t => `[${t.timestamp || t.createdAt}] ${t.createdBy?.name || 'System'}: ${t.message}`).join('\n')}
    
    Provide 3 hypotheses with Hypothesis, Evidence, and Fix.
  `;

  await runAiStream(systemPrompt, userPrompt, onChunk, plan);
};

export const generatePostmortemStream = async (incident, timeline, onChunk, plan) => {
  const systemPrompt = `Generate a professional blameless postmortem report for the incident using Markdown.`;
  const userPrompt = `
    Title: ${incident.title}
    Resolved At: ${incident.resolvedAt}
    
    Timeline:
    ${timeline.map(t => `[${t.timestamp || t.createdAt}] ${t.createdBy?.name || 'System'}: ${t.message}`).join('\n')}
    
    Structure: # Postmortem Report, ## Executive Summary, ## Root Cause, ## Resolution, ## Lessons Learned, ## Action Items.
  `;

  await runAiStream(systemPrompt, userPrompt, onChunk, plan);
};

