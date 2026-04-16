"use client";

import { useState } from "react";
// Suppression de CheckCircle2 (inutilisé)
import { Loader2, Link2, AlertCircle, Users, ExternalLink, Trash2, UserPlus } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { updateTrackedAccounts, deleteTrackedAccount } from "@/app/actions/track-accounts";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Separator } from "./ui/separator";
import { ScrollArea } from "./ui/scroll-area";
import { Avatar, AvatarFallback } from "./ui/avatar";

const MAX_ACCOUNTS = 1;
const LINKEDIN_PREFIX = "https://www.linkedin.com/in/";

interface TrackedAccount {
  id: string;
  linkedinUrl: string;
  createdAt: Date;
}

export function AccountUrlForm({
  initialAccounts = [],
  forceOpen = false,
  defaultOpen = true,
}: { initialAccounts?: TrackedAccount[]; forceOpen?: boolean; defaultOpen?: boolean }) {
  const [accounts, setAccounts] = useState(initialAccounts);
  const [open, setOpen] = useState(forceOpen ? defaultOpen : false);
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();
  
  const cleanInputUrl = (rawUrl: string) => rawUrl.split("?")[0].split("#")[0].trim();
  const getDisplayName = (fullUrl: string) => fullUrl.replace(LINKEDIN_PREFIX, "").replace(/\/$/, "");

  const canAdd = url.startsWith(LINKEDIN_PREFIX) && url.length > LINKEDIN_PREFIX.length + 2;
  const isLimitReached = accounts.length >= MAX_ACCOUNTS;

  const handleSave = async () => {
    if (!canAdd || loading || isLimitReached) return;
    setLoading(true);
    setError(null);

    try {
      const targetUrl = cleanInputUrl(url);
      if (accounts.some(a => cleanInputUrl(a.linkedinUrl) === targetUrl)) {
        throw new Error("Déjà suivi.");
      }

      await updateTrackedAccounts([targetUrl]);
      await fetch("/api/scrape/accounts", { method: "POST" });

      setAccounts([{ id: Math.random().toString(), linkedinUrl: targetUrl, createdAt: new Date() }, ...accounts]);
      setUrl("");
      router.refresh();
    } catch (err) {
      // Correction de no-explicit-any : on vérifie si c'est une instance d'Error
      const errorMessage = err instanceof Error ? err.message : "Erreur lors de l'ajout.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
  setLoading(true);
  try {
    const res = await deleteTrackedAccount(id);
    if (res.success) {
      // Met à jour l'état local pour une UI réactive
      setAccounts(prev => prev.filter(acc => acc.id !== id));
    } else {
      setError(res.error || "Erreur lors de la suppression");
    }
  } catch (err) {
  console.error("Delete account error:", err); 
  setError("Une erreur est survenue lors de la communication avec le serveur.");
}
};

  return (
    <>
  {!forceOpen && (
    <Button variant="outline" onClick={() => setOpen(true)} className="rounded-full shadow-sm">
      <Users className="mr-2 h-4 w-4" />
      Comptes
      <Badge variant="secondary" className="ml-2 px-1.5 py-0.5">
        {accounts.length}
      </Badge>
    </Button>
  )}

  <Dialog open={open} onOpenChange={(v) => (!forceOpen || v) && setOpen(v)}>
    <DialogContent className="sm:max-w-106.25 p-0 overflow-hidden border-none shadow-2xl">
      {/* Header avec gradient discret */}
      <div className="bg-linear-to-b from-zinc-50 to-white p-6 pb-4">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-semibold tracking-tight">
              Surveillance
            </DialogTitle>
            <Badge 
              variant={isLimitReached ? "destructive" : "secondary"}
              className="font-mono transition-all"
            >
              {accounts.length} / {MAX_ACCOUNTS}
            </Badge>
          </div>
          <DialogDescription className="text-zinc-500 pt-1">
            Suivez de nouveaux profils pour automatiser l&apos;extraction.
          </DialogDescription>
        </DialogHeader>

        {/* Zone de saisie stylisée */}
        <div className="mt-6 space-y-3">
          <div className="group relative flex items-center gap-2">
            <div className="relative flex-1">
              <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 group-focus-within:text-primary transition-colors" />
              <Input 
                placeholder="linkedin.com/in/nom-du-profil" 
                value={url} 
                onChange={e => setUrl(e.target.value)}
                className="pl-9 bg-white border-zinc-200 focus-visible:ring-1"
                disabled={isLimitReached || loading}
              />
            </div>
            <Button 
              onClick={handleSave} 
              disabled={!canAdd || loading || isLimitReached}
              size="icon"
              className="shrink-0 transition-all"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <UserPlus className="h-4 w-4" />}
            </Button>
          </div>
          
          {error && (
            <div className="flex items-center gap-2 text-[12px] text-destructive bg-destructive/5 p-2 rounded-md animate-in fade-in slide-in-from-top-1">
              <AlertCircle className="h-3.5 w-3.5" />
              {error}
            </div>
          )}
        </div>
      </div>

      <Separator />

      {/* Liste des comptes avec ScrollArea */}
      <div className="bg-white">
        <div className="px-6 py-3">
          <h4 className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
            Profils actifs
          </h4>
        </div>
        
        <ScrollArea className="h-70 px-4 pb-4">
          {accounts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="h-12 w-12 rounded-full bg-zinc-50 flex items-center justify-center mb-3">
                <Users className="h-6 w-6 text-zinc-300" />
              </div>
              <p className="text-sm text-zinc-500">Aucun profil sous surveillance</p>
              <p className="text-xs text-zinc-400">Ajoutez un lien pour commencer</p>
            </div>
          ) : (
            <div className="space-y-1">
              {accounts.map(acc => (
                <div 
                  key={acc.id} 
                  className="flex items-center justify-between p-2 rounded-lg hover:bg-zinc-50 transition-colors group border border-transparent hover:border-zinc-100"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <Avatar className="h-8 w-8 border">
                      <AvatarFallback className="bg-zinc-100 text-[10px] uppercase">
                        {getDisplayName(acc.linkedinUrl).substring(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col min-w-0">
                      <span 
  className="text-sm font-medium text-zinc-700" 
  title={getDisplayName(acc.linkedinUrl)}
>
  {getDisplayName(acc.linkedinUrl).length > 30 
    ? `${getDisplayName(acc.linkedinUrl).substring(0, 30)}...` 
    : getDisplayName(acc.linkedinUrl)}
</span>
                      <span className="text-[10px] text-zinc-400 truncate flex items-center gap-1">
                        LinkedIn Profile <ExternalLink className="h-2 w-2" />
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-400 hover:text-destructive" onClick={() => handleDelete(acc.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-400" asChild>
                      <a href={acc.linkedinUrl} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </div>
      
      {forceOpen && (
        <div className="bg-amber-50 border-t border-amber-100 p-3 text-center">
          <p className="text-[11px] text-amber-700 font-medium">
            Configuration requise avant de continuer
          </p>
        </div>
      )}
    </DialogContent>
  </Dialog>
</>
  );
}