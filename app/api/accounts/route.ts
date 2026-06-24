import { Account } from "@/database";
import handleError from "@/lib/handlers/error";
import { ForbiddenError, ValidationError } from "@/lib/http-errors";
import dbConnect from "@/lib/mongoose";
import { AccountSchema } from "@/lib/validations";
import { NextRequest, NextResponse } from "next/server";

// GET /api/accounts
export async function GET() {
  try {
    await dbConnect();

    const accounts = await Account.find();

    return NextResponse.json(
      { success: true, data: accounts },
      { status: 200 },
    );
  } catch (error) {
    return handleError(error, "api") as APIErrorResponse;
  }
}

// POST /api/accounts
export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const body = await request.json();

    const parsed = AccountSchema.safeParse(body);
    if (!parsed.success)
      throw new ValidationError(parsed.error.flatten().fieldErrors);

    const existingAccount = await Account.find({
      provider: parsed.data.provider,
      providerAccountId: parsed.data.providerAccountId,
    });
    if (existingAccount)
      throw new ForbiddenError(
        "An account with the same provider already exists",
      );

    const newAccount = await Account.create(parsed.data);

    return NextResponse.json(
      { success: true, data: newAccount },
      { status: 201 },
    );
  } catch (error) {
    return handleError(error, "api") as APIErrorResponse;
  }
}
