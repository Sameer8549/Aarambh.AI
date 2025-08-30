import { cn } from "@/lib/utils";

export default function AarambhIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={cn("w-8 h-8", className)}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
        <path d="M25,85 C20,70 20,50 30,30 C35,20 40,15 50,15 C60,15 65,20 70,30 C80,50 80,70 75,85" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M50,15 Q40,5 30,10" stroke="hsl(var(--secondary))" fill="none" strokeWidth="8" strokeLinecap="round"/>
        <path d="M50,15 Q60,5 70,10" stroke="hsl(var(--secondary))" fill="none" strokeWidth="8" strokeLinecap="round"/>

        <circle cx="42" cy="45" r="6" fill="hsl(var(--primary-foreground))" />
        <circle cx="58" cy="45" r="6" fill="hsl(var(--primary-foreground))" />

        <path d="M40 60 Q50 75 60 60" stroke="hsl(var(--primary-foreground))" strokeWidth="5" fill="none" strokeLinecap="round" />
    </svg>
  );
}
