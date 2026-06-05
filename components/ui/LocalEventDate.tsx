"use client";

interface Props {
  isoDate: string;
}

export default function LocalEventDate({ isoDate }: Props) {
  const formatted = new Date(isoDate)
    .toLocaleString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })
    .replace(" at ", " · ");

  return <span>{formatted}</span>;
}
