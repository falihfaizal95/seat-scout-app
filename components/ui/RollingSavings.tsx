"use client";
import { useState, useEffect } from "react";

export default function RollingSavings() {
  const [display, setDisplay] = useState(47);

  useEffect(() => {
    const interval = setInterval(() => {
      setDisplay((prev) => {
        const bump = Math.floor(Math.random() * 3) + 1;
        const next = prev + bump;
        return next > 200 ? 30 : next;
      });
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <span className="font-syne font-[800]" style={{ fontSize: "inherit" }}>
      ${display}
    </span>
  );
}
