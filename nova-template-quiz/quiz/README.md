# NOVA Starter Template — Quiz / Assessment Tool

Use this template when your tool asks multiple questions and assigns the user to a type, stage, or category with a tailored action plan.

## Best for
- Business stage assessments
- Learning style identifiers
- Readiness assessments
- Personality or style quizzes
- Any tool where users answer questions and get assigned to a specific category with tailored advice

## What to customize

### 1. Questions (public/index.html)
- Update TOTAL_QUESTIONS to match your question count
- Rewrite each question text, hint, and answer options
- Update data-value attributes on each answer option
- Update the question labels in buildAnswerSummary()
- Add or remove question steps as needed (copy the pattern)
- For text input questions, follow the q4 pattern

### 2. System prompt (api/index.js)
- Define your categories clearly in the Context section
- Give clear criteria for when each category applies
- Update the JSON keys if you want different result fields

### 3. Results display (public/index.html)
- The displayResults() function maps JSON keys to HTML elements
- Update element IDs and JSON keys to match your structure

### 4. Brand tokens (public/index.html)
Update the :root CSS variables from your Brand Token Cheatsheet.

### 5. Content
- Header: tag, title, subtitle, credibility signal
- Email gate copy
- Footer: brand name and URL

### 6. Email capture
Uncomment and implement the captureEmail() call in handleGate().
See Module 4 Lesson 4.5 for the full implementation.

## Deploy to Vercel
1. Push to GitHub
2. Import to Vercel
3. Add environment variable: ANTHROPIC_API_KEY
4. Deploy

## Temperature
Recommended: 0.3 to 0.5 for consistent category assignment
