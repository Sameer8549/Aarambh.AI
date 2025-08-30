import { cn } from "@/lib/utils";

export default function AarambhIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={cn("w-8 h-8", className)}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Outer Circle/Sun */}
      <circle cx="50" cy="50" r="45" fill="hsl(var(--primary) / 0.1)" />

      {/* Sprout Stem */}
      <path
        d="M50 80 C 50 80, 40 60, 60 45"
        stroke="hsl(var(--primary))"
        strokeWidth="8"
        strokeLinecap="round"
      />

      {/* Sprout Leaves */}
      <path
        d="M60 45 C 50 30, 70 25, 80 35"
        fill="hsl(var(--primary))"
        stroke="hsl(var(--primary))"
        strokeWidth="5"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      <path
        d="M60 45 C 75 55, 65 65, 50 60"
        fill="hsl(var(--primary) / 0.7)"
        stroke="hsl(var(--primary))"
        strokeWidth="5"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
}
