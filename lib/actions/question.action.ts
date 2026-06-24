"use server";

import mongoose from "mongoose";
import action from "../handlers/action";
import {
  AskQuestionSchema,
  EditQuestionSchema,
  GetQuestionSchema,
} from "../validations";
import handleError from "../handlers/error";
import { Question, Tag } from "@/database";
import TagQuestion from "@/database/tag-question.model";
import { ForbiddenError, NotFoundError } from "../http-errors";
import { ITagDoc } from "@/database/tag.model";

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
    const tagIds: mongoose.Types.ObjectId[] = [];
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

    return { success: true, data: JSON.parse(JSON.stringify(question)) };
  } catch (error) {
    console.log(error);
    await session.abortTransaction();
    return handleError(error) as ErrorResponse;
  } finally {
    await session.endSession();
  }
}

export async function editQuestion(
  params: EditQuestionParams,
): Promise<ActionResponse<Question>> {
  // validate params using action wrapper helper
  const validatedResult = await action({
    params,
    schema: EditQuestionSchema,
    authorize: true,
  });

  if (validatedResult instanceof Error) {
    return handleError(validatedResult) as ErrorResponse;
  }

  const { title, content, tags, questionId } = validatedResult.params!;
  const userId = validatedResult.session?.user?.id;

  // start session to make the transaction atomic if fails any fails everything.
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // fetching all the question and populate tags of question
    const question = await Question.findById(questionId).populate("tags");

    // check if question exists
    if (!question) {
      throw new NotFoundError("Question");
    }
    // check if question is owned by user
    if (question.author.toString() !== userId) {
      throw new ForbiddenError("You are not authorized to edit this question");
    }

    // check if question title and content changed then save
    if (question.title !== title || question.content !== content) {
      question.title = title;
      question.content = content;
      await question.save({ session });
    }

    // find all the tags to add --> by filtering out the different tags from question tags
    const tagsToAdd = tags.filter(
      (tag) => !question.tags.includes(tag.toLowerCase()),
    );
    // find all the tags to remove --> similar filtering
    const tagsToRemove = question.tags.filter(
      (tag: ITagDoc) => !tags.includes(tag.name.toLowerCase()),
    );

    // create empty newTagDocuments array
    const newTagDocuments = [];

    // check if tagsToAdd > 0
    if (tagsToAdd.length > 0) {
      for (const tag of tagsToAdd) {
        const existingTag = await Tag.findOneAndUpdate(
          { name: { $regex: new RegExp(`^${tag}$`, "i") } },
          { $setOnInsert: { name: tag }, $inc: { question: 1 } },
          { upsert: true, new: true, session },
        );
        // if tag exists or created then update the array of newTagDocuments and question's tags array
        if (existingTag) {
          newTagDocuments.push({ tagId: existingTag._id, questionId });
          question.tags.push(existingTag._id);
        }
      }
    }

    // check if tagsToRemove > 0
    if (tagsToRemove.length > 0) {
      const tagIdsToRemove = tagsToRemove.map((tag: ITagDoc) => tag._id);

      // update the tag documents for every tagIdsToRemove
      await Tag.updateMany(
        { _id: { $in: tagIdsToRemove } },
        { $inc: { question: -1 } },
        { session },
      );

      // delete those tags from tagQuestion
      await TagQuestion.deleteMany(
        { tag: { $in: tagIdsToRemove }, questionId },
        { session },
      );

      // remove those tag ids from the question's tags array
      question.tags = question.tags.filter(
        (tagId: mongoose.Types.ObjectId) => !tagIdsToRemove.includes(tagId),
      );
    }

    // check if any new tag documents changed
    if (newTagDocuments.length > 0) {
      await TagQuestion.insertMany(newTagDocuments, { session });
    }

    // Now save the question with updated tags array
    await question.save({ session });

    // commit transaction
    await session.commitTransaction();

    return { success: true, data: JSON.parse(JSON.stringify(question)) };
  } catch (error) {
    await session.abortTransaction();
    return handleError(error) as ErrorResponse;
  } finally {
    await session.endSession();
  }
}

export async function getQuestion(
  params: GetQuestionParams,
): Promise<ActionResponse<Question>> {
  // validate params using action wrapper helper
  const validatedResult = await action({
    params,
    schema: GetQuestionSchema,
    authorize: true,
  });

  if (validatedResult instanceof Error) {
    return handleError(validatedResult) as ErrorResponse;
  }

  const { questionId } = validatedResult.params!;

  try {
    const question = await Question.findById(questionId).populate("tags");
    if (!question) {
      throw new NotFoundError("Question");
    }
    return { success: true, data: JSON.parse(JSON.stringify(question)) };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}
