import TagCard from "@/components/cards/tag-card";
import DataRenderer from "@/components/data-renderer";
import LocalSearch from "@/components/search/local-search";
import ROUTES from "@/constants/routes";
import { EMPTY_TAGS } from "@/constants/states";
import { getTags } from "@/lib/actions/tag.action";

export default async function TagsPage({ searchParams }: RouteParams) {
  const { page, pageSize, query, filter } = await searchParams;

  const { success, data, error } = await getTags({
    page: Number(page) || 1,
    pageSize: Number(pageSize) || 10,
    query,
    filter,
  });

  const { tags } = data || {};

  return (
    <>
      <h1 className="h1-bold text-dark100_light900 text-3xl">Tags</h1>

      <section className="mt-11">
        <LocalSearch
          route={ROUTES.TAGS}
          imgSrc="/icons/search.svg"
          placeholder="Search by tag name..."
          otherClasses="flex-1"
        />
      </section>

      <DataRenderer
        success={success}
        error={error}
        data={tags}
        empty={EMPTY_TAGS}
        render={(tags: Tag[]) => (
          <div className="mt-10 flex w-full flex-wrap gap-4">
            {tags.map((tag) => (
              <TagCard
                key={tag._id}
                _id={tag._id}
                name={tag.name}
                questions={tag.questions}
              />
            ))}
          </div>
        )}
      />
    </>
  );
}
