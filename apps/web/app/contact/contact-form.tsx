"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

type Status = "idle" | "submitting" | "success" | "error";

export function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  function reset() {
    setName("");
    setEmail("");
    setSubject("");
    setMessage("");
    setStatus("idle");
    setErrorMsg("");
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !subject.trim() || !message.trim()) return;

    setStatus("submitting");
    setErrorMsg("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          subject: subject.trim(),
          message: message.trim(),
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

  if (status === "success") {
    return (
      <div className="flex flex-col items-center gap-4 py-12 text-center">
        <p className="text-base font-medium">Message sent!</p>
        <p className="text-muted-foreground max-w-sm text-sm">
          Thanks for reaching out. We&apos;ll get back to you as soon as possible.
        </p>
        <Button variant="outline" size="sm" onClick={reset}>
          Send another message
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="contact-name">
            Name <span className="text-destructive">*</span>
          </Label>
          <Input
            id="contact-name"
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={200}
            required
            disabled={status === "submitting"}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="contact-email">
            Email <span className="text-destructive">*</span>
          </Label>
          <Input
            id="contact-email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            maxLength={254}
            required
            disabled={status === "submitting"}
          />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="contact-subject">
          Subject <span className="text-destructive">*</span>
        </Label>
        <Input
          id="contact-subject"
          placeholder="What is this about?"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          maxLength={200}
          required
          disabled={status === "submitting"}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="contact-message">
          Message <span className="text-destructive">*</span>
        </Label>
        <Textarea
          id="contact-message"
          placeholder="Tell us more…"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          maxLength={3000}
          rows={6}
          required
          disabled={status === "submitting"}
          className="resize-none"
        />
        <p className="text-muted-foreground text-right text-xs">{message.length}/3000</p>
      </div>

      {status === "error" && <p className="text-destructive text-sm">{errorMsg}</p>}

      <Button
        type="submit"
        disabled={
          status === "submitting" ||
          !name.trim() ||
          !email.trim() ||
          !subject.trim() ||
          !message.trim()
        }
        className="self-end"
      >
        {status === "submitting" ? "Sending…" : "Send message"}
      </Button>
    </form>
  );
}
