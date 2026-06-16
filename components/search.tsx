"use client";

import { Field, FieldDescription } from "./ui/field";
import { ButtonGroup } from "./ui/button-group";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Kbd, KbdGroup } from "./ui/kbd";
import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

const Search = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [value, setValue] = useState(searchParams.get("q") ?? "");
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setValue(searchParams.get("q") ?? "");
  }, [searchParams]);

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === "k") {
        event.preventDefault();
        inputRef.current?.focus();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  const updateUrl = (q: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (q) {
      params.set("q", q);
    } else {
      params.delete("q");
    }
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const q = e.target.value;
    setValue(q);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => updateUrl(q), 300);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (debounceRef.current) clearTimeout(debounceRef.current);
    updateUrl(value);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Field>
        <ButtonGroup>
          <div className="relative w-full">
            <Input
              ref={inputRef}
              className="h-2 p-6"
              id="input-button-group"
              placeholder="Type name of Linux distribution..."
              value={value}
              onChange={handleChange}
            />
            <KbdGroup className="absolute top-4 right-4 hidden md:flex">
              <Kbd>⌘</Kbd>
              <Kbd>K</Kbd>
            </KbdGroup>
          </div>
          <Button type="submit" variant="outline" size="lg" className="cursor-pointer p-6">
            Search
          </Button>
        </ButtonGroup>
        <FieldDescription>Search for Linux distributions by name or tags.</FieldDescription>
      </Field>
    </form>
  );
};

export default Search;
