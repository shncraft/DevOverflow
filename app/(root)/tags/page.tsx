import { getTags } from "@/lib/actions/tag.action";

export default async function TagsPage() {
  const { success, data, error } = await getTags({
    page: 1,
    pageSize: 10,
    query: "js",
  });

  const { tags } = data || {};

  console.log("tags:", tags);

  return <div>TagsPage</div>;
}
