"use client";

interface HealthBarProps {
  completed: number;
  total: number;
}

export default function HealthBar({ completed, total }: HealthBarProps) {
  const percentage = total === 0 ? 0 : Math.floor((completed / total) * 100);

  // Mega Man X health bar color: cyan when high, orange mid, red when low
  const barColor =
    percentage > 66 ? "#00e5ff" : percentage > 33 ? "#ff6600" : "#ff3333";

  return (
    <div className="mb-8" data-testid="health-bar">
      {/* Label row */}
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10px] text-mmx-cyan uppercase tracking-wider font-pixel">
          ♦ Mission Progress
        </span>
        <span className="text-[10px] text-mmx-orange font-pixel">
          {completed}/{total}
        </span>
      </div>

      {/* Health bar container */}
      <div className="w-full h-5 bg-mmx-bg border-2 border-mmx-cyan pixel-border relative overflow-hidden">
        {/* Fill bar */}
        <div
          className="h-full transition-all duration-300 ease-out"
          style={{
            width: `${percentage}%`,
            background: barColor,
            boxShadow:
              percentage > 0
                ? "inset 0 -2px 0 rgba(0,0,0,0.3), inset 0 2px 0 rgba(255,255,255,0.2)"
                : "none",
          }}
          data-testid="health-bar-fill"
        />

        {/* Segment dividers — mimics discrete energy blocks from Mega Man X */}
        <div className="absolute inset-0 flex">
          {Array.from({ length: 10 }).map((_, i) => (
            <div
              key={i}
              className="flex-1 border-r border-mmx-bg/60 last:border-r-0"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
