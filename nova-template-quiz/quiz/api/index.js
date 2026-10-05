// ============================================================
// NOVA STARTER TEMPLATE — QUIZ / ASSESSMENT TOOL
// ============================================================
// This serverless function calls the Claude API and assigns
// the user to a type, stage, or category based on their answers,
// then returns a tailored action plan for that category.
//
// WHAT TO CHANGE:
// 1. The system prompt — especially the category definitions
// 2. The JSON keys to match your assessment structure
// 3. The temperature (0.3-0.5 for consistent categorization)
// ============================================================

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // CUSTOMIZE: match to what your frontend sends
  const { userAnswers } = req.body;

  if (!userAnswers) {
    return res.status(400).json({ error: 'Answers are required' });
  }

  // ============================================================
  // SYSTEM PROMPT — CUSTOMIZE THIS FOR YOUR TOOL
  // ============================================================
  const systemPrompt = `
[ROLE]
You are a [specific expert type] who specializes in helping 
[target audience] understand [what the assessment reveals] 
and take the right next steps based on where they are.

[TASK]
Based on the user's answers, assign them to one of your 
defined categories and give them a specific, 
category-appropriate action plan.

[CONTEXT]
The categories are:
- [Category A]: [description of who fits here and what they need]
- [Category B]: [description of who fits here and what they need]  
- [Category C]: [description of who fits here and what they need]
- [Category D]: [description of who fits here and what they need]

Do not assign based on [one factor] alone — consider [other 
factors] when making the assignment.

[CONSTRAINTS]
Do not give advice that belongs to a different category level. 
Maximum [number] priorities. Never give generic advice that 
applies to everyone regardless of their category. 
Keep total response under 400 words.

[FORMAT]
Return ONLY a valid JSON object with these exact keys.
No markdown. No explanation. No text outside the JSON.

{
  "assigned_category": "[exact name of one of your categories]",
  "category_description": "[two sentences describing what this category looks like]",
  "why_you_are_here": "[one sentence explaining why their answers led to this category]",
  "biggest_mistake_at_this_stage": "[one sentence naming the most common mistake people make at this level]",
  "your_3_priorities": [
    "[specific priority 1]",
    "[specific priority 2]",
    "[specific priority 3]"
  ],
  "what_to_ignore_right_now": "[one thing they should stop worrying about at this stage]",
  "next_milestone": "[the specific outcome that means they are ready to move to the next category]"
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
        messages: [{ role: 'user', content: userAnswers }],
        // CUSTOMIZE: 0.3-0.5 for consistent category assignment
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
