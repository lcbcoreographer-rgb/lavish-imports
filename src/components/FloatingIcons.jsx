import React, { useMemo } from "react";

function seededRandom(seed) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

export default function FloatingIcons({ icons, count = 8, seed = 1, className = "" }) {
  const items = useMemo(() => {
    const rand = seededRandom(seed);
    return Array.from({ length: count }, (_, i) => {
      const icon = icons[i % icons.length];
      return {
        icon,
        top: `${Math.round(rand() * 88)}%`,
        left: `${Math.round(rand() * 92)}%`,
        size: 18 + Math.round(rand() * 18),
        duration: 5 + rand() * 4,
        delay: rand() * 4,
        rotate: Math.round(rand() * 20 - 10),
      };
    });
  }, [icons, count, seed]);

  return (
    <div
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
      aria-hidden="true"
    >
      {items.map((item, i) => (
        <span
          key={i}
          className="floating-icon absolute select-none opacity-70"
          style={{
            top: item.top,
            left: item.left,
            fontSize: item.size,
            "--duration": `${item.duration}s`,
            "--delay": `${item.delay}s`,
            "--rotate": `${item.rotate}deg`,
          }}
        >
          {item.icon}
        </span>
      ))}
    </div>
  );
}
