import ROUTES from "@/constants/routes";
import Link from "next/link";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface UserAvatarProps {
  id: string;
  name: string;
  image?: string | null;
  className?: string;
  fallbackClassName?: string;
}

export function UserAvatar({
  id,
  name,
  image,
  className = "h-9 w-9",
  fallbackClassName,
}: UserAvatarProps) {
  const initials = name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
  return (
    <Link href={ROUTES.PROFILE(id)}>
      <Avatar
        className={cn(
          className,
          "rounded-full border-3 border-primary-500/50 hover:border-primary-500/80 transition-colors duration-200 ease-in-out",
        )}
      >
        {image ? (
          <Image
            src={image}
            alt={name}
            className="object-cover rounded-full"
            width={36}
            height={36}
            quality={100}
          />
        ) : (
          <AvatarFallback
            className={cn(
              fallbackClassName,
              "primary-gradient font-space-grotesk font-bold tracking-wider text-white",
            )}
          >
            {initials}
          </AvatarFallback>
        )}
      </Avatar>
    </Link>
  );
}
