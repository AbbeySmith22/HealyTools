# NOVA Starter Template — Diagnostic Tool

Use this template when your tool identifies what is wrong and tells the user exactly what to fix.

## Best for
- Business bottleneck finders
- Funnel leak diagnostics
- Content strategy audits
- Ad performance diagnostics
- Health or wellness symptom checkers
- Any tool where the user describes a situation and gets a root cause plus fixes

## What to customize

### 1. System prompt (api/index.js)
- ROLE: your diagnostic expert identity
- TASK: what you are diagnosing and how many fixes to provide
- CONTEXT: who your user is and what symptoms they typically describe
- CONSTRAINTS: the commit-to-a-diagnosis instruction is critical — keep it
- FORMAT: the JSON keys for your specific diagnosis structure

### 2. Problem categories
Update the problem_category options in your system prompt to match the categories relevant to your niche.

### 3. Brand tokens (public/index.html)
Update the :root CSS variables with your values from the Brand Token Cheatsheet.

### 4. Content
- Header: tag, title, subtitle, credibility signal
- Intro box: what you want users to describe
- Form: field labels, hints, placeholders
- Footer: brand name and URL

### 5. Email capture
Uncomment and implement the captureEmail() call in handleGate().
See Module 4 Lesson 4.5 for the full implementation.

## Deploy to Vercel
1. Push to GitHub
2. Import to Vercel
3. Add environment variable: ANTHROPIC_API_KEY
4. Deploy

## Temperature
Recommended: 0.3 to 0.5 for reliable, committed diagnoses
