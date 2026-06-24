export default async function QuestionDetails({ params }: RouteParams) {
  const { id } = await params;
  return <div>QuestionDetails of Question ID: {id}</div>;
}
