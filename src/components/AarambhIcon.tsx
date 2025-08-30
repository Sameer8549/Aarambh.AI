import { cn } from "@/lib/utils";

export default function AarambhIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={cn("w-8 h-8", className)}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <radialGradient
          id="center-glow"
          cx="50%"
          cy="50%"
          r="50%"
          fx="50%"
          fy="50%"
        >
          <stop offset="0%" style={{ stopColor: "#E0F2FE", stopOpacity: 1 }} />
          <stop
            offset="100%"
            style={{ stopColor: "#0EA5E9", stopOpacity: 1 }}
          />
        </radialGradient>
        <linearGradient id="path-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: "#60A5FA" }} />
          <stop offset="100%" style={{ stopColor: "#0284C7" }} />
        </linearGradient>
        <filter id="neon-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3.5" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <style>
          {`
            .core-node {
              fill: url(#center-glow);
              filter: url(#neon-glow);
            }
            .neural-path {
              stroke: url(#path-gradient);
              stroke-width: 5;
              fill: none;
              stroke-linecap: round;
              stroke-linejoin: round;
            }
             .path-endpoint {
              fill: #E0F2FE;
            }
          `}
        </style>
      </defs>

      {/* Main Neural Network Structure */}
      <g>
        {/* Central Core */}
        <circle className="core-node" cx="50" cy="50" r="12" />

        {/* Outgoing Pathways */}
        <path className="neural-path" d="M50 38 V 20" />
        <path className="neural-path" d="M39 43 L 25 35" />
        <path className="neural-path" d="M36 55 L 20 60" />
        <path className="neural-path" d="M43 61 L 35 75" />
        <path className="neural-path" d="M57 61 L 65 75" />
        <path className="neural-path" d="M64 55 L 80 60" />
        <path className="neural-path" d="M61 43 L 75 35" />

        {/* Endpoints/Nodes */}
        <circle className="path-endpoint" cx="50" cy="18" r="4" />
        <circle className="path-endpoint" cx="23" cy="33" r="4" />
        <circle className="path-endpoint" cx="18" cy="62" r="4" />
        <circle className="path-endpoint" cx="33" cy="78" r="4" />
        <circle className="path-endpoint" cx="67" cy="78" r="4" />
        <circle className="path-endpoint" cx="82" cy="62" r="4" />
        <circle className="path-endpoint" cx="77" cy="33" r="4" />
      </g>
    </svg>
  );
}
