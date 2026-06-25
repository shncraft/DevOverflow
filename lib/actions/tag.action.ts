"use server";

import { Question, Tag } from "@/database";
import action from "../handlers/action";
import handleError from "../handlers/error";
import {
  GetTagQuestionsSchema,
  PaginatedSearchParamSchema,
} from "../validations";
import { NotFoundError } from "../http-errors";

export async function getTags(
  params: PaginatedSearchParams,
): Promise<ActionResponse<{ tags: Tag[]; isNext: boolean }>> {
  // validate the params
  const validatedResult = await action({
    params,
    schema: PaginatedSearchParamSchema,
  });

  // return error if not validated
  if (validatedResult instanceof Error) {
    return handleError(validatedResult) as ErrorResponse;
  }

  // prepare the limit and offset
  const { page = 1, pageSize = 10, filter, query } = validatedResult.params!;
  const limit = Number(pageSize);
  const offset = (Number(page) - 1) * pageSize;

  // Build filterQuery
  const filterQuery: Record<string, unknown> = {};

  if (query) {
    filterQuery.$or = [
      {
        name: {
          $regex: query,
          $options: "i",
        },
      },
    ];
  }

  // Build sort criteria
  let sortCriteria = {};

  switch (filter) {
    case "popular":
      sortCriteria = { questions: -1 };
      break;
    case "recent":
      sortCriteria = { createdAt: -1 };
      break;
    case "oldest":
      sortCriteria = { createdAt: 1 };
      break;
    case "name":
      sortCriteria = { name: 1 };
      break;
    default:
      sortCriteria = { questions: -1 };
      break;
  }

  try {
    // fetch total number of tags
    const totalTags = await Tag.countDocuments(filterQuery);

    // fetch all tags
    const tags = await Tag.find(filterQuery)
      .sort(sortCriteria)
      .skip(offset)
      .limit(limit);

    const isNext = totalTags > offset + tags.length;

    return {
      success: true,
      data: { tags: JSON.parse(JSON.stringify(tags)), isNext },
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function getTagQuestions(
  params: GetTagQuestionsParams,
): Promise<
  ActionResponse<{ tag: Tag; questions: Question[]; isNext: boolean }>
> {
  const validatedResult = await action({
    params,
    schema: GetTagQuestionsSchema,
  });

  if (validatedResult instanceof Error) {
    return handleError(validatedResult) as ErrorResponse;
  }

  const { tagId, page = 1, pageSize = 10, query } = validatedResult.params!;

  const limit = Number(pageSize);
  const offset = (Number(page) - 1) * pageSize;

  try {
    // first find tag based on tag ID given
    const tag = await Tag.findById(tagId);
    if (!tag) throw new NotFoundError("Tag");

    // build filterQuery
    const filterQuery: Record<string, unknown> = { tags: { $in: [tagId] } };
    if (query) {
      filterQuery.title = { $regex: query, $options: "i" };
    }

    const totalQuestions = await Question.countDocuments(filterQuery);

    const questions = await Question.find(filterQuery)
      .select("_id title views answers upvotes downvotes author createdAt")
      .populate([
        { path: "author", select: "name image" },
        { path: "tags", select: "name" },
      ])
      .skip(offset)
      .limit(limit);

    const isNext = totalQuestions > offset + questions.length;

    return {
      success: true,
      data: {
        tag: JSON.parse(JSON.stringify(tag)),
        questions: JSON.parse(JSON.stringify(questions)),
        isNext,
      },
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}
