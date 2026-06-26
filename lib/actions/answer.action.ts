"use server";

import mongoose from "mongoose";
import { IAnswerDoc } from "@/database/answer.model";
import action from "../handlers/action";
import { CreateAnswerSchema, GetAnswersSchema } from "../validations";
import handleError from "../handlers/error";
import { Question, Answer } from "@/database";
import { NotFoundError } from "../http-errors";
import { revalidatePath } from "next/cache";
import ROUTES from "@/constants/routes";

export async function createAnswerAction(
  params: CreateAnswerParams,
): Promise<ActionResponse<IAnswerDoc>> {
  const validatedResult = await action({
    params,
    schema: CreateAnswerSchema,
    authorize: true,
  });

  if (validatedResult instanceof Error) {
    return handleError(validatedResult) as ErrorResponse;
  }

  const { questionId, content } = validatedResult.params!;
  const userId = validatedResult.session?.user?.id;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // check question exists
    const question = await Question.findById(questionId);
    if (!question) throw new NotFoundError("Question");

    const [newAnswer] = await Answer.create(
      [
        {
          author: userId,
          question: questionId,
          content,
        },
      ],
      { session },
    );

    if (!newAnswer) throw new Error("Failed to create answer!");

    question.answers += 1;
    await question.save({ session });

    await session.commitTransaction();

    revalidatePath(ROUTES.QUESTION(questionId));

    return { success: true, data: JSON.parse(JSON.stringify(newAnswer)) };
  } catch (error) {
    await session.abortTransaction();
    return handleError(error) as ErrorResponse;
  } finally {
    await session.endSession();
  }
}

export async function getAnswersAction(
  params: GetAnswersParams,
): Promise<
  ActionResponse<{ answers: Answer[]; isNext: boolean; totalAnswers: number }>
> {
  const validatedResult = await action({
    params,
    schema: GetAnswersSchema,
  });

  if (validatedResult instanceof Error) {
    return handleError(validatedResult) as ErrorResponse;
  }

  const {
    questionId,
    filter,
    page = 1,
    pageSize = 10,
  } = validatedResult.params!;

  // build limit and offset
  const limit = Number(pageSize);
  const offset = (Number(page) - 1) * Number(pageSize);

  // build sortCriteria
  let sortCriteria = {};
  switch (filter) {
    case "latest":
      sortCriteria = {
        createdAt: -1,
      };
      break;
    case "oldest":
      sortCriteria = { createdAt: 1 };
      break;
    case "popular":
      sortCriteria = {
        upvotes: -1,
      };
      break;
    default:
      sortCriteria = {
        createdAt: -1,
      };
      break;
  }

  try {
    const totalAnswers = await Answer.countDocuments({ question: questionId });

    const answers = await Answer.find({ question: questionId })
      .populate("author", "_id name image")
      .sort(sortCriteria)
      .skip(offset)
      .limit(limit);

    const isNext = totalAnswers > answers.length + offset;

    return { success: true, data: { answers, totalAnswers, isNext } };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}
