import { EMPTY_ANSWER } from "@/constants/states";
import DataRenderer from "../data-renderer";
import { AnswerCard } from "../cards/answer-card";

interface AllAnswersProps extends ActionResponse<Answer[]> {
  totalAnswers: number;
}

export function AllAnswers({
  data,
  success,
  error,
  totalAnswers,
}: AllAnswersProps) {
  return (
    <div className="mt-11">
      <div className="flex items-center justify-between">
        <h3 className="primary-text-gradient">
          {totalAnswers} {totalAnswers === 1 ? "Answer" : "Answers"}
        </h3>
        <p>Filters</p>
      </div>

      <DataRenderer
        data={data}
        error={error}
        success={success}
        empty={EMPTY_ANSWER}
        render={(answers) =>
          answers.map((answer) => (
            <AnswerCard
              key={answer._id}
              _id={answer._id}
              author={answer.author}
              content={answer.content}
              createdAt={answer.createdAt}
              upvotes={answer.upvotes}
              downvotes={answer.downvotes}
            />
          ))
        }
      />
    </div>
  );
}
