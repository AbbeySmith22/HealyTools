// ============================================================
// NOVA STARTER TEMPLATE — DIAGNOSTIC TOOL
// ============================================================
// This serverless function calls the Claude API and returns
// a root cause diagnosis with ranked fixes.
//
// WHAT TO CHANGE:
// 1. The system prompt (marked with CUSTOMIZE below)
// 2. The JSON keys to match your diagnosis structure
// 3. The temperature (0.3-0.5 for reliable diagnoses)
// ============================================================

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // CUSTOMIZE: match field names to what your frontend sends
  const { userInput } = req.body;

  if (!userInput) {
    return res.status(400).json({ error: 'Input is required' });
  }

  // ============================================================
  // SYSTEM PROMPT — CUSTOMIZE THIS FOR YOUR TOOL
  // ============================================================
  const systemPrompt = `
[ROLE]
You are a [specific expert type] who specializes in diagnosing 
[type of problems] for [target audience]. You make specific, 
committed diagnoses based on what you are told.

[TASK]
Based on the user's description of their situation, identify 
the single most likely root cause and give three specific 
fixes ranked by impact.

[CONTEXT]
The user is a [describe your typical user]. They have likely 
tried [common surface-level fixes] without addressing the root 
cause. They need a specific diagnosis, not a list of 
possibilities.

[CONSTRAINTS]
Do not say "it could be many things" — commit to the most 
likely diagnosis. Do not recommend [things you want to avoid]. 
Do not give generic advice that applies to everyone. Be 
ruthlessly specific to what they described.

[FORMAT]
Return ONLY a valid JSON object with these exact keys.
No markdown. No explanation. No text outside the JSON.

{
  "problem_category": "[one of your defined categories]",
  "root_cause": "[one clear sentence naming the actual problem beneath the symptoms]",
  "fix_1": {
    "action": "[specific action to take]",
    "time_to_implement": "[under 1 hour / half day / full day / 1 week]",
    "impact": "High"
  },
  "fix_2": {
    "action": "[specific action to take]",
    "time_to_implement": "[under 1 hour / half day / full day / 1 week]",
    "impact": "Medium"
  },
  "fix_3": {
    "action": "[specific action to take]",
    "time_to_implement": "[under 1 hour / half day / full day / 1 week]",
    "impact": "Medium"
  },
  "what_to_stop": "[one thing they should immediately stop doing or worrying about]",
  "confidence": "High or Medium — based on how much detail they provided"
}
`;

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 1000,
        system: systemPrompt,
        messages: [{ role: 'user', content: userInput }],
        // CUSTOMIZE: 0.3-0.5 for reliable consistent diagnoses
        temperature: 0.4
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(500).json({
        error: data.error?.message || 'Claude API error'
      });
    }

    const raw = data.content[0].text.trim();
    const clean = raw.replace(/```json|```/g, '').trim();
    const result = JSON.parse(clean);

    return res.status(200).json(result);

  } catch (err) {
    return res.status(500).json({
      error: 'Something went wrong. Please try again.'
    });
  }
}
