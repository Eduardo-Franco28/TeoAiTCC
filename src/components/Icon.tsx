const SOLID = {
  search:
    "M10.5 2.5a8 8 0 1 0 0 16a8 8 0 1 0 0-16z M10.5 6a4.5 4.5 0 1 0 0 9a4.5 4.5 0 1 0 0-9z M15.6 17.7l2.1-2.1 3.6 3.6a1.5 1.5 0 0 1-2.1 2.1z",
  chat: "M12 3c5 0 9 3.4 9 7.7s-4 7.7-9 7.7c-.9 0-1.8-.1-2.6-.3L5 20.6c-.6.3-1.2-.2-1.1-.8l.7-3.2C3.6 15.2 3 13.3 3 10.7 3 6.4 7 3 12 3z M7.4 10.7a1.3 1.3 0 1 0 2.6 0a1.3 1.3 0 1 0-2.6 0z M10.7 10.7a1.3 1.3 0 1 0 2.6 0a1.3 1.3 0 1 0-2.6 0z M14 10.7a1.3 1.3 0 1 0 2.6 0a1.3 1.3 0 1 0-2.6 0z",
  grid: "M3 5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z M13 5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2z M3 15a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z M13 15a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2z",
  bag: "M8.2 7V6.2a3.8 3.8 0 0 1 7.6 0V7H18a1.5 1.5 0 0 1 1.5 1.4l.8 11a2 2 0 0 1-2 2.1H5.7a2 2 0 0 1-2-2.1l.8-11A1.5 1.5 0 0 1 6 7z M10 7h4v-.8a2 2 0 0 0-4 0z",
  create:
    "M7 3h10a4 4 0 0 1 4 4v10a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V7a4 4 0 0 1 4-4z M11 7.5h2v3.5h3.5v2H13v3.5h-2V13H7.5v-2H11z",
  star: "M12 2.8l2.7 5.6 6.1.8-4.5 4.2 1.1 6.1L12 16.6l-5.4 2.9 1.1-6.1-4.5-4.2 6.1-.8z",
  bulb: "M12 2.5a6.8 6.8 0 0 1 4 12.3V16a1.5 1.5 0 0 1-1.5 1.5h-5A1.5 1.5 0 0 1 8 16v-1.2A6.8 6.8 0 0 1 12 2.5z M9 19h6v.8a1.7 1.7 0 0 1-1.7 1.7h-2.6A1.7 1.7 0 0 1 9 19.8z",
  info: "M12 2.5a9.5 9.5 0 1 1 0 19a9.5 9.5 0 0 1 0-19z M10.9 10.5h2.2v6.5h-2.2z M12 6.3a1.4 1.4 0 1 0 0 2.8a1.4 1.4 0 1 0 0-2.8z",
  calendar:
    "M7 2.5h1.8v2h6.4v-2H17v2h1a3 3 0 0 1 3 3v11a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3v-11a3 3 0 0 1 3-3h1z M6.5 12h3v3h-3z M10.5 12h3v3h-3z M14.5 12h3v3h-3z",
  sparkle: "M12 3c.7 5 3.9 8.3 9 9-5.1.7-8.3 4-9 9-.7-5-3.9-8.3-9-9 5.1-.7 8.3-4 9-9z",
} as const;

const LINE = {
  chevronRight: "M9 6l6 6-6 6",
  chevronDown: "M6 9l6 6 6-6",
  back: "M15 6l-6 6 6 6",
  send: "M12 19V5M6 11l6-6 6 6",
  plus: "M12 5v14M5 12h14",
  check: "M5 12.5l4.5 4.5L19 7.5",
  newChat:
    "M12 4.5H6.5a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2V12 M17.6 3.6a2.1 2.1 0 0 1 3 3L13 14.2l-4 1 1-4z",
  menu: "M4 7h16M4 12h16M4 17h16",
  close: "M6 6l12 12M18 6L6 18",
} as const;

export type IconName = keyof typeof SOLID | keyof typeof LINE;

interface IconProps {
  name: IconName;
  className?: string;
}

export default function Icon({ name, className }: IconProps) {
  const solid = name in SOLID;
  const path = solid ? SOLID[name as keyof typeof SOLID] : LINE[name as keyof typeof LINE];
  const classes = ["icon", solid ? "icon-solid" : "icon-line", className].filter(Boolean).join(" ");

  return (
    <svg viewBox="0 0 24 24" className={classes} aria-hidden="true" focusable="false">
      <path d={path} />
    </svg>
  );
}
