import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

interface MetricProps {
  imgUrl: string;
  alt: string;
  value: string | number;
  href?: string;
  textStyles: string;
  title: string;
  imgStyles?: string;
  isAuthor?: boolean;
  titleStyles?: string;
}

export function Metric({
  imgUrl,
  alt,
  value,
  title,
  href,
  textStyles,
  imgStyles,
  isAuthor,
  titleStyles,
}: MetricProps) {
  const metricContent = (
    <>
      <Image
        src={imgUrl}
        alt={alt}
        width={20}
        height={20}
        className={cn("rounded-full object-contain", imgStyles)}
      />

      <p className={cn("flex items-center gap-1", textStyles)}>
        {value}
        {title ? (
          <span
            className={cn(
              "small-regular line-clamp-1",
              titleStyles,
              isAuthor ? "max-sm:hidden" : "",
            )}
          >
            {title}
          </span>
        ) : null}
      </p>
    </>
  );

  return href ? (
    <Link href={href} className="flex-center gap-1.5">
      {metricContent}
    </Link>
  ) : (
    <div className="flex-center gap-1">{metricContent}</div>
  );
}
