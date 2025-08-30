import { cn } from "@/lib/utils";

export default function AarambhIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 200"
      className={cn("w-8 h-8", className)}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <radialGradient
          id="glow-gradient"
          cx="50%"
          cy="50%"
          r="50%"
          fx="50%"
          fy="50%"
        >
          <stop offset="0%" stopColor="#8A2BE2" stopOpacity="0.8" />
          <stop offset="50%" stopColor="#4169E1" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#FF8C00" stopOpacity="0.3" />
        </radialGradient>
        <linearGradient id="path-gradient-blue-purple" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#4169E1" />
          <stop offset="100%" stopColor="#8A2BE2" />
        </linearGradient>
        <linearGradient id="path-gradient-orange" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#FF8C00" />
          <stop offset="100%" stopColor="#FFD700" />
        </linearGradient>

        <filter id="glow-effect" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="6" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
         <filter id="inner-shadow" x="-50%" y="-50%" width="200%" height="200%">
          <feComponentTransfer in="SourceAlpha">
            <feFuncA type="table" tableValues="1 0" />
          </feComponentTransfer>
          <feGaussianBlur stdDeviation="2" />
          <feOffset dx="2" dy="2" result="offsetblur" />
          <feFlood floodColor="black" result="color" />
          <feComposite in="color" in2="offsetblur" operator="in" />
          <feComposite in="SourceGraphic" operator="over" />
        </filter>
      </defs>

      <g filter="url(#glow-effect)">
        {/* Abstract "launch" or "beginning" shape */}
        <path
          d="M 100,20 L 140,120 L 100,100 L 60,120 L 100,20 Z"
          fill="url(#glow-gradient)"
          opacity="0.5"
        />

        {/* Central glowing element */}
        <path
          d="M100 80 Q 120 100 100 120 Q 80 100 100 80 Z"
          fill="white"
          filter="url(#glow-effect)"
        />
        
        {/* Neural network inspired paths */}
        <path
          d="M 50,150 C 70,100, 130,100, 150,150"
          stroke="url(#path-gradient-blue-purple)"
          strokeWidth="4"
          fill="none"
          strokeLinecap="round"
        />
        <path
          d="M 70,50 C 90,70, 110,70, 130,50"
          stroke="url(#path-gradient-blue-purple)"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
        />
         <path
          d="M100,20 Q150,60 140,120"
          stroke="url(#path-gradient-orange)"
          strokeWidth="3.5"
          fill="none"
          strokeLinecap="round"
          opacity="0.8"
        />
         <path
          d="M100,20 Q50,60 60,120"
          stroke="url(#path-gradient-orange)"
          strokeWidth="3.5"
          fill="none"
          strokeLinecap="round"
          opacity="0.8"
        />

        {/* Nodes */}
        <g fill="white">
            <circle cx="100" cy="20" r="6" />
            <circle cx="140" cy="120" r="5" />
            <circle cx="60" cy="120" r="5" />
            <circle cx="50" cy="150" r="4" fill="url(#path-gradient-orange)"/>
            <circle cx="150" cy="150" r="4" fill="url(#path-gradient-orange)"/>
            <circle cx="70" cy="50" r="3" />
            <circle cx="130" cy="50" r="3" />
        </g>
      </g>
    </svg>
  );
}
