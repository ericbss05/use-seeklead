import { Inngest } from "inngest";

export const inngest = new Inngest({ 
  id: "use-seeklead",
  // Cette ligne force Inngest à accepter les connexions locales 
  // si tu n'es pas explicitement en production sur Vercel.
  isDev: process.env.NODE_ENV !== "production"
});