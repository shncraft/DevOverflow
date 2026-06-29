"use server";

import { Answer, Question, Vote } from "@/database";
import action from "../handlers/action";
import handleError from "../handlers/error";
import { UnauthorizedError } from "../http-errors";
import {
  CreateVoteSchema,
  HasVotedSchema,
  UpdateVoteCountSchema,
} from "../validations";
import mongoose, { ClientSession } from "mongoose";

export async function updateVoteCountAction(
  params: UpdateVoteCountParams,
  session?: ClientSession,
): Promise<ActionResponse> {
  const validatedResult = await action({
    params,
    schema: UpdateVoteCountSchema,
  });

  if (validatedResult instanceof Error) {
    return handleError(validatedResult) as ErrorResponse;
  }

  const { change, targetId, targetType, voteType } = validatedResult.params!;

  const Model = targetType === "question" ? Question : Answer;
  const voteField = voteType === "upvote" ? "upvotes" : "downvotes";

  try {
    const result = await Model.findByIdAndUpdate(
      targetId,
      { $inc: { [voteField]: change } },
      { new: true, session },
    );
    if (!result) throw new Error("Failed to update votes.");

    return { success: true };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function createVoteAction(
  params: CreateVoteParams,
): Promise<ActionResponse> {
  const validatedResult = await action({
    params,
    schema: CreateVoteSchema,
    authorize: true,
  });

  if (validatedResult instanceof Error) {
    return handleError(validatedResult) as ErrorResponse;
  }

  const { targetId, targetType, voteType } = validatedResult.params!;
  const userId = validatedResult.session?.user?.id;

  if (!userId) throw new UnauthorizedError();

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // first fetch the existing vote
    const existingVote = await Vote.findOne({
      author: userId,
      actionId: targetId,
      actionType: targetType,
    }).session(session);

    // check if exists or not
    if (existingVote) {
      // ---> if voteType is equal to existingVote type
      if (existingVote.voteType === voteType) {
        // ---> If the user has already voted with the same voteType, remove the vote
        await Vote.deleteOne({ _id: existingVote._id }).session(session);
        // Update the respective model vote counts
        await updateVoteCountAction(
          { targetId, targetType, voteType, change: -1 },
          session,
        );
      } else {
        // if user has already voted with a different voteType, update vote
        await Vote.findByIdAndUpdate(
          existingVote._id,
          { voteType },
          { new: true, session },
        );
        // update respective model
        await updateVoteCountAction(
          { targetId, targetType, voteType, change: -1 },
          session,
        );
      }
    } else {
      // If user has not voted yet, create new vote
      await Vote.create([{ targetId, targetType, voteType, change: 1 }], {
        session,
      });
      // update respective model
      await updateVoteCountAction(
        { targetId, targetType, voteType, change: -1 },
        session,
      );
    }

    await session.commitTransaction();

    return { success: true };
  } catch (error) {
    await session.abortTransaction();
    return handleError(error) as ErrorResponse;
  } finally {
    await session.endSession();
  }
}

export async function hasVoted(
  params: HasVotedParams,
): Promise<ActionResponse<HasVotedResponse>> {
  const validatedResult = await action({
    params,
    schema: HasVotedSchema,
    authorize: true,
  });

  if (validatedResult instanceof Error) {
    return handleError(validatedResult) as ErrorResponse;
  }

  const { targetId, targetType } = validatedResult.params!;
  const userId = validatedResult.session?.user?.id;

  try {
    const vote = await Vote.findOne({
      author: userId,
      actionId: targetId,
      actionType: targetType,
    });

    if (!vote) {
      return {
        success: true,
        data: { hasUpvoted: false, hasDownvoted: false },
      };
    }

    return {
      success: true,
      data: {
        hasUpvoted: vote.voteType === "upvote",
        hasDownvoted: vote.voteType === "downvote",
      },
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}
