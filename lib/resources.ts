export type ResourceCategory =
  | "communities"
  | "distro-finders"
  | "documentation"
  | "learning"
  | "news"
  | "tools";

export type Resource = {
  name: string;
  url: string;
  description: string;
  internal?: boolean;
  recommended?: boolean;
};

export type ResourceGroup = {
  category: ResourceCategory;
  categoryLabel: string;
  entries: Resource[];
};

export const RESOURCES: Record<ResourceCategory, { label: string; entries: Resource[] }> = {
  "distro-finders": {
    label: "Distro Finders & Choosers",
    entries: [
      {
        name: "DistroDB Wizard",
        url: "/wizard",
        internal: true,
        recommended: true,
        description:
          "Our own interactive distro quiz. Answer six questions about your use case and experience level to get a personalized recommendation.",
      },
      {
        name: "Distrochooser",
        url: "https://distrochooser.de",
        description:
          "An interactive quiz that asks about your needs and recommends a matching Linux distribution. Available in multiple languages.",
      },
      {
        name: "DistroFinder",
        url: "https://distro-finder.com",
        description:
          "A streamlined distro recommendation tool that filters distributions based on experience level, use case, and desktop preference.",
      },
      {
        name: "ChooseDistro",
        recommended: true,
        url: "https://choosedistro.com/distro-finder",
        description:
          "A guided distro picker with curated recommendations based on your priorities and technical background.",
      },
    ],
  },
  communities: {
    label: "Communities",
    entries: [
      {
        name: "r/linux",
        url: "https://www.reddit.com/r/linux",
        description:
          "The main Linux subreddit. News, discussions, and general Linux topics from a broad community.",
      },
      {
        name: "r/linux4noobs",
        url: "https://www.reddit.com/r/linux4noobs",
        recommended: true,
        description:
          "A friendly subreddit for Linux beginners. Ask questions, get help, and learn from experienced users.",
      },
      {
        name: "r/archlinux",
        url: "https://www.reddit.com/r/archlinux",
        description:
          "The Arch Linux community on Reddit. Tips, configurations, and discussions for Arch users.",
      },
      {
        name: "r/unixporn",
        url: "https://www.reddit.com/r/unixporn",
        description:
          "Showcase your desktop setups. The go-to place for Linux rice, dotfiles, and visual customization inspiration. (We love to check this time to time ❤️)",
      },
      {
        name: "r/linuxquestions",
        url: "https://www.reddit.com/r/linuxquestions",
        description:
          "A helpful community for getting answers to Linux questions of any skill level.",
      },
    ],
  },
  documentation: {
    label: "Documentation & Wikis",
    entries: [
      {
        name: "Arch Wiki",
        url: "https://wiki.archlinux.org",
        recommended: true,
        description:
          "Arguably the best Linux documentation on the internet. Useful even if you don't run Arch.",
      },
      {
        name: "Ubuntu Documentation",
        url: "https://help.ubuntu.com",
        description:
          "Official Ubuntu help portal covering installation, configuration, and common tasks.",
      },
      {
        name: "Debian Wiki",
        url: "https://wiki.debian.org",
        description:
          "Comprehensive wiki for Debian users covering packages, configuration, and server setup.",
      },
      {
        name: "Gentoo Wiki",
        url: "https://wiki.gentoo.org",
        description:
          "In-depth documentation for Gentoo Linux, with guides applicable to many advanced topics.",
      },
      {
        name: "Linux man pages",
        url: "https://man7.org/linux/man-pages",
        description:
          "The official Linux manual pages online. Reference for every command, syscall, and library function.",
      },
    ],
  },
  learning: {
    label: "Learning",
    entries: [
      {
        name: "Linux Journey",
        url: "https://linuxjourney.com",
        recommended: true,
        description:
          "A free, self-paced learning site covering Linux fundamentals, shell scripting, networking, and more.",
      },
      {
        name: "The Linux Command Line",
        url: "https://linuxcommand.org/tlcl.php",
        description:
          "A free book by William Shotts. The definitive guide to the bash shell and command-line tools.",
      },
      {
        name: "Linux Foundation Training",
        url: "https://training.linuxfoundation.org",
        description:
          "Free and paid courses from the Linux Foundation, including the path to LFCS/LFCE certifications.",
      },
      {
        name: "OverTheWire: Bandit",
        url: "https://overthewire.org/wargames/bandit",
        description:
          "A beginner-friendly wargame that teaches Linux command-line skills through security challenges.",
      },
    ],
  },
  news: {
    label: "News & Blogs",
    entries: [
      {
        name: "Phoronix",
        url: "https://www.phoronix.com",
        description:
          "In-depth Linux hardware and software benchmarks, kernel news, and open-source development coverage.",
      },
      {
        name: "It's FOSS",
        url: "https://itsfoss.com",
        recommended: true,
        description:
          "Beginner-friendly Linux news, tutorials, and distro reviews. A great starting point for newcomers.",
      },
      {
        name: "OMG! Ubuntu",
        url: "https://www.omgubuntu.co.uk",
        description:
          "News, tips, and app coverage focused on Ubuntu and its derivatives.",
      },
      {
        name: "LWN.net",
        url: "https://lwn.net",
        description:
          "Deep technical coverage of the Linux kernel, security advisories, and open-source ecosystem news.",
      },
      {
        name: "DistroWatch",
        url: "https://distrowatch.com",
        description:
          "The original Linux distro tracker. News, package listings, and popularity rankings for hundreds of distros.",
      },
    ],
  },
  tools: {
    label: "Tools & Utilities",
    entries: [
      {
        name: "Ventoy",
        url: "https://www.ventoy.net",
        recommended: true,
        description:
          "Create a multi-boot USB drive by copying ISO files onto it. No re-flashing needed between distros.",
      },
      {
        name: "Balena Etcher",
        url: "https://etcher.balena.io",
        description:
          "A simple, cross-platform tool for flashing OS images to USB drives and SD cards.",
      },
      {
        name: "GParted",
        url: "https://gparted.org",
        description:
          "A powerful GUI partition editor for creating, resizing, and managing disk partitions.",
      },
      {
        name: "Repology",
        url: "https://repology.org",
        description:
          "Compare package versions across hundreds of Linux repositories and package managers at once.",
      },
    ],
  },
};

export function getResourcesByCategory(): ResourceGroup[] {
  return (Object.entries(RESOURCES) as [ResourceCategory, { label: string; entries: Resource[] }][]).map(
    ([category, { label, entries }]) => ({
      category,
      categoryLabel: label,
      entries,
    }),
  );
}
