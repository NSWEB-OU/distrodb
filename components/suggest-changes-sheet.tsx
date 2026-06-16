"use client";

import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface SuggestChangesSheetProps {
  distroName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type Status = "idle" | "submitting" | "success" | "error";

export function SuggestChangesSheet({ distroName, open, onOpenChange }: SuggestChangesSheetProps) {
  const [field, setField] = useState("");
  const [suggestion, setSuggestion] = useState("");
  const [contact, setContact] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  function reset() {
    setField("");
    setSuggestion("");
    setContact("");
    setStatus("idle");
    setErrorMsg("");
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!field.trim() || !suggestion.trim()) return;

    setStatus("submitting");
    setErrorMsg("");

    try {
      const res = await fetch("/api/suggest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          distro: distroName,
          field: field.trim(),
          suggestion: suggestion.trim(),
          contact: contact.trim() || undefined,
        }),
      });

      if (res.ok) {
        setStatus("success");
      } else if (res.status === 429) {
        setStatus("error");
        setErrorMsg("Too many requests. Please try again later.");
      } else {
        const data = (await res.json()) as { error?: string };
        setStatus("error");
        setErrorMsg(data.error ?? "Something went wrong. Please try again.");
      }
    } catch {
      setStatus("error");
      setErrorMsg("Network error. Please try again.");
    }
  }

  function handleOpenChange(next: boolean) {
    if (!next) reset();
    onOpenChange(next);
  }

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetContent side="right" className="flex flex-col overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Suggest a change</SheetTitle>
          <SheetDescription>
            Found an error or outdated info for{" "}
            <span className="text-foreground font-medium">{distroName}</span>? Let us know what
            should be fixed.
          </SheetDescription>
        </SheetHeader>

        {status === "success" ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 p-4 text-center">
            <p className="text-sm font-medium">Thanks for your suggestion!</p>
            <p className="text-muted-foreground text-xs">
              We&apos;ll review it and update the page if needed.
            </p>
            <Button variant="outline" size="sm" onClick={() => handleOpenChange(false)}>
              Close
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-1 flex-col gap-4 p-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="sc-distro">Distro</Label>
              <Input id="sc-distro" value={distroName} disabled />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="sc-field">
                What needs to be changed?
                <span className="text-destructive ml-0.5">*</span>
              </Label>
              <Input
                id="sc-field"
                placeholder="e.g. Latest version, Package manager…"
                value={field}
                onChange={(e) => setField(e.target.value)}
                maxLength={200}
                required
                disabled={status === "submitting"}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="sc-suggestion">
                Correct information
                <span className="text-destructive ml-0.5">*</span>
              </Label>
              <Textarea
                id="sc-suggestion"
                placeholder="Describe what the correct value or info should be…"
                value={suggestion}
                onChange={(e) => setSuggestion(e.target.value)}
                maxLength={2000}
                required
                disabled={status === "submitting"}
                className="min-h-28 resize-none"
              />
              <span className="text-muted-foreground text-right text-xs">
                {suggestion.length}/2000
              </span>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="sc-contact">Contact (optional)</Label>
              <Input
                id="sc-contact"
                placeholder="Email or other — only used to follow up"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                maxLength={200}
                disabled={status === "submitting"}
              />
            </div>

            {status === "error" && <p className="text-destructive text-xs">{errorMsg}</p>}

            <SheetFooter className="mt-auto p-0">
              <Button
                type="button"
                variant="outline"
                onClick={() => handleOpenChange(false)}
                disabled={status === "submitting"}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={status === "submitting" || !field.trim() || !suggestion.trim()}
              >
                {status === "submitting" ? "Sending…" : "Send suggestion"}
              </Button>
            </SheetFooter>
          </form>
        )}
      </SheetContent>
    </Sheet>
  );
}
