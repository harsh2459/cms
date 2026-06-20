const axios = require('axios');

const SYSTEM_PROMPT = `You are an expert construction project estimator. Given a free-text description of a construction project, you must respond with ONLY a single valid JSON object (no markdown, no code fences, no commentary) in exactly this shape:

{
  "estimated_cost": number,
  "estimated_days": number,
  "materials": [{ "name": string, "unit": string, "quantity": number, "unit_price": number, "total_cost": number }],
  "labor": [{ "role": string, "count": number, "duration_days": number, "daily_wage": number, "total_cost": number }],
  "summary": string
}

Rules:
- "estimated_cost" must equal the sum of all materials' total_cost plus all labor's total_cost.
- Each material's total_cost must equal quantity * unit_price.
- Each labor row's total_cost must equal count * duration_days * daily_wage.
- Use Indian Rupees (INR) for all costs unless the description specifies another currency or country.
- Include realistic, commonly used construction materials (cement, steel, sand, aggregate, bricks, etc.) and labor roles (mason, helper, carpenter, electrician, plumber, supervisor, etc.) relevant to the described project.
- "summary" should be a 3-6 sentence written report describing the project scope, key cost drivers, and timeline reasoning.
- Respond with ONLY the JSON object, nothing else.`;

async function getEstimate(description) {
  const apiKey = process.env.GROK_API_KEY;
  const apiUrl = process.env.GROK_API_URL || 'https://api.x.ai/v1/chat/completions';
  const model = process.env.GROK_MODEL || 'grok-beta';

  if (!apiKey) {
    throw new Error('GROK_API_KEY is not configured on the server');
  }

  let response;
  try {
    response = await axios.post(
      apiUrl,
      {
        model,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: description },
        ],
        temperature: 0.3,
        response_format: { type: 'json_object' },
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        timeout: 30000,
      }
    );
  } catch (err) {
    const detail = err.response?.data?.error?.message || err.message;
    throw new Error(`AI service request failed: ${detail}`);
  }

  const content = response.data?.choices?.[0]?.message?.content;
  if (!content) {
    throw new Error('AI service returned an empty response');
  }

  let parsed;
  try {
    parsed = JSON.parse(content);
  } catch {
    throw new Error('AI returned an unexpected format, please try rephrasing your description');
  }

  if (
    typeof parsed.estimated_cost !== 'number' ||
    typeof parsed.estimated_days !== 'number' ||
    !Array.isArray(parsed.materials) ||
    !Array.isArray(parsed.labor) ||
    typeof parsed.summary !== 'string'
  ) {
    throw new Error('AI returned an incomplete estimate, please try rephrasing your description');
  }

  return { parsed, raw: response.data };
}

const ANALYSIS_SYSTEM_PROMPT = `You are an expert construction project analyst. Given a JSON snapshot of a construction project's current data (budget, tasks, issues, workers, expenses), you must respond with ONLY a single valid JSON object (no markdown, no code fences, no commentary) in exactly this shape:

{
  "health": "on_track" | "at_risk" | "critical",
  "summary": string,
  "risks": [string],
  "recommendations": [string]
}

Rules:
- "health" reflects overall project health based on budget utilization vs progress, open issues, and task completion rate.
- "summary" should be a 4-6 sentence written analysis covering progress, budget status, and notable concerns.
- "risks" should list 2-5 short, specific risk statements (e.g. "Budget utilization (62%) is outpacing task completion (40%)").
- "recommendations" should list 2-5 short, actionable suggestions for the project manager.
- Respond with ONLY the JSON object, nothing else.`;

async function analyzeProject(snapshot) {
  const apiKey = process.env.GROK_API_KEY;
  const apiUrl = process.env.GROK_API_URL || 'https://api.x.ai/v1/chat/completions';
  const model = process.env.GROK_MODEL || 'grok-beta';

  if (!apiKey) {
    throw new Error('GROK_API_KEY is not configured on the server');
  }

  let response;
  try {
    response = await axios.post(
      apiUrl,
      {
        model,
        messages: [
          { role: 'system', content: ANALYSIS_SYSTEM_PROMPT },
          { role: 'user', content: JSON.stringify(snapshot) },
        ],
        temperature: 0.3,
        response_format: { type: 'json_object' },
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        timeout: 30000,
      }
    );
  } catch (err) {
    const detail = err.response?.data?.error?.message || err.message;
    throw new Error(`AI service request failed: ${detail}`);
  }

  const content = response.data?.choices?.[0]?.message?.content;
  if (!content) {
    throw new Error('AI service returned an empty response');
  }

  let parsed;
  try {
    parsed = JSON.parse(content);
  } catch {
    throw new Error('AI returned an unexpected format, please try again');
  }

  if (
    typeof parsed.summary !== 'string' ||
    !Array.isArray(parsed.risks) ||
    !Array.isArray(parsed.recommendations) ||
    typeof parsed.health !== 'string'
  ) {
    throw new Error('AI returned an incomplete analysis, please try again');
  }

  return parsed;
}

const WORKER_REVIEW_SYSTEM_PROMPT = `You are an HR/site-performance analyst for a construction company. Given a JSON snapshot of a worker's attendance and task history, you must respond with ONLY a single valid JSON object (no markdown, no code fences, no commentary) in exactly this shape:

{
  "rating": "excellent" | "good" | "average" | "needs_improvement",
  "summary": string,
  "strengths": [string],
  "concerns": [string],
  "recommendations": [string]
}

Rules:
- "rating" reflects overall performance based on attendance consistency and task completion rate.
- "summary" should be a 3-5 sentence written review of the worker's reliability and productivity.
- "strengths" should list 1-4 short positive observations (e.g. "Consistent attendance at 95% over the period").
- "concerns" should list 0-4 short specific concerns (e.g. "3 tasks overdue past their deadline"). Use an empty array if there are none.
- "recommendations" should list 1-4 short actionable suggestions for the site manager regarding this worker (e.g. training, recognition, follow-up).
- Be fair and specific — base every statement only on the provided data, do not invent details.
- Respond with ONLY the JSON object, nothing else.`;

async function analyzeWorker(snapshot) {
  const apiKey = process.env.GROK_API_KEY;
  const apiUrl = process.env.GROK_API_URL || 'https://api.x.ai/v1/chat/completions';
  const model = process.env.GROK_MODEL || 'grok-beta';

  if (!apiKey) {
    throw new Error('GROK_API_KEY is not configured on the server');
  }

  let response;
  try {
    response = await axios.post(
      apiUrl,
      {
        model,
        messages: [
          { role: 'system', content: WORKER_REVIEW_SYSTEM_PROMPT },
          { role: 'user', content: JSON.stringify(snapshot) },
        ],
        temperature: 0.3,
        response_format: { type: 'json_object' },
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        timeout: 30000,
      }
    );
  } catch (err) {
    const detail = err.response?.data?.error?.message || err.message;
    throw new Error(`AI service request failed: ${detail}`);
  }

  const content = response.data?.choices?.[0]?.message?.content;
  if (!content) {
    throw new Error('AI service returned an empty response');
  }

  let parsed;
  try {
    parsed = JSON.parse(content);
  } catch {
    throw new Error('AI returned an unexpected format, please try again');
  }

  if (
    typeof parsed.summary !== 'string' ||
    typeof parsed.rating !== 'string' ||
    !Array.isArray(parsed.strengths) ||
    !Array.isArray(parsed.concerns) ||
    !Array.isArray(parsed.recommendations)
  ) {
    throw new Error('AI returned an incomplete review, please try again');
  }

  return parsed;
}

module.exports = { getEstimate, analyzeProject, analyzeWorker };
