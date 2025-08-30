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
        d="M50 10C27.9086 10 10 27.9086 10 50C10 72.0914 27.9086 90 50 90"
        stroke="hsl(var(--primary))"
        strokeWidth="10"
        strokeLinecap="round"
      />
      <path
        d="M50 90C72.0914 90 90 72.0914 90 50C90 27.9086 72.0914 10 50 10"
        stroke="hsl(var(--secondary))"
        strokeWidth="10"
        strokeLinecap="round"
        strokeDasharray="2 18"
      />
      <circle cx="50" cy="50" r="15" fill="hsl(var(--primary))" />
    </svg>
  );
}
