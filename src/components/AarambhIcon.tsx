import { cn } from "@/lib/utils";

export default function AarambhIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={cn("w-8 h-8", className)}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="50" cy="50" r="48" fill="hsl(var(--primary) / 0.1)" />
      <path
        d="M25 75 A 40 40 0 0 1 75 75"
        stroke="hsl(var(--primary) / 0.3)"
        strokeWidth="8"
        strokeLinecap="round"
      />
      <path
        d="M35 65 A 30 30 0 0 1 65 65"
        stroke="hsl(var(--primary) / 0.6)"
        strokeWidth="8"
        strokeLinecap="round"
      />
      <path
        d="M45 55 A 20 20 0 0 1 55 55"
        stroke="hsl(var(--primary))"
        strokeWidth="8"
        strokeLinecap="round"
      />
    </svg>
  );
}
