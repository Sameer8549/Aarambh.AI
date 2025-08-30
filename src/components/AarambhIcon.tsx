import { cn } from "@/lib/utils";

export default function AarambhIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={cn("w-8 h-8", className)}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
        <path d="M50 55C45 55 40 60 40 65C40 75 45 85 50 85C55 85 60 75 60 65C60 60 55 55 50 55Z"  stroke="hsl(var(--primary))" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M50 55V35" stroke="hsl(var(--primary))" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M35 35C25 35 25 20 35 20" stroke="hsl(var(--primary))" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M65 35C75 35 75 20 65 20" stroke="hsl(var(--primary))" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M50 35C45 35 40 20 50 15" stroke="hsl(var(--primary))" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}