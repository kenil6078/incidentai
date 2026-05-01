import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold  } from '@google/generative-ai';
import { config } from '../config/config.js';

const genAI = new GoogleGenerativeAI(config.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ 
  model: "gemini-1.5-flash",
  safetySettings: [
    {
      category: HarmCategory.HARM_CATEGORY_HARASSMENT,
      threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
    },
  ],
});

export const generateSummaryStream = async (incident, timeline, onChunk) => {
  const prompt = `
    You are an expert incident responder. Summarize the following incident using professional Markdown.
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

  const result = await model.generateContentStream(prompt);
  for await (const chunk of result.stream) {
    const chunkText = chunk.text();
    onChunk(chunkText);
  }
};

export const generateSummary = async (incident, timeline) => {
  let fullText = '';
  await generateSummaryStream(incident, timeline, (chunk) => {
    fullText += chunk;
  });
  return fullText;
};

export const suggestRootCauseStream = async (incident, timeline, onChunk) => {
  const prompt = `
    Analyze the following incident logs and suggest potential root causes using professional Markdown.
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

  const result = await model.generateContentStream(prompt);
  for await (const chunk of result.stream) {
    const chunkText = chunk.text();
    onChunk(chunkText);
  }
};

export const suggestRootCause = async (incident, timeline) => {
  let fullText = '';
  await suggestRootCauseStream(incident, timeline, (chunk) => {
    fullText += chunk;
  });
  return fullText;
};

export const generatePostmortemStream = async (incident, timeline, onChunk) => {
  const prompt = `
    Generate a professional blameless postmortem report for the following incident using Markdown.
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

  const result = await model.generateContentStream(prompt);
  for await (const chunk of result.stream) {
    const chunkText = chunk.text();
    onChunk(chunkText);
  }
};

export const generatePostmortem = async (incident, timeline) => {
  let fullText = '';
  await generatePostmortemStream(incident, timeline, (chunk) => {
    fullText += chunk;
  });
  return fullText;
};

