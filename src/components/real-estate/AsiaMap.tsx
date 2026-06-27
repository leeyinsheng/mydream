"use client";

import { Card } from "@/components/ui/card";
import type { CountryRealEstate } from "@/lib/real-estate";

interface Props { countries: CountryRealEstate[]; onSelect: (id: string) => void; }

const POSITIONS: Record<string, { x: number; y: number; w: number; h: number; label: string }> = {
  china: { x: 120, y: 50, w: 280, h: 140, label: "中國" },
  taiwan: { x: 415, y: 100, w: 30, h: 25, label: "台灣" },
  "hong-kong": { x: 410, y: 120, w: 18, h: 14, label: "香港" },
  macau: { x: 398, y: 128, w: 14, h: 10, label: "澳門" },
  japan: { x: 450, y: 40, w: 55, h: 130, label: "日本" },
  "south-korea": { x: 435, y: 25, w: 30, h: 50, label: "韓國" },
  malaysia: { x: 280, y: 310, w: 80, h: 60, label: "馬來西亞" },
  singapore: { x: 280, y: 370, w: 20, h: 10, label: "星" },
  vietnam: { x: 310, y: 240, w: 35, h: 90, label: "越南" },
  thailand: { x: 255, y: 260, w: 55, h: 70, label: "泰國" },
  philippines: { x: 360, y: 210, w: 40, h: 80, label: "菲律賓" },
  australia: { x: 30, y: 380, w: 280, h: 80, label: "澳洲" },
};

function color(price: number, max: number, min: number) {
  const t = max === min ? 0.5 : (price - min) / (max - min);
  if (t > 0.75) return "fill-red-500/80";
  if (t > 0.5) return "fill-orange-500/80";
  if (t > 0.25) return "fill-amber-500/80";
  return "fill-green-500/80";
}

export function AsiaMap({ countries, onSelect }: Props) {
  const prices = countries.map((c) => c.capitalPricePerSqm);
  const mx = Math.max(...prices);
  const mn = Math.min(...prices);

  return (
    <Card className="p-4">
      <svg viewBox="0 0 520 500" className="w-full max-w-2xl mx-auto">
        {countries.map((c) => {
          const pos = POSITIONS[c.id];
          if (!pos) return null;
          return (
            <g key={c.id} className="cursor-pointer" onClick={() => onSelect(c.id)}>
              <rect
                x={pos.x} y={pos.y} width={pos.w} height={pos.h} rx={4}
                className={`${color(c.capitalPricePerSqm, mx, mn)} stroke-border hover:stroke-primary transition-all`}
              />
              <text x={pos.x + pos.w / 2} y={pos.y + pos.h / 2 + 4} textAnchor="middle" fill="currentColor" fontSize="10" fontWeight="600">{pos.label}</text>
            </g>
          );
        })}
        {/* legend */}
        <rect x="10" y="470" width="12" height="10" rx="2" className="fill-green-500/80" />
        <text x="25" y="479" fontSize="8" className="fill-muted-foreground">低房價</text>
        <rect x="75" y="470" width="12" height="10" rx="2" className="fill-red-500/80" />
        <text x="90" y="479" fontSize="8" className="fill-muted-foreground">高房價</text>
      </svg>
    </Card>
  );
}
