import { cn } from "@/lib/utils";

export default function AarambhIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={cn("w-8 h-8", className)}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Gradients for the metallic and glowing effects */}
        <radialGradient id="coreGlow" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
          <stop offset="0%" style={{ stopColor: "#E0F7FA", stopOpacity: 1 }} />
          <stop offset="60%" style={{ stopColor: "#00E5FF", stopOpacity: 0.8 }} />
          <stop offset="100%" style={{ stopColor: "#01579B", stopOpacity: 0.5 }} />
        </radialGradient>

        <linearGradient id="path-gradient-blue" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: "#81D4FA" }} />
          <stop offset="100%" style={{ stopColor: "#00E5FF" }} />
        </linearGradient>

        <linearGradient id="path-gradient-silver" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: "#B0BEC5" }} />
          <stop offset="100%" style={{ stopColor: "#ECEFF1" }} />
        </linearGradient>

        {/* Filters for the neon glow effect */}
        <filter id="neon-glow-effect" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="2" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
        <filter id="core-pulse-effect" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
        </filter>
      </defs>

      {/* Main Group for the Logo */}
      <g>
        {/* Outermost faint glow */}
        <circle cx="50" cy="50" r="48" fill="url(#coreGlow)" opacity="0.1" />

        {/* Background neural pathways (silver/gray) */}
        <g opacity="0.7">
            <path d="M 20,50 A 30,30 0 0,1 80,50" stroke="url(#path-gradient-silver)" strokeWidth="1.5" fill="none" />
            <path d="M 30,25 A 30,30 0 0,1 70,75" stroke="url(#path-gradient-silver)" strokeWidth="1.5" fill="none" />
            <path d="M 30,75 A 30,30 0 0,0 70,25" stroke="url(#path-gradient-silver)" strokeWidth="1.5" fill="none" />
            <path d="M 50,20 A 30,30 0 0,1 50,80" stroke="url(#path-gradient-silver)" strokeWidth="1.5" fill="none" />
        </g>
        
        {/* Central glowing core */}
        <circle cx="50" cy="50" r="12" fill="url(#coreGlow)" filter="url(#core-pulse-effect)" />
        <circle cx="50" cy="50" r="10" fill="#E0F7FA" />

        {/* Foreground neural pathways (bright blue) */}
        <g filter="url(#neon-glow-effect)" opacity="0.9">
            <path d="M 50,50 m -15,0 a 15,15 0 1,0 30,0 a 15,15 0 1,0 -30,0" stroke="url(#path-gradient-blue)" strokeWidth="2.5" fill="none"/>
            <path d="M 50,50 m -25,0 a 25,25 0 1,1 50,0 a 25,25 0 1,1 -50,0" stroke="url(#path-gradient-blue)" strokeWidth="2" fill="none" opacity="0.6"/>
            <path d="M 50,50 m 0,-35 a 35,35 0 1,1 0,70 a 35,35 0 1,1 0,-70" stroke="url(#path-gradient-blue)" strokeWidth="2.5" fill="none"/>
        </g>

        {/* Nodes/endpoints */}
        <g fill="#E0F7FA">
            <circle cx="50" cy="15" r="3.5" />
            <circle cx="50" cy="85" r="3.5" />
            <circle cx="15" cy="50" r="3.5" />
            <circle cx="85" cy="50" r="3.5" />

            <circle cx="32" cy="25" r="2.5" opacity="0.8" />
            <circle cx="68" cy="25" r="2.5" opacity="0.8" />
            <circle cx="32" cy="75" r="2.5" opacity="0.8" />
            <circle cx="68" cy="75" r="2.5" opacity="0.8" />
        </g>
      </g>
    </svg>
  );
}
