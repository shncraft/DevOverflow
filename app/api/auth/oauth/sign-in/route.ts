import mongoose from "mongoose";
import dbConnect from "@/lib/mongoose";
import { NextRequest, NextResponse } from "next/server";
import handleError from "@/lib/handlers/error";
import { SignInWithOAuthSchema } from "@/lib/validations";
import { ValidationError } from "@/lib/http-errors";
import slugify from "slugify";
import { Account, User } from "@/database";

export async function POST(request: NextRequest) {
  // Step 1: Destructure request body
  const { provider, providerAccountId, user } = await request.json();

  // Step 2: establish DB connection
  await dbConnect();

  // Step 3: Instantiate mongoose session
  const session = await mongoose.startSession();
  // Step 4: Start mongoose transaction
  session.startTransaction();

  try {
    // Step 5: Validate the input data
    const parsed = SignInWithOAuthSchema.safeParse({
      provider,
      providerAccountId,
      user,
    });
    if (!parsed.success)
      throw new ValidationError(parsed.error.flatten().fieldErrors);

    // Step 6: Destructure user data
    const { email, name, username, image } = parsed.data.user;

    // Step 7: Slugify username to remove special symbol characters to reduce threat
    const slugifiedUsername = slugify(username, {
      lower: true,
      strict: true,
      trim: true,
    });

    // Step 8: check user already exists with email
    let existingUser = await User.findOne({ email }).session(session);

    if (!existingUser) {
      // Step 8(a): if doesn't exists then create new user row
      [existingUser] = await User.create(
        [{ name, username: slugifiedUsername, email, image }],
        { session },
      );
    } else {
      // Step 8(b): if already exists then update the user row with new details if different
      const updatedData: { name?: string; image?: string } = {};

      if (existingUser.name !== name) updatedData.name = name;
      if (existingUser.image !== image) updatedData.image = image;

      if (Object.entries(updatedData).length > 0) {
        await User.updateOne(
          { _id: existingUser._id },
          { $set: updatedData },
        ).session(session);
      }
    }

    // Step 9: Check account already exists with provider, providerAccountId and userId
    const existingAccount = await Account.findOne({
      userId: existingUser._id,
      provider,
      providerAccountId,
    });

    if (!existingAccount) {
      // Step 9(a): if doesn't exists then we will create new account row
      await Account.create(
        [
          {
            userId: existingUser._id,
            name,
            image,
            provider,
            providerAccountId,
          },
        ],
        { session },
      );
    }

    // Step 9(b): if already existing then commit transaction and return response
    await session.commitTransaction();

    return NextResponse.json({ success: true });
  } catch (error) {
    await session.abortTransaction();
    return handleError(error) as APIErrorResponse;
  } finally {
    await session.endSession();
  }
}
