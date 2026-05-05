export function icpExpansionPrompt(jobTitle: string) {
  return `
You are a B2B growth intelligence system.

TASK:
Expand a job title into LinkedIn search variants for lead targeting.

INPUT:
${jobTitle}

RULES:
- Output ONLY valid JSON
- No markdown
- No explanation
- No extra text
- No backticks
- Must be a JSON array of strings only

CONTENT RULES:
Include:
- exact title
- senior variations (Junior, Senior, Lead, Head, VP, C-Level)
- startup variations (Founder, Co-Founder, CEO & Founder)
- corporate equivalents
- synonyms used on LinkedIn

OUTPUT FORMAT (STRICT):
["string1", "string2", "string3"]

EXAMPLE:
["CEO", "Chief Executive Officer", "Founder", "Co-Founder", "CEO & Founder"]
`;
}