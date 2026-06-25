import { techDescriptionMap, techMap } from "@/constants/tech-map";
import { zodResolver } from "@hookform/resolvers/zod";
import { clsx, type ClassValue } from "clsx";
import { FieldValues, Resolver } from "react-hook-form";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const asZodResolver = <T extends FieldValues>(
  schema: unknown,
): Resolver<T> => {
  return zodResolver(
    schema as Parameters<typeof zodResolver>[0],
  ) as Resolver<T>;
};

export function getDevIconClassName(techName: string) {
  const normalizedTechName = techName.replace(/[ .]g/, "").toLowerCase();

  return techMap[normalizedTechName]
    ? `${techMap[normalizedTechName]} colored`
    : "devicon-devicon-plain";
}

export function getTechDescription(techName: string) {
  const normalizedTechName = techName.replace(/[ .]g/, "").toLowerCase();

  return (
    techDescriptionMap[normalizedTechName] ||
    `${techName} is a technology or tool widely used in software development, providing valuable features and capabilities.`
  );
}

export function getTimeStamp(createdAt: Date) {
  const date = new Date(createdAt);
  const now = new Date();
  const secondsAgo = Math.floor((now.getTime() - date.getTime()) / 1000);

  const units = [
    { label: "year", seconds: 31536000 },
    { label: "month", seconds: 2592000 },
    { label: "week", seconds: 604800 },
    { label: "day", seconds: 86400 },
    { label: "hour", seconds: 3600 },
    { label: "minute", seconds: 60 },
    { label: "second", seconds: 1 },
  ];

  for (const unit of units) {
    const interval = Math.floor(secondsAgo / unit.seconds);
    if (interval >= 1) {
      return `${interval} ${unit.label}${interval > 1 ? "s" : ""} ago`;
    }
  }
}

export function formatNumber(number: number) {
  if (number >= 1000000) {
    return (number / 100000).toFixed(1) + "M";
  } else if (number >= 1000) {
    return (number / 1000).toFixed(1) + "K";
  } else {
    return number.toString();
  }
}
