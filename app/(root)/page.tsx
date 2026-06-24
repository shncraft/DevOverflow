import { QuestionCard } from "@/components/cards/question-card";
import { HomeFilter } from "@/components/filters/home-filter";
import LocalSearch from "@/components/search/local-search";
import { Button } from "@/components/ui/button";
import ROUTES from "@/constants/routes";
import Link from "next/link";

const questions = [
  {
    _id: "1",
    title: "How to learn React?",
    content: "I want to learn React. Anyone can help?",
    tags: [
      { _id: "t1", name: "JavaScript" },
      { _id: "t2", name: "React" },
    ],
    author: {
      _id: "u1",
      name: "Shani",
      image:
        "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwww.pngkit.com%2Fpng%2Ffull%2F929-9290220_author-photo.png&f=1&nofb=1&ipt=4c3c0b697e1c96e9a80efe57a3349c5bf7afbb581135fa1323929aa319ae4d1c",
    },
    upvotes: 1200,
    answers: 20,
    views: 100,
    createdAt: new Date("2026-06-19"),
  },
  {
    _id: "2",
    title: "How to learn JavaScript?",
    content: "I want to learn JavaScript. Anyone can help?",
    tags: [
      { _id: "t1", name: "JavaScript" },
      { _id: "t2", name: "ES6" },
    ],
    author: {
      _id: "u2",
      name: "Ravi",
      image:
        "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwww.pngkit.com%2Fpng%2Ffull%2F929-9290220_author-photo.png&f=1&nofb=1&ipt=4c3c0b697e1c96e9a80efe57a3349c5bf7afbb581135fa1323929aa319ae4d1c",
    },
    upvotes: 145,
    answers: 10,
    views: 70,
    createdAt: new Date(),
  },
];

interface SearchParams {
  searchParams: Promise<{ [key: string]: string }>;
}

export default async function Home({ searchParams }: SearchParams) {
  const { query = "", filter = "" } = await searchParams;

  const filteredQuestions = questions.filter((question) => {
    const matchesQuery = question.title
      .toLowerCase()
      .includes(query?.toLowerCase());
    const matchesFilter = filter
      ? question.tags.find(
          (tag) => tag.name.toLowerCase() === filter.toLowerCase(),
        )
      : true;

    return matchesQuery && matchesFilter;
  });

  return (
    <>
      <section className="flex w-full flex-col-reverse sm:flex-row justify-between gap-4 sm:items-center">
        <h1 className="h1-bold text-dark100_light900">All Questions</h1>

        <Button
          className="primary-gradient min-h-11.5 px-4 py-3 text-light-900!"
          asChild
        >
          <Link href={ROUTES.ASK_QUESTION}>Ask a Question</Link>
        </Button>
      </section>
      <section className="mt-11">
        <LocalSearch
          route={ROUTES.HOME}
          imgSrc="/icons/search.svg"
          placeholder="Search Questions..."
          otherClasses="flex-1"
        />
      </section>

      <HomeFilter />

      <div className="mt-10 flex w-full flex-col gap-6">
        {filteredQuestions.map((question) => (
          <QuestionCard key={question._id} question={question} />
        ))}
      </div>
    </>
  );
}
