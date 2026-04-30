const { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ 
  model: "gemini-2.5-flash",
  safetySettings: [
    {
      category: HarmCategory.HARM_CATEGORY_HARASSMENT,
      threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
    },
  ],
});

const generateSummary = async (incident, timeline) => {
  const prompt = `
    You are an expert incident responder. Summarize the following incident using professional Markdown.
    Title: ${incident.title}
    Description: ${incident.description}
    Severity: ${incident.severity}
    Status: ${incident.status}
    
    Timeline:
    ${timeline.map(t => `[${t.timestamp}] ${t.createdBy?.name || 'System'}: ${t.message}`).join('\n')}
    
    Use the following structure:
    # Incident Summary
    ## Overview
    (A concise summary of what happened)
    
    ## Current Status
    (The current state of the incident)
    
    ## Next Steps
    (Bulleted list of recommended actions)
  `;

  const result = await model.generateContent(prompt);
  return result.response.text();
};

const suggestRootCause = async (incident, timeline) => {
  const prompt = `
    Analyze the following incident logs and suggest potential root causes using professional Markdown.
    Title: ${incident.title}
    Description: ${incident.description}
    
    Timeline:
    ${timeline.map(t => `[${t.timestamp}] ${t.createdBy?.name || 'System'}: ${t.message}`).join('\n')}
    
    # Root Cause Analysis
    Provide 3 potential hypotheses with the following for each:
    - **Hypothesis**: Description
    - **Evidence**: Why this is likely
    - **Fix**: Recommended resolution
  `;

  const result = await model.generateContent(prompt);
  return result.response.text();
};

const generatePostmortem = async (incident, timeline) => {
  const prompt = `
    Generate a professional blameless postmortem report for the following incident using Markdown.
    Title: ${incident.title}
    Resolved At: ${incident.resolvedAt}
    
    Timeline:
    ${timeline.map(t => `[${t.timestamp}] ${t.createdBy?.name || 'System'}: ${t.message}`).join('\n')}
    
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

  const result = await model.generateContent(prompt);
  return result.response.text();
};

module.exports = {
  generateSummary,
  suggestRootCause,
  generatePostmortem
};
