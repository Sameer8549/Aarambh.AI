import { cn } from "@/lib/utils";

export default function AarambhIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={cn("w-8 h-8", className)}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M50 30 C 40 40, 40 55, 50 65 C 60 55, 60 40, 50 30 Z"
        stroke="hsl(var(--primary))"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="hsl(var(--primary) / 0.1)"
      />
      <path
        d="M50 70 C 30 70, 25 50, 40 40"
        stroke="hsl(var(--primary) / 0.7)"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M50 70 C 70 70, 75 50, 60 40"
        stroke="hsl(var(--primary) / 0.7)"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
