"use client";
import { useState, useEffect } from "react";

interface Props {
  start: number;
  incrementMin: number;
  incrementMax: number;
  intervalMs?: number;
  prefix?: string;
  suffix?: string;
  formatValue?: (n: number) => string;
}

function defaultFormat(n: number, prefix = "", suffix = ""): string {
  if (n >= 1_000_000) return prefix + (n / 1_000_000).toFixed(1) + "M" + suffix;
  if (n >= 1_000)     return prefix + Math.round(n / 1_000) + "K" + suffix;
  return prefix + n.toLocaleString() + suffix;
}

export default function RollingCounter({
  start,
  incrementMin,
  incrementMax,
  intervalMs = 5000,
  prefix = "",
  suffix = "",
  formatValue,
}: Props) {
  const [value, setValue] = useState(start);

  useEffect(() => {
    const interval = setInterval(() => {
      const inc = Math.floor(Math.random() * (incrementMax - incrementMin + 1)) + incrementMin;
      setValue((prev) => prev + inc);
    }, intervalMs);
    return () => clearInterval(interval);
  }, [incrementMin, incrementMax, intervalMs]);

  return (
    <span>
      {formatValue ? formatValue(value) : defaultFormat(value, prefix, suffix)}
    </span>
  );
}
