"use client";

import { AuthForm } from "@/components/forms/auth-form";
import { signUpWithCredentials } from "@/lib/actions/auth.action";
import { signUpSchema } from "@/lib/validations";

export default function SignUp() {
  return (
    <AuthForm
      formType="SIGN_UP"
      schema={signUpSchema}
      defaultValues={{ username: "", name: "", email: "", password: "" }}
      onSubmit={signUpWithCredentials}
    />
  );
}
