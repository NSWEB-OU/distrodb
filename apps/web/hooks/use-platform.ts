import * as React from "react";

export type Platform = "mac" | "windows" | "linux" | "other";

function detectPlatform(): Platform {
  if (typeof navigator === "undefined") return "other";
  const platform = navigator.userAgent || "";
  if (/Mac|iPhone|iPod|iPad/i.test(platform)) return "mac";
  if (/Win/i.test(platform)) return "windows";
  if (/Linux/i.test(platform)) return "linux";
  return "other";
}

export function usePlatform() {
  const [platform, setPlatform] = React.useState<Platform>("other");

  React.useEffect(() => {
    setPlatform(detectPlatform());
  }, []);

  return platform;
}
