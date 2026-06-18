export type GlossaryCategory =
  | "tag"
  | "init-system"
  | "package-manager"
  | "display-server"
  | "desktop-environment"
  | "release-model";

export type GlossaryEntry = {
  label: string;
  description: string;
  category: GlossaryCategory;
};

export const CATEGORY_LABELS: Record<GlossaryCategory, string> = {
  tag: "Tags",
  "init-system": "Init systems",
  "package-manager": "Package managers",
  "display-server": "Display servers & compositors",
  "desktop-environment": "Desktop environments",
  "release-model": "Release models",
};

export const GLOSSARY: Record<string, GlossaryEntry> = {
  atomic: {
    label: "Atomic",
    category: "tag",
    description:
      "Updates are applied as a single indivisible operation. If anything goes wrong the system rolls back to the previous state, preventing partial or broken updates.",
  },
  "beginner-friendly": {
    label: "Beginner-friendly",
    category: "tag",
    description:
      "Designed to be approachable for users new to Linux. Typically includes graphical installers, sensible defaults, and a large support community.",
  },
  "data-rescue": {
    label: "Data rescue",
    category: "tag",
    description:
      "Ships with tools for recovering deleted files, repairing filesystems, and restoring data from failing drives.",
  },
  declarative: {
    label: "Declarative",
    category: "tag",
    description:
      "The entire system configuration is expressed as a single, reproducible specification file. Rebuilding the system from scratch produces an identical result.",
  },
  desktop: {
    label: "Desktop",
    category: "tag",
    description: "Optimised for daily desktop use with a full graphical environment.",
  },
  developer: {
    label: "Developer",
    category: "tag",
    description:
      "Tailored for software development workflows. Ships with compilers, IDEs, container runtimes, or other development tooling out of the box.",
  },
  education: {
    label: "Education",
    category: "tag",
    description:
      "Bundled with educational software, lesson resources, or classroom-management tools.",
  },
  firewall: {
    label: "Firewall",
    category: "tag",
    description:
      "Purpose-built for network security. Typically deployed as a dedicated firewall, router, or IDS appliance rather than a general-purpose desktop.",
  },
  forensics: {
    label: "Forensics",
    category: "tag",
    description:
      "Provides tools for digital forensics, incident response, and evidence collection. Often boots as a live system to avoid modifying the target drive.",
  },
  "from-ram": {
    label: "From RAM",
    category: "tag",
    description:
      "Can copy itself entirely into RAM at boot so the original boot medium can be removed. Useful for diskless or high-performance live environments.",
  },
  gaming: {
    label: "Gaming",
    category: "tag",
    description:
      "Ships with gaming-optimised kernels, GPU drivers, Wine/Proton integrations, or game launchers pre-installed for the best out-of-the-box gaming experience.",
  },
  immutable: {
    label: "Immutable",
    category: "tag",
    description:
      "The root filesystem is read-only at runtime. Applications are installed via containers or layering, keeping the base system pristine and easily recoverable.",
  },
  kubernetes: {
    label: "Kubernetes",
    category: "tag",
    description:
      "Designed to run Kubernetes or container-orchestration workloads, often as a minimal OS with a container runtime pre-installed.",
  },
  "large-language-model": {
    label: "Large Language Model",
    category: "tag",
    description:
      "Includes AI/LLM tooling such as Ollama, GPU driver stacks, or model-serving frameworks pre-configured for local inference.",
  },
  live: {
    label: "Live",
    category: "tag",
    description:
      "Can be booted directly from a USB drive or DVD without installation, letting you try the distro without touching your hard drive.",
  },
  multimedia: {
    label: "Multimedia",
    category: "tag",
    description:
      "Comes pre-loaded with professional audio, video, or graphics production software and low-latency kernel configurations.",
  },
  mutable: {
    label: "Mutable",
    category: "tag",
    description:
      "Uses a traditional read-write root filesystem where software is installed directly onto the system partition.",
  },
  nas: {
    label: "NAS",
    category: "tag",
    description:
      "Designed for Network Attached Storage servers. Includes a web-based management UI and storage-management tools.",
  },
  netbooks: {
    label: "Netbooks",
    category: "tag",
    description:
      "Optimised for small, low-powered laptops and netbooks with limited RAM and slow CPUs.",
  },
  "old-computers": {
    label: "Old computers",
    category: "tag",
    description:
      "Runs well on legacy or low-specification hardware that struggles with modern mainstream distributions.",
  },
  privacy: {
    label: "Privacy",
    category: "tag",
    description:
      "Focuses on anonymity and privacy. May route traffic through Tor, disable telemetry, or strip tracking components by default.",
  },
  "raspberry-pi": {
    label: "Raspberry Pi",
    category: "tag",
    description:
      "Officially supports or is specifically optimised for the Raspberry Pi family of single-board computers.",
  },
  security: {
    label: "Security",
    category: "tag",
    description:
      "Bundles penetration-testing, vulnerability-assessment, and security-hardening tools aimed at security professionals and researchers.",
  },
  server: {
    label: "Server",
    category: "tag",
    description:
      "Optimised for headless server deployments. Focuses on stability, long-term support, and reliable service management.",
  },
  "source-based": {
    label: "Source-based",
    category: "tag",
    description:
      "Software is compiled from source code on the user's machine rather than installed from pre-built binary packages, allowing fine-grained optimisation.",
  },
  specialist: {
    label: "Specialist",
    category: "tag",
    description:
      "Built for a highly specific niche or purpose that does not fit standard desktop, server, or security categories.",
  },
  telephony: {
    label: "Telephony",
    category: "tag",
    description:
      "Designed for telephony infrastructure such as VoIP gateways, PBX systems, or call-centre platforms.",
  },
  "age-declaration-(passive)": {
    label: "Age declaration (passive)",
    category: "tag",
    description: "The distribution passively declares its age or maturity status in metadata.",
  },

  // ── Init systems ────────────────────────────────────────────────────────────
  systemd: {
    label: "systemd",
    category: "init-system",
    description:
      "The dominant init system and service manager on modern Linux. Boots the system, starts services in parallel using unit files, and provides logging (journald), network management, and session handling. Used by most mainstream distros.",
  },
  openrc: {
    label: "OpenRC",
    category: "init-system",
    description:
      "A dependency-based init system that uses plain shell scripts. Lightweight, fast, and does not require systemd. Common on Gentoo and Alpine. Can run alongside different process supervisors.",
  },
  runit: {
    label: "runit",
    category: "init-system",
    description:
      "A minimalist init system and service supervisor with a three-stage boot. Each service is a directory with a run script. Popular in Void Linux for its speed and simplicity.",
  },
  s6: {
    label: "s6",
    category: "init-system",
    description:
      "A small, correct UNIX init and process supervision suite by Laurent Bercot. Designed around the principle that a supervisor should never die. Often paired with s6-rc for service dependencies.",
  },
  dinit: {
    label: "dinit",
    category: "init-system",
    description:
      "A modern, dependency-aware service manager and init system written in C++. Supports parallel startup, service dependencies, and on-demand activation — without the complexity of systemd.",
  },
  sysvinit: {
    label: "SysV init",
    category: "init-system",
    description:
      "The traditional UNIX System V init. Services are controlled by numbered runlevel scripts in /etc/rc.d/. Simple but sequential — largely replaced by systemd and OpenRC on modern distros.",
  },
  busybox: {
    label: "BusyBox",
    category: "init-system",
    description:
      "A single binary that bundles dozens of standard UNIX utilities. Used as both an init replacement and a full userland in embedded and minimal Linux systems like Alpine.",
  },

  // ── Package managers ─────────────────────────────────────────────────────────
  apt: {
    label: "APT / deb",
    category: "package-manager",
    description:
      "The Advanced Package Tool used on Debian, Ubuntu, and derivatives. Installs pre-compiled .deb binary packages, resolves dependencies automatically, and pulls from online repositories.",
  },
  pacman: {
    label: "pacman",
    category: "package-manager",
    description:
      "Arch Linux's package manager. Fast, simple, and uses a compressed tarball format (.pkg.tar.zst). The AUR (Arch User Repository) extends it with thousands of community-maintained packages.",
  },
  dnf: {
    label: "DNF / rpm",
    category: "package-manager",
    description:
      "Dandified YUM — the package manager for Fedora, RHEL, and their derivatives. Installs .rpm packages, handles complex dependency graphs, and supports modules and streams.",
  },
  portage: {
    label: "portage",
    category: "package-manager",
    description:
      "Gentoo's source-based package manager. Every package is compiled on the user's machine with custom USE flags that toggle features at build time. Maximally flexible, but slow to install.",
  },
  flatpak: {
    label: "Flatpak",
    category: "package-manager",
    description:
      "A distribution-agnostic application sandboxing and delivery system. Apps are bundled with their dependencies and run in an isolated environment, separate from the host OS libraries.",
  },
  snap: {
    label: "Snap",
    category: "package-manager",
    description:
      "Canonical's containerised package format. Snaps bundle their dependencies and auto-update in the background. Primarily used on Ubuntu; criticised for slower startup times compared to native packages.",
  },
  nix: {
    label: "Nix / nixpkg",
    category: "package-manager",
    description:
      "A purely functional package manager where every package is identified by a cryptographic hash of its inputs. Enables reproducible environments, atomic upgrades, and multiple versions of the same package side-by-side.",
  },
  xbps: {
    label: "XBPS",
    category: "package-manager",
    description:
      "The X Binary Package System, used exclusively by Void Linux. Fast C implementation with source and binary packages. Handles cyclic dependencies and allows partial upgrades.",
  },
  apk: {
    label: "APK",
    category: "package-manager",
    description:
      "Alpine Package Keeper — the tiny, fast package manager used by Alpine Linux. Designed for minimal footprint and container use; packages are simple tarballs with a dependency manifest.",
  },
  zypper: {
    label: "zypper / rpm",
    category: "package-manager",
    description:
      "The command-line interface to the ZYpp package manager used by openSUSE and SUSE Linux Enterprise. Handles RPM packages with a powerful dependency solver and patch management.",
  },
  eopkg: {
    label: "eopkg",
    category: "package-manager",
    description:
      "The package manager used by Solus, forked from PiSi. Installs binary .eopkg packages and supports source builds. Replaced by eopkg3 in modern Solus versions.",
  },

  // ── Display servers & compositors ───────────────────────────────────────────
  wayland: {
    label: "Wayland",
    category: "display-server",
    description:
      "A modern display server protocol that replaces X11. Each application renders directly into its own buffer; the compositor handles window management and screen compositing. Offers better security, smoother animations, and native HiDPI support.",
  },
  x11: {
    label: "X11 / Xorg",
    category: "display-server",
    description:
      "The original Linux display server protocol, in use since the 1980s. A central X server mediates all drawing and input. Mature and compatible with almost all software, but architecturally dated compared to Wayland.",
  },
  hyprland: {
    label: "Hyprland",
    category: "display-server",
    description:
      "A dynamic tiling Wayland compositor focused on aesthetics and smooth animations. Configured via a custom scripting language. Popular in the r/unixporn community for its visual customisability.",
  },
  sway: {
    label: "Sway",
    category: "display-server",
    description:
      "A tiling Wayland compositor that is a drop-in replacement for the i3 window manager. Uses the same configuration syntax as i3 and is widely regarded as one of the most stable Wayland compositors.",
  },
  wayfire: {
    label: "Wayfire",
    category: "display-server",
    description:
      "A 3D Wayland compositor with a plugin-based architecture. Allows eye-candy effects (cube desktop, wobbly windows) while remaining lightweight.",
  },
  labwc: {
    label: "labwc",
    category: "display-server",
    description:
      "A Wayland compositor based on wlroots that aims to be a lightweight replacement for Openbox. Uses the OpenBox XML configuration format.",
  },

  // ── Desktop environments ─────────────────────────────────────────────────────
  gnome: {
    label: "GNOME",
    category: "desktop-environment",
    description:
      "A full-featured desktop environment focused on simplicity and accessibility. Uses GTK. Ships a modern, touch-friendly shell with Activities overview, GNOME Shell extensions, and tight Wayland integration. Default on Fedora and Ubuntu.",
  },
  kde: {
    label: "KDE Plasma",
    category: "desktop-environment",
    description:
      "A highly customisable desktop environment built on Qt. Offers a traditional taskbar layout, a powerful settings system (System Settings), and KDE applications (Dolphin, Konsole, Kate). Excellent Wayland support since Plasma 6.",
  },
  xfce: {
    label: "Xfce",
    category: "desktop-environment",
    description:
      "A lightweight, modular desktop environment that prioritises speed and low resource usage. Uses GTK. Ideal for older hardware or users who want a traditional desktop without heavy dependencies.",
  },
  mate: {
    label: "MATE",
    category: "desktop-environment",
    description:
      "A fork of the GNOME 2 desktop, preserving the classic two-panel layout. Lightweight and familiar to users who prefer a traditional Linux desktop experience.",
  },
  cinnamon: {
    label: "Cinnamon",
    category: "desktop-environment",
    description:
      "Linux Mint's desktop environment, forked from GNOME 3. Provides a traditional taskbar and Start-menu layout using GTK and Muffin as the window manager. Easy to use for Windows converts.",
  },
  lxqt: {
    label: "LXQt",
    category: "desktop-environment",
    description:
      "A lightweight desktop environment built on Qt (successor to LXDE). Minimal resource usage, modular design, and a clean traditional layout. Popular on older hardware and live systems.",
  },
  budgie: {
    label: "Budgie",
    category: "desktop-environment",
    description:
      "A modern desktop environment originally developed for Solus. Clean, minimal look built on GTK and GNOME Stack. Features a Raven sidebar for notifications and settings.",
  },
  cosmic: {
    label: "COSMIC",
    category: "desktop-environment",
    description:
      "System76's new desktop environment written entirely in Rust using the iced GUI toolkit. Designed for tiling and floating workflows, strong Wayland support, and a cohesive settings experience.",
  },
  pantheon: {
    label: "Pantheon",
    category: "desktop-environment",
    description:
      "elementary OS's desktop environment. macOS-inspired layout with a dock and top panel. Built on GTK, emphasises consistent design guidelines through the HIG (Human Interface Guidelines).",
  },

  // ── Release models ───────────────────────────────────────────────────────────
  rolling: {
    label: "Rolling release",
    category: "release-model",
    description:
      "Software is updated continuously as new versions are published — there are no discrete version numbers to upgrade between. Users always run the latest packages. Examples: Arch Linux, Gentoo, openSUSE Tumbleweed.",
  },
  fixed: {
    label: "Fixed release",
    category: "release-model",
    description:
      "The distribution ships as versioned snapshots (e.g. Ubuntu 24.04). Packages are frozen at release and receive security backports rather than version bumps. Prioritises stability over cutting-edge software.",
  },
  "semi-rolling": {
    label: "Semi-rolling release",
    category: "release-model",
    description:
      "A hybrid model: the base system and core libraries follow a fixed release cycle for stability, while user-facing applications update continuously. Examples: openSUSE Slowroll, Manjaro.",
  },
};

