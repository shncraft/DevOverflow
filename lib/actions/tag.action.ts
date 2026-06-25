"use server";

import { Tag } from "@/database";
import action from "../handlers/action";
import handleError from "../handlers/error";
import { PaginatedSearchParamSchema } from "../validations";

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

    return { success: true, data: { tags, isNext } };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}
