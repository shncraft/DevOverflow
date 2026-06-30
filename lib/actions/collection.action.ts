"use server";

import { Collection, Question } from "@/database";
import action from "../handlers/action";
import handleError from "../handlers/error";
import { CollectionBaseSchema } from "../validations";
import { NotFoundError } from "../http-errors";
import { revalidatePath } from "next/cache";
import ROUTES from "@/constants/routes";

export async function toggleSaveQuestionAction(
  params: CollectionBaseParams,
): Promise<ActionResponse<{ saved: boolean }>> {
  const validatedResult = await action({
    params,
    schema: CollectionBaseSchema,
    authorize: true,
  });

  if (validatedResult instanceof Error) {
    return handleError(validatedResult) as ErrorResponse;
  }

  const { questionId } = validatedResult.params!;
  const userId = validatedResult.session?.user?.id;

  try {
    const question = await Question.findById(questionId);
    if (!question) {
      throw new NotFoundError("Question");
    }

    const collection = await Collection.findOne({
      question: questionId,
      author: userId,
    });
    if (collection) {
      await Collection.findByIdAndDelete(collection._id);

      revalidatePath(ROUTES.QUESTION(questionId));

      return {
        success: true,
        data: { saved: false },
      };
    }

    await Collection.create({ question: questionId, author: userId });

    revalidatePath(ROUTES.QUESTION(questionId));

    return { success: true, data: { saved: false } };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function hasSavedQuestionAction(
  params: CollectionBaseParams,
): Promise<ActionResponse<{ saved: boolean }>> {
  const validatedResult = await action({
    params,
    schema: CollectionBaseSchema,
    authorize: true,
  });

  if (validatedResult instanceof Error) {
    return handleError(validatedResult) as ErrorResponse;
  }

  const { questionId } = validatedResult.params!;
  const userId = validatedResult.session?.user?.id;

  try {
    const collection = await Collection.findOne({
      question: questionId,
      author: userId,
    });

    return { success: true, data: { saved: !!collection } };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}
