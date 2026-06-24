"use server";

import mongoose, { Schema } from "mongoose";
import action from "../handlers/action";
import { AskQuestionSchema, EditQuestionSchema } from "../validations";
import handleError from "../handlers/error";
import { Question, Tag } from "@/database";
import TagQuestion from "@/database/tag-question.model";

export async function createQuestion(
  params: CreateQuestionParams,
): Promise<ActionResponse<Question>> {
  // validate params using action wrapper helper
  const validatedResult = await action({
    params,
    schema: AskQuestionSchema,
    authorize: true,
  });

  if (validatedResult instanceof Error) {
    return handleError(validatedResult) as ErrorResponse;
  }

  const { title, content, tags } = validatedResult.params!;
  const userId = validatedResult.session?.user?.id;

  // start session to make the transaction atomic if fails any fails everything.
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Create question
    const [question] = await Question.create(
      [{ title, content, author: userId }],
      { session },
    );

    // initialize array of tagIds and tagQuestion Documents
    const tagIds: Schema.Types.ObjectId[] = [];
    const tagQuestionDocuments = [];

    // Loop through each tag and create or update (if exists)
    for (const tag of tags) {
      const existingTag = await Tag.findOneAndUpdate(
        { name: { $regex: new RegExp(`^${tag}$`, "i") } },
        { $setOnInsert: { name: tag }, $inc: { questions: 1 } },
        { upsert: true, new: true, session },
      );

      tagIds.push(existingTag._id);
      tagQuestionDocuments.push({
        tagId: existingTag._id,
        questionId: question._id,
      });
    }

    // create tagQuestions
    await TagQuestion.insertMany(tagQuestionDocuments, { session });

    // update the question Documents
    await Question.findByIdAndUpdate(
      question._id,
      { $push: { tags: { $each: tagIds } } },
      { session },
    );

    // commit transaction
    await session.commitTransaction();

    return { success: true };
  } catch (error) {
    console.log(error);
    await session.abortTransaction();
    return handleError(error) as ErrorResponse;
  } finally {
    await session.endSession();
  }
}
