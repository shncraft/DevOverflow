"use client";

import {
  Controller,
  DefaultValues,
  FieldValues,
  Path,
  SubmitHandler,
  useForm,
} from "react-hook-form";
import { toast } from "sonner";
import { Field, FieldError, FieldGroup, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import Link from "next/link";
import ROUTES from "@/constants/routes";
import z, { ZodType } from "zod/v4";
import { asZodResolver } from "@/lib/utils";

interface AuthFormProps<TSchema extends FieldValues> {
  schema: ZodType<TSchema>;
  defaultValues: TSchema;
  onSubmit: (data: TSchema) => Promise<{ success: boolean }>;
  formType: "SIGN_IN" | "SIGN_UP";
}

export function AuthForm<TSchema extends FieldValues>({
  schema,
  defaultValues,
  formType,
  onSubmit,
}: AuthFormProps<TSchema>) {
  // console.log(schema);

  const form = useForm<z.infer<TSchema>>({
    resolver: asZodResolver(schema),
    defaultValues: defaultValues as DefaultValues<z.infer<TSchema>>,
  });

  const handleSubmit: SubmitHandler<TSchema> = async (data: TSchema) => {
    console.log("data:", data);
    toast.success("You submitted the following values:", {
      description: (
        <pre className="mt-2 w-[320px] overflow-x-auto rounded-md bg-code p-4 text-code-foreground">
          <code>{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
      position: "bottom-right",
      classNames: {
        content: "flex flex-col gap-2",
      },
      style: {
        "--border-radius": "calc(var(--radius)  + 4px)",
      } as React.CSSProperties,
    });
  };

  const buttonText = formType === "SIGN_IN" ? "Sign In" : "Sign Up";

  return (
    <>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="mt-10 space-y-6"
      >
        <FieldGroup>
          {Object.keys(defaultValues).map((field) => (
            <Controller
              key={field}
              name={field as Path<z.infer<TSchema>>}
              control={form.control}
              render={({ field, fieldState }) => (
                <Field
                  data-invalid={fieldState.invalid}
                  className="flex w-full flex-col gap-2"
                >
                  <FieldLabel className="paragraph-medium text-dark400_light700">
                    {field.name === "email"
                      ? "Email Address"
                      : field.name.charAt(0).toUpperCase() +
                        field.name.slice(1)}
                  </FieldLabel>
                  <Input
                    {...field}
                    required
                    type={field.name === "password" ? "password" : "text"}
                    aria-invalid={fieldState.invalid}
                    className="paragraph-regular background-light900_dark300 light-border-2 text-dark300_light700 no-focus min-h-12 rounded-1.5 border
                    "
                    autoComplete="off"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          ))}
        </FieldGroup>
        <Button
          disabled={form.formState.isSubmitting}
          className="primary-gradient paragraph-medium min-h-12 w-full rounded-2 px-4 py-3 font-inter text-light-900!"
        >
          {form.formState.isSubmitting
            ? buttonText === "Sign In"
              ? "Signing In..."
              : "Signing Up..."
            : buttonText}
        </Button>

        {formType === "SIGN_IN" ? (
          <p>
            Don&apos;t have an account?{" "}
            <Link
              href={ROUTES.SIGN_UP}
              className="paragraph-medium primary-text-gradient"
            >
              Create An Account
            </Link>
          </p>
        ) : (
          <p>
            Already have an account?{" "}
            <Link
              href={ROUTES.SIGN_IN}
              className="paragraph-medium primary-text-gradient"
            >
              Sign In
            </Link>
          </p>
        )}
      </form>
    </>
  );
}
