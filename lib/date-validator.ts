/**
 * Vérifie si un enregistrement date de plus de 72 heures.
 * @param createdAt La date de création du post
 * @throws Error si le délai de 72h est dépassé
 * @returns true si la date est valide (moins de 72h)
 */
export function validatePostFreshness(createdAt: Date): boolean {
  const now = new Date();
  
  // Calcul de la différence en millisecondes
  const diffInMs = now.getTime() - createdAt.getTime();
  
  // 72 heures en millisecondes (72 * 60 * 60 * 1000)
  const LIMIT_MS = 259_200_000;

  if (diffInMs > LIMIT_MS) {
    const hoursPassed = Math.floor(diffInMs / (1000 * 60 * 60));
    throw new Error(`Données périmées : Le post a été créé il y a ${hoursPassed}h (limite : 72h).`);
  }

  return true;
}