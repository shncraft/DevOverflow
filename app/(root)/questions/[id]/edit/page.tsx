import { auth } from "@/auth";
import { QuestionForm } from "@/components/forms/question-form";
import ROUTES from "@/constants/routes";
import { getQuestionAction } from "@/lib/actions/question.action";
import { notFound, redirect } from "next/navigation";

export default async function EditQuestion({ params }: RouteParams) {
  const { id } = await params;
  if (!id) return notFound();

  const session = await auth();
  if (!session) return redirect("/sign-in");

  const { data: question, success } = await getQuestionAction({
    questionId: id,
  });
  if (!success) return notFound();

  if (question?.author.toString() !== session.user?.id)
    redirect(ROUTES.QUESTION(id));

  return (
    <>
      <h1 className="h1-bold text-dark100_light900">Edit a question</h1>
      <div className="mt-9">
        <QuestionForm question={question} isEdit />
      </div>
    </>
  );
}
