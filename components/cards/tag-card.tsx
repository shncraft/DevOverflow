import ROUTES from "@/constants/routes";
import Link from "next/link";
import { Badge } from "../ui/badge";
import { cn, getDevIconClassName, getTechDescription } from "@/lib/utils";
import Image from "next/image";

interface TagCardProps {
  _id: string;
  name: string;
  questions?: number;
  showCount?: boolean;
  compact?: boolean;
  remove?: boolean;
  isButton?: boolean;
  handleRemove?: () => void;
}

export default function TagCard({
  _id,
  name,
  questions,
  showCount,
  compact,
  remove,
  isButton,
  handleRemove,
}: TagCardProps) {
  const iconClassName = getDevIconClassName(name);
  const techDescription = getTechDescription(name);

  const content = (
    <>
      <Badge className="subtle-medium background-light800_dark300 text-light400_light500 rounded-md border-none px-4 py-3 uppercase flex flex-row gap-2">
        <div className="flex-center space-x-2">
          <i className={`${iconClassName} text-sm`}></i>
          <span>{name}</span>
        </div>

        {remove && (
          <Image
            src="/icons/close.svg"
            alt="close"
            height={12}
            width={12}
            className="cursor-pointer object-contain invert-0 dark:invert"
            onClick={handleRemove}
          />
        )}
      </Badge>
      {showCount && (
        <p className="small-medium text-dark500_light700">{questions}</p>
      )}
    </>
  );

  if (compact) {
    return isButton ? (
      <button type="button" className="flex justify-between gap-2">
        {content}
      </button>
    ) : (
      <Link href={ROUTES.TAG(_id)} className="flex justify-between gap-2">
        {content}
      </Link>
    );
  }

  return (
    <Link href={ROUTES.TAG(_id)}>
      <article className="background-light900_dark200 light-border flex flex-col w-full rounded-2xl border px-8 py-10 sm:w-65">
        <div className="flex items-center justify-between gap-3">
          <div className="background-light800_dark400 w-fit rounded-sm px-5 py-1.5">
            <p className="paragraph-semibold text-dark300_light900">{name}</p>
          </div>
          <i className={cn(iconClassName, "text-2xl")} aria-hidden="true" />
        </div>

        <p className="small-regular text-dark500_light700 mt-5 line-clamp-3 w-full hover:line-clamp-none">
          {techDescription}
        </p>

        <p className="small-medium text-dark400_light500 mt-3.5">
          <span className="body-semibold primary-text-gradient mr-2.5">
            {questions}+
          </span>
          Questions
        </p>
      </article>
    </Link>
  );
}
