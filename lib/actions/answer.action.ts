"use server";

import mongoose from "mongoose";
import { IAnswerDoc } from "@/database/answer.model";
import action from "../handlers/action";
import { CreateAnswerSchema } from "../validations";
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
