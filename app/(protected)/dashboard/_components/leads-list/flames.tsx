import { Flame } from "lucide-react";

interface FlamesProps {
  score: number;
  bonus: boolean;
  size?: number;
}

export function Flames({ score, bonus, size = 13 }: FlamesProps) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 2 }}>
      {[1, 2, 3].map((n) => (
        <Flame
          key={n}
          size={size}
          style={{
            fill:  n <= score ? "#E07040" : "#E5DDD6",
            color: n <= score ? "#E07040" : "#E5DDD6",
          }}
        />
      ))}
      {bonus && (
        <Flame size={size} style={{ fill: "#3B82F6", color: "#3B82F6", marginLeft: 4 }} />
      )}
    </span>
  );
}