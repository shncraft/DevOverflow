import TagCard from "@/components/cards/tag-card";
import { Preview } from "@/components/editor/preview";
import { Metric } from "@/components/metric";
import { UserAvatar } from "@/components/user-avatar";
import ROUTES from "@/constants/routes";
import { formatNumber, getTimeStamp } from "@/lib/utils";
import Link from "next/link";

const question = {
  _id: "q123",
  title: "How to improve React app performance?",
  content: `### Question Details

  I'm looking for tips and best practices to enhance the performance of a React application. I have a moderately complex app with multiple components, and I've noticed some performance bottlenecks. What should I focus on?

  ### What I've Tried

  - Lazy loading components
  - Using \`React.memo\` on some components
  - Managing state with the React Context API

  #### Issues

  - The app still lags when rendering large lists.
  - Switching between pages feels sluggish.
  - Sometimes, unnecessary re-renders occur.

  #### Key Areas I Need Help With

  1. Efficiently handling large datasets.
  2. Reducing unnecessary re-renders.
  3. Optimizing state management.

  Here is a snippet of my code that renders a large list. Maybe I'm doing something wrong here:

  \`\`\`js
  import React, { useMemo, useState } from "react";

  const LargeList = ({ items }) => {
    const [filter, setFilter] = useState("");

    const filteredItems = useMemo(() => {
      return items.filter((item) => item.includes(filter));
    }, [items, filter]);

    return (
      <div>
        <input
          type="text"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder="Filter items..."
        />

        <ul>
          {filteredItems.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </div>
    );
  };

  export default LargeList;
  \`\`\`

  ### Questions

  1. Is using \`useMemo\` the right approach here, or is there a better alternative?
  2. Should I implement virtualization for the list? If so, which library would you recommend?
  3. Are there better ways to optimize state updates when dealing with dynamic user input?

  Looking forward to your suggestions and examples!

  **Tags:** React, Performance, State Management
  `,
  createdAt: "2025-01-15T12:34:56.789Z",
  upvotes: 42,
  downvotes: 3,
  views: 1234,
  answers: 5,
  tags: [
    { _id: "tag1", name: "React" },
    { _id: "tag2", name: "Node" },
    { _id: "tag3", name: "PostgreSQL" },
  ],
  author: {
    _id: "u456",
    name: "Jane Doe",
    image: "/avatars/jane-doe.png",
  },
};

export default async function QuestionDetails({ params }: RouteParams) {
  const { id } = await params;

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
