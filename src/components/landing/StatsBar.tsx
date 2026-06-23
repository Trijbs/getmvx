export function StatsBar() {
  const stats = [
    { value: "∞", label: "Links on free tier" },
    { value: "50+", label: "Customization options" },
    { value: "<200ms", label: "Average load time" },
    { value: "0%", label: "We take no cut" },
  ];

  return (
    <div className="flex flex-wrap justify-center border-y border-[var(--border)] bg-[var(--bg2)]">
      {stats.map((stat, i) => (
        <div
          key={stat.label}
          className="flex-1 border-r border-[var(--border)] px-5 py-7 text-center last:border-r-0 max-md:border-r-0 max-md:border-b max-md:border-[var(--border)] max-md:px-4 max-md:py-4"
        >
          <div className="font-[family-name:var(--font-barlow)] text-[36px] font-800 leading-none text-[var(--accent)]">
            {stat.value}
          </div>
          <div className="mt-1 text-[13px] text-[var(--muted)]">
            {stat.label}
          </div>
        </div>
      ))}
    </div>
  );
}
