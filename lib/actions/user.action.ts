"use server";

import { User } from "@/database";
import action from "../handlers/action";
import handleError from "../handlers/error";
import { PaginatedSearchParamSchema } from "../validations";

export async function getUsersAction(
  params: PaginatedSearchParams,
): Promise<
  ActionResponse<{ users: User[]; totalUsers: number; isNext: boolean }>
> {
  const validatedResult = await action({
    params,
    schema: PaginatedSearchParamSchema,
  });

  if (validatedResult instanceof Error) {
    return handleError(validatedResult) as ErrorResponse;
  }

  const { page = 1, pageSize = 10, query, filter } = validatedResult.params!;

  const offset = (Number(page) - 1) * Number(pageSize);
  const limit = Number(pageSize);

  const filterQuery: Record<string, unknown> = {};

  if (query) {
    filterQuery.$or = [
      { name: { $regex: query, $options: "i" } },
      { username: { $regex: query, $options: "i" } },
    ];
  }

  let sortCriteria = {};

  switch (filter) {
    case "newest":
      sortCriteria = { createdAt: -1 };
      break;
    case "oldest":
      sortCriteria = { createdAt: 1 };
      break;
    case "popular":
      sortCriteria = { reputation: -1 };
      break;
    default:
      sortCriteria = { createdAt: -1 };
      break;
  }

  try {
    const totalUsers = await User.countDocuments(filterQuery);

    const users = await User.find(filterQuery)
      .sort(sortCriteria)
      .skip(offset)
      .limit(limit);

    const isNext = totalUsers > offset + users.length;

    return {
      success: true,
      data: { users: JSON.parse(JSON.stringify(users)), totalUsers, isNext },
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}
