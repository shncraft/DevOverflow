import { QuestionCard } from "@/components/cards/question-card";
import DataRenderer from "@/components/data-renderer";
import { HomeFilter } from "@/components/filters/home-filter";
import LocalSearch from "@/components/search/local-search";
import ROUTES from "@/constants/routes";
import { EMPTY_QUESTION } from "@/constants/states";
import { getSavedQuestionsAction } from "@/lib/actions/collection.action";

export default async function CollectionsPage({ searchParams }: RouteParams) {
  const { page, pageSize, query, filter, sort } = await searchParams;

  const { success, data, error } = await getSavedQuestionsAction({
    page: Number(page) || 1,
    pageSize: Number(pageSize) || 10,
    query,
    filter,
    sort,
  });

  const { collections } = data || {};

  return (
    <>
      <section className="flex w-full flex-col-reverse sm:flex-row justify-between gap-4 sm:items-center">
        <h1 className="h1-bold text-dark100_light900">All Questions</h1>
      </section>
      <section className="mt-11">
        <LocalSearch
          route={ROUTES.COLLECTION}
          imgSrc="/icons/search.svg"
          placeholder="Search Questions..."
          otherClasses="flex-1"
        />
      </section>

      <HomeFilter />

      <DataRenderer
        success={success}
        error={error}
        data={collections}
        empty={EMPTY_QUESTION}
        render={(collections: Collection[]) => (
          <div className="mt-10 flex w-full flex-col gap-6">
            {collections.map((collection) => (
              <QuestionCard
                key={collection.question._id}
                question={collection.question}
              />
            ))}
          </div>
        )}
      />
    </>
  );
}
