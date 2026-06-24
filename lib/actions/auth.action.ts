"use server";

import mongoose from "mongoose";
import action from "../handlers/action";
import { signInSchema, signUpSchema } from "../validations";
import handleError from "../handlers/error";
import { Account, User } from "@/database";
import bcrypt from "bcryptjs";
import { signIn, signOut } from "@/auth";
import { NotFoundError } from "../http-errors";

export async function signUpWithCredentialsAction(
  params: AuthCredentials,
): Promise<ActionResponse> {
  const validationResult = await action({ params, schema: signUpSchema });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { email, name, username, password } = validationResult.params!;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // check if user exists with email
    const existingUser = await User.findOne({ email }).session(session);
    if (existingUser) throw new Error("User already exists");

    // check if username exists
    const existingUsername = await User.findOne({ username }).session(session);
    if (existingUsername)
      throw new Error("Username already exists try different one.");

    // hash password before creating user
    const hashedPassword = await bcrypt.hash(password, 12);

    // Now create a user
    const [newUser] = await User.create([{ name, email, username }], {
      session,
    });
    // console.log("newUser:", newUser);

    // after create new account
    await Account.create(
      [
        {
          userId: newUser._id,
          name,
          provider: "credentials",
          providerAccountId: email,
          password: hashedPassword,
        },
      ],
      { session },
    );

    await session.commitTransaction();
    // console.log("Reached here means session commitTransaction.");

    await signIn("credentials", { email, password, redirect: false });

    return { success: true };
  } catch (error) {
    console.log("Reached here means session aborted.");
    await session.abortTransaction();
    return handleError(error) as ErrorResponse;
  } finally {
    await session.endSession();
  }
}

export async function signInWithCredentialsAction(
  params: Pick<AuthCredentials, "email" | "password">,
): Promise<ActionResponse> {
  const validationResult = await action({ params, schema: signInSchema });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { email, password } = validationResult.params!;

  try {
    // check if user exists with email
    const existingUser = await User.findOne({ email });
    if (!existingUser) throw new NotFoundError("User");

    // check if username exists
    const existingAccount = await Account.findOne({
      provider: "credentials",
      providerAccountId: email,
    });
    if (!existingAccount) throw new NotFoundError("Account");

    // compare password
    const passwordMatch = await bcrypt.compare(
      password,
      existingAccount.password,
    );

    if (!passwordMatch) throw new Error("Invalid credentials.");

    await signIn("credentials", { email, password, redirect: false });

    return { success: true };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function logoutAction() {
  await signOut({ redirectTo: "/" });
}
