interface ScoreCardProps {
  score: number;
  bonus: boolean;
}

export function ScoreCard({ score, bonus }: ScoreCardProps) {
  return (
    <div style={{ background: "hsl(var(--muted))", borderRadius: 10, padding: "10px 14px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
      <span style={{ fontSize: 12, color: "var(--muted-foreground)" }}>Score de pertinence</span>
      <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ display: "inline-flex", gap: 5 }}>
          {[1, 2, 3].map((n) => (
            <span
              key={n}
              style={{
                width: 7, height: 7, borderRadius: "50%",
                background: n <= score ? "#E07040" : "#E5DDD6",
                display: "inline-block",
              }}
            />
          ))}
          {bonus && (
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#3B82F6", display: "inline-block", marginLeft: 2 }} />
          )}
        </span>
        <span style={{ fontSize: 12, fontWeight: 600 }}>{score}/3</span>
      </span>
    </div>
  );
}