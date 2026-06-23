"use client";

import { AuthForm } from "@/components/forms/auth-form";
import { signInWithCredentials } from "@/lib/actions/auth.action";
import { signInSchema } from "@/lib/validations";

export default function SignIn() {
  return (
    <AuthForm
      formType="SIGN_IN"
      schema={signInSchema}
      defaultValues={{ email: "", password: "" }}
      onSubmit={signInWithCredentials}
    />
  );
}
