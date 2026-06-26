import { getTagQuestionsAction } from "@/lib/actions/tag.action";

export default async function TagDetailsPage({ params }: RouteParams) {
  const { id, page, pageSize, query } = await params;

  const { success, data, error } = await getTagQuestionsAction({
    tagId: id,
    page: Number(page) || 1,
    pageSize: Number(pageSize) || 10,
    query,
  });

  const { tag, questions, isNext } = data || {};

  return <div>TagDetailsPage: {id}</div>;
}
