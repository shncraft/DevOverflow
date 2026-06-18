import ROUTES from "@/constants/routes";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

export function AppLogo({ TextClassName }: { TextClassName?: string }) {
  return (
    <Link href={ROUTES.HOME} className="flex items-center gap-1">
      <Image
        src="/images/site-logo.svg"
        width={23}
        height={23}
        alt="DevFlow Logo"
      />

      <p
        className={cn(
          "h2-bold font-space-grotesk text-dark-100 dark:text-light-900",
          TextClassName,
        )}
      >
        Dev<span className="text-primary-500">Flow</span>
      </p>
    </Link>
  );
}
