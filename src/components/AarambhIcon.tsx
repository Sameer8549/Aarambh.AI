import { cn } from "@/lib/utils";

export default function AarambhIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={cn("w-8 h-8", className)}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="metal-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: "#B0C4DE", stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: "#4682B4", stopOpacity: 1 }} />
        </linearGradient>
        <linearGradient id="glow-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: "#00BFFF", stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: "#87CEFA", stopOpacity: 1 }} />
        </linearGradient>
        <filter id="neon-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <style>
          {`
            .a-path {
              stroke: url(#metal-gradient);
              stroke-width: 8;
              fill: none;
              stroke-linecap: round;
              stroke-linejoin: round;
            }
            .node {
              fill: url(#glow-gradient);
              filter: url(#neon-glow);
            }
            .circuit-line {
              stroke: url(#glow-gradient);
              stroke-width: 1.5;
              fill: none;
              stroke-linecap: round;
              opacity: 0.8;
              filter: url(#neon-glow);
            }
          `}
        </style>
      </defs>

      {/* Main 'A' Structure */}
      <path className="a-path" d="M25 85 L50 15 L75 85" />
      <path className="a-path" d="M35 60 H65" />

      {/* AI Neural Network/Circuit Elements */}
      <g>
        {/* Lines */}
        <path className="circuit-line" d="M50 25 V 40" />
        <path className="circuit-line" d="M42 50 L38 60" />
        <path className="circuit-line" d="M58 50 L62 60" />
        <path className="circuit-line" d="M50 75 L50 85" />
        <path className="circuit-line" d="M30 72 L45 65" />

        {/* Nodes */}
        <circle className="node" cx="50" cy="25" r="4" />
        <circle className="node" cx="50" cy="40" r="3" />
        <circle className="node" cx="42" cy="50" r="3" />
        <circle className="node" cx="58" cy="50" r="3" />
        <circle className="node" cx="38" cy="60" r="3" />
        <circle className="node" cx="62" cy="60" r="3" />
        <circle className="node" cx="50" cy="75" r="4" />
        <circle className="node" cx="30" cy="72" r="3" />
         <circle className="node" cx="45" cy="65" r="2" />
      </g>
    </svg>
  );
}