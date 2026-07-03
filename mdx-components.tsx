import type { MDXComponents } from "mdx/types";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h2: ({ children }) => (
      <h2 className="mt-8 mb-3 text-base font-semibold tracking-tight first:mt-0">{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 className="mt-6 mb-2 text-sm font-semibold tracking-tight">{children}</h3>
    ),
    p: ({ children }) => (
      <p className="text-muted-foreground mb-3 text-sm leading-relaxed last:mb-0">{children}</p>
    ),
    ul: ({ children }) => (
      <ul className="text-muted-foreground mb-3 flex flex-col gap-1.5 text-sm last:mb-0">
        {children}
      </ul>
    ),
    li: ({ children }) => (
      <li className="flex items-start gap-2">
        <span className="bg-muted-foreground/50 mt-2 size-1 shrink-0 rounded-full" />
        <span>{children}</span>
      </li>
    ),
    code: ({ children }) => (
      <code className="bg-muted rounded px-1.5 py-0.5 font-mono text-xs">{children}</code>
    ),
    a: ({ href, children }) => (
      <a
        href={href}
        className="text-foreground underline underline-offset-4 transition-opacity hover:opacity-70"
        target={href?.startsWith("http") ? "_blank" : undefined}
        rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
      >
        {children}
      </a>
    ),
    ...components,
  };
}
