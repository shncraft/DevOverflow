import TagCard from "@/components/cards/tag-card";
import { Preview } from "@/components/editor/preview";
import { Metric } from "@/components/metric";
import { UserAvatar } from "@/components/user-avatar";
import ROUTES from "@/constants/routes";
import { getQuestionAction } from "@/lib/actions/question.action";
import { formatNumber, getTimeStamp } from "@/lib/utils";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function QuestionDetails({ params }: RouteParams) {
  const { id } = await params;

  const { success, data: question } = await getQuestionAction({
    questionId: id,
  });

  if (!success || !question) return redirect("/404");

  const {
    author,
    _id,
    answers,
    content,
    createdAt,
    downvotes,
    tags,
    title,
    upvotes,
    views,
  } = question;

  return (
    <>
      <div className="flex w-full flex-col">
        <div className="flex w-full flex-col-reverse justify-between">
          <div className="flex items-center justify-start gap-1">
            <UserAvatar
              id={author._id}
              name={author.name}
              image={author.image}
              className="size-6"
              fallbackClassName="text-2.5"
            />
            <Link href={ROUTES.PROFILE(author._id)}>
              <p className="paragraph-semibold text-dark300_light700">
                {author.name}
              </p>
            </Link>
          </div>

          <div className="flex justify-end">
            <p>Votes</p>
          </div>
        </div>

        <h2 className="h2-semibold text-dark200_light900 mt-3.5 w-full">
          {title}
        </h2>

        <div className="mb-8 mt-5 flex flex-wrap gap-4">
          <Metric
            imgUrl="/icons/clock.svg"
            alt="clock icon"
            value={` asked ${getTimeStamp(new Date(createdAt))}`}
            title=""
            textStyles="small-regular text-dark400-light700"
          />
          <Metric
            imgUrl="/icons/message.svg"
            alt="message icon"
            value={answers}
            title="Answers"
            textStyles="small-regular text-dark400-light700"
          />
          <Metric
            imgUrl="/icons/eye.svg"
            alt="eye icon"
            value={formatNumber(views)}
            title="Views"
            textStyles="small-regular text-dark400-light700"
          />
        </div>

        <Preview content={content} />

        <div className="mt-8 flex flex-wrap gap-2">
          {tags.map((tag: Tag) => (
            <TagCard key={tag._id} _id={tag._id} name={tag.name} compact />
          ))}
        </div>
      </div>
    </>
  );
}
