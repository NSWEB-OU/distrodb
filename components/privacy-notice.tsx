"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const STORAGE_KEY = "distrodb_privacy_notice_dismissed";

export function PrivacyNotice() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(STORAGE_KEY)) {
        setVisible(true);
      }
    } catch {
      // localStorage unavailable (e.g. private browsing restrictions)
    }
  }, []);

  function dismiss() {
    try {
      localStorage.setItem(STORAGE_KEY, "1");
    } catch {
      // ignore
    }
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="border-border bg-background/95 fixed right-0 bottom-0 left-0 z-50 border-t backdrop-blur-sm">
      <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-muted-foreground text-xs">
          We don&apos;t use tracking or advertising cookies. Your theme preference is stored locally
          on your device only.{" "}
          <Link href="/privacy" className="text-foreground underline underline-offset-4">
            Privacy Policy
          </Link>
        </p>
        <Button
          size="sm"
          variant="outline"
          onClick={dismiss}
          className="shrink-0 self-start sm:self-auto"
        >
          Got it
        </Button>
      </div>
    </div>
  );
}
