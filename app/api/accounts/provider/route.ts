import { Account } from "@/database";
import handleError from "@/lib/handlers/error";
import { NotFoundError, ValidationError } from "@/lib/http-errors";
import { AccountSchema } from "@/lib/validations";
import { NextRequest, NextResponse } from "next/server";

// POST /api/users/email
export async function POST(request: NextRequest) {
  const { providerAccountId } = await request.json();

  try {
    const parsed = AccountSchema.partial().safeParse({ providerAccountId });

    if (!parsed.success)
      throw new ValidationError(parsed.error.flatten().fieldErrors);

    const account = await Account.findOne({ providerAccountId });
    if (!account) throw new NotFoundError("Account");

    return NextResponse.json({ success: true, data: account }, { status: 200 });
  } catch (error) {
    return handleError(error, "api") as APIErrorResponse;
  }
}
