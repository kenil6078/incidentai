import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatMistralAI } from "@langchain/mistralai";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { config } from '../config/config.js';

// ── 1. PRIMARY MODEL: Gemini ─────────────────────────────
const geminiModel = new ChatGoogleGenerativeAI({
  model: "gemini-1.5-flash",
  apiKey: config.GEMINI_API_KEY,
  apiVersion: "v1", // Explicitly using v1 for stability
  maxRetries: 1,
  temperature: 0.1,
});

// ── 2. BACKUP MODEL: Mistral ─────────────────────────────
const mistralModel = config.MISTRAL_API_KEY 
  ? new ChatMistralAI({
      model: "mistral-large-latest",
      apiKey: config.MISTRAL_API_KEY,
      temperature: 0.1,
    })
  : null;


/**
 * runAiStream: LangChain based streaming with fallback
 */
const runAiStream = async (systemPrompt, userPrompt, onChunk) => {
  const messages = [
    new SystemMessage(systemPrompt),
    new HumanMessage(userPrompt),
  ];

  try {
    console.log('Attempting AI generation with Gemini (LangChain)...');
    const stream = await geminiModel.stream(messages);
    for await (const chunk of stream) {
      if (chunk.content) {
        onChunk(chunk.content);
      }
    }
  } catch (geminiErr) {
    console.warn('Gemini (LangChain) failed, falling back to Mistral:', geminiErr.message);
    try {
      if (!mistralModel) {
        throw new Error('Mistral backup model is not configured (missing API key).');
      }
      const stream = await mistralModel.stream(messages);
      for await (const chunk of stream) {
        if (chunk.content) {
          onChunk(chunk.content);
        }
      }
    } catch (mistralErr) {
      console.error('Mistral (LangChain) Backup Failed:', mistralErr.message);
      throw new Error(`AI generation failed on both Gemini and Mistral providers. Error: ${mistralErr.message}`);
    }
  }

};

export const generateSummaryStream = async (incident, timeline, onChunk) => {
  const systemPrompt = `You are an expert incident responder. Summarize the incident using professional Markdown.`;
  const userPrompt = `
    Title: ${incident.title}
    Description: ${incident.description}
    Severity: ${incident.severity}
    Status: ${incident.status}
    
    Timeline:
    ${timeline.map(t => `[${t.timestamp || t.createdAt}] ${t.createdBy?.name || 'System'}: ${t.message}`).join('\n')}
    
    Use the following structure:
    # Incident Summary
    ## Overview
    (A concise summary of what happened)
    
    ## Current Status
    (The current state of the incident)
    
    ## Next Steps
    (Bulleted list of recommended actions)
  `;

  await runAiStream(systemPrompt, userPrompt, onChunk);
};

export const generateSummary = async (incident, timeline) => {
  let fullText = '';
  await generateSummaryStream(incident, timeline, (chunk) => {
    fullText += chunk;
  });
  return fullText;
};

export const suggestRootCauseStream = async (incident, timeline, onChunk) => {
  const systemPrompt = `Analyze incident logs and suggest potential root causes using professional Markdown.`;
  const userPrompt = `
    Title: ${incident.title}
    Description: ${incident.description}
    
    Timeline:
    ${timeline.map(t => `[${t.timestamp || t.createdAt}] ${t.createdBy?.name || 'System'}: ${t.message}`).join('\n')}
    
    # Root Cause Analysis
    Provide 3 potential hypotheses with the following for each:
    - **Hypothesis**: Description
    - **Evidence**: Why this is likely
    - **Fix**: Recommended resolution
  `;

  await runAiStream(systemPrompt, userPrompt, onChunk);
};

export const suggestRootCause = async (incident, timeline) => {
  let fullText = '';
  await suggestRootCauseStream(incident, timeline, (chunk) => {
    fullText += chunk;
  });
  return fullText;
};

export const generatePostmortemStream = async (incident, timeline, onChunk) => {
  const systemPrompt = `Generate a professional blameless postmortem report for the incident using Markdown.`;
  const userPrompt = `
    Title: ${incident.title}
    Resolved At: ${incident.resolvedAt}
    
    Timeline:
    ${timeline.map(t => `[${t.timestamp || t.createdAt}] ${t.createdBy?.name || 'System'}: ${t.message}`).join('\n')}
    
    # Postmortem Report
    
    ## Executive Summary
    (Brief overview)
    
    ## Root Cause
    (Detailed analysis)
    
    ## Resolution
    (How it was fixed)
    
    ## Lessons Learned
    (What we can do better)
    
    ## Action Items
    (Checklist of tasks to prevent recurrence)
  `;

  await runAiStream(systemPrompt, userPrompt, onChunk);
};

export const generatePostmortem = async (incident, timeline) => {
  let fullText = '';
  await generatePostmortemStream(incident, timeline, (chunk) => {
    fullText += chunk;
  });
  return fullText;
};