// Build a label-key index once at module load for fast lookup
const _labelIndex = new Map<string, string>();
for (const [key, entry] of Object.entries(GLOSSARY)) {
  _labelIndex.set(entry.label.toLowerCase(), key);
}

/**
 * Given any display string (a glossary key, a label, or a label prefix like "SysV" for "SysV init"),
 * returns the matching glossary key or undefined.
 */
export function findGlossaryKey(text: string): string | undefined {
  const norm = text.trim().toLowerCase();
  if (!norm) return undefined;
  if (GLOSSARY[norm]) return norm;
  const byLabel = _labelIndex.get(norm);
  if (byLabel) return byLabel;

  for (const [label, key] of _labelIndex) {
    if (label.startsWith(norm + " ") || label.startsWith(norm + "/")) return key;
  }
  return undefined;
}

export function getAllGlossaryEntries(): Array<GlossaryEntry & { tag: string }> {
  return Object.entries(GLOSSARY)
    .map(([tag, entry]) => ({ tag, ...entry }))
    .sort((a, b) => a.label.localeCompare(b.label));
}

export function getGlossaryEntriesByCategory(): Array<{
  category: GlossaryCategory;
  categoryLabel: string;
  entries: Array<GlossaryEntry & { tag: string }>;
}> {
  const order: GlossaryCategory[] = [
    "tag",
    "init-system",
    "package-manager",
    "display-server",
    "desktop-environment",
    "release-model",
  ];
  const map = new Map<GlossaryCategory, Array<GlossaryEntry & { tag: string }>>(
    order.map((c) => [c, []])
  );
  for (const [tag, entry] of Object.entries(GLOSSARY)) {
    map.get(entry.category)?.push({ tag, ...entry });
  }
  return order.map((category) => ({
    category,
    categoryLabel: CATEGORY_LABELS[category],
    entries: (map.get(category) ?? []).sort((a, b) => a.label.localeCompare(b.label)),
  }));
}
