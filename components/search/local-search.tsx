"use client";

import Image from "next/image";
import { Input } from "../ui/input";
import { cn } from "@/lib/utils";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { formUrlQuery, removeKeysFromQuery } from "@/lib/url";

interface LocalSearchProps {
  route: string;
  imgSrc: string;
  placeholder: string;
  otherClasses?: string;
}

export default function LocalSearch({
  route,
  imgSrc,
  placeholder,
  otherClasses,
}: LocalSearchProps) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.get("query");

  const [searchQuery, setSearchQuery] = useState(query || "");

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      const currentQuery = searchParams.get("query") || "";

      if (currentQuery === searchQuery) {
        return;
      }

      if (searchQuery) {
        const newUrl = formUrlQuery({
          params: searchParams.toString(),
          key: "query",
          value: searchQuery,
        });

        router.push(newUrl, { scroll: false });
      } else {
        if (pathname === route) {
          const newUrl = removeKeysFromQuery({
            params: searchParams.toString(),
            keysToRemove: ["query"],
          });

          router.push(newUrl, { scroll: false });
        }
      }
    }, 1000);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, searchParams, route, router, pathname]);

  return (
    <div
      className={cn(
        "background-light800_darkgradient flex min-h-14 grow items-center gap-4 rounded-[10px] px-4",
        otherClasses,
      )}
    >
      <Image
        src={imgSrc}
        alt="search"
        width={24}
        height={24}
        className="invert-colors cursor-pointer"
      />
      <Input
        type="text"
        placeholder={placeholder}
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="paragraph-regular no-focus placeholder text-dark400_light700 border-none shadow-none outline-none bg-transparent"
      />
    </div>
  );
}
