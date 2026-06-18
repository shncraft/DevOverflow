import { techMap } from "@/constants/tech-map";
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
