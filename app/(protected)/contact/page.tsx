import { Button } from "@/components/ui/button";
import { MailIcon } from "lucide-react";

export default function ContactPage() {
  const email = "eric.buisson.pro@gmail.com";

  const mailtoLink = `mailto:${email}?subject=Contact%20Seeklead&body=Bonjour,%0A%0AJe%20vous%20contacte%20concernant%20Seeklead.%0A%0A`;

  return (
    <section className="mx-auto max-w-2xl px-6 py-24 text-center">
      
      <h1 className="text-4xl font-bold tracking-tight">
        Nous contacter
      </h1>

      <p className="text-muted-foreground mt-4">
        Une question, un retour ou un problème ?
        Cliquez ci-dessous pour nous envoyer un email directement.
      </p>

      <div className="mt-10 flex justify-center">
        <a href={mailtoLink}>
          <Button size="lg" className="rounded-full">
            <MailIcon className="mr-2 size-4" />
            Envoyer un email
          </Button>
        </a>
      </div>

      <p className="text-sm text-muted-foreground mt-6">
        Ou écrivez-nous directement : <span className="text-blue-500 hover:underline">{email}</span>
      </p>

    </section>
  );
}