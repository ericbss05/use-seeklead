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

export function iaScoringLead(leads: Array<{
  id: string;
  name: string;
  subtitle?: string | null;
  content?: string | null;
  postContent?: string | null;
}>) {
  return `
Tu es un système de qualification de leads B2B spécialisé dans l’analyse d’intention.
Ton rôle est d'analyser une liste de ${leads.length} commentaires LinkedIn pour déterminer s'ils contiennent un SIGNAL BUSINESS exploitable.

---

🎯 OBJECTIF
Pour chaque élément de la liste, compare :
- le CONTEXTE du post LinkedIn
- le COMMENTAIRE du lead
Tu évalues uniquement la pertinence du commentaire par rapport au post.

---

🚫 INTERDICTIONS ABSOLUES
- Ne pas analyser le profil, le nom ou le CV.
- Ne pas juger la personne, uniquement son intention dans le commentaire.
- Conserver impérativement l'identifiant "id" associé à chaque commentaire.

---

🧠 CRITÈRES D'ANALYSE
- Relation du commentaire avec le post.
- Intention implicite (question, accord, intérêt business).
- Signal d’achat ou de besoin.

---

📊 SCORING
1 → Aucun intérêt business (hors sujet, spam, générique "top").
2 → Intérêt moyen (discussion liée au sujet, curiosité, pas d’intention claire).
3 → Fort signal business (besoin explicite, question concrète, problématique métier).

---

📦 OUTPUT STRICT
Retourne un objet JSON contenant une propriété "results" qui est un tableau d'analyses. 
Chaque analyse doit inclure le "leadId" (correspondant à l' "id" fourni).

Format attendu :
{
  "results": [
    {
      "leadId": "string",
      "score": 1 | 2 | 3,
      "feedback": "explication courte"
    }
  ]
}

---

🚀 DONNÉES À ANALYSER (LISTE DE ${leads.length} LEADS) :

${leads.map((l, i) => `
--- LEAD #${i + 1} ---
ID: ${l.id}
CONTEXTE POST: ${l.postContent ?? "Non spécifié"}
COMMENTAIRE: ${l.content ?? "Vide"}
`).join("\n")}
`;
}