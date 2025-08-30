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
        d="M20 80 L50 20 L80 80 M35 60 L65 60"
        stroke="hsl(var(--primary))"
        strokeWidth="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle 
        cx="50" 
        cy="45" 
        r="8" 
        fill="hsl(var(--primary) / 0.8)" 
      />
    </svg>
  );
}
