"use client";

import { AskQuestionSchema } from "@/lib/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import z from "zod";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "../ui/field";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useRef } from "react";
import { MDXEditorMethods } from "@mdxeditor/editor";
import dynamic from "next/dynamic";

// This is the only place InitializedMDXEditor is imported directly.
const Editor = dynamic(() => import("@/components/editor"), {
  // Make sure we turn SSR off
  ssr: false,
});

export function QuestionForm() {
  const editorRef = useRef<MDXEditorMethods>(null);

  const form = useForm<z.infer<typeof AskQuestionSchema>>({
    resolver: zodResolver(AskQuestionSchema),
    defaultValues: {
      title: "",
      content: "",
      tags: [],
    },
  });

  const handleCreateQuestion = () => {};

  return (
    <form
      onSubmit={form.handleSubmit(handleCreateQuestion)}
      className="flex w-full flex-col gap-10"
    >
      <FieldGroup>
        <Controller
          name="title"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field
              data-invalid={fieldState.invalid}
              className="flex w-full flex-col"
            >
              <FieldLabel className="paragraph-semibold text-dark400_light800">
                Question Title <span className="text-destructive">*</span>
              </FieldLabel>
              <Input
                {...field}
                aria-invalid={fieldState.invalid}
                required
                className="paragraph-regular background-light700_dark300 light-border-2 text-dark300_light700 no-focus min-h-14 rounded-1.5 border"
              />
              <FieldDescription className="body-regular mt-2.5 text-light-500">
                Be specific and imagine you are asking a question to another
                person.
              </FieldDescription>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FieldGroup>

      <FieldGroup>
        <Controller
          name="content"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field
              data-invalid={fieldState.invalid}
              className="flex w-full flex-col"
            >
              <FieldLabel className="paragraph-semibold text-dark400_light800">
                Detailed explanation of your problem{" "}
                <span className="text-destructive">*</span>
              </FieldLabel>
              <Editor
                editorRef={editorRef}
                markdown={field.value}
                fieldChange={field.onChange}
              />
              <FieldDescription className="body-regular mt-2.5 text-light-500">
                Introduce the problem and expand on what you&apos;ve put in the
                title.
              </FieldDescription>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FieldGroup>

      <FieldGroup>
        <Controller
          name="tags"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field
              data-invalid={fieldState.invalid}
              className="flex w-full flex-col gap-3"
            >
              <FieldLabel className="paragraph-semibold text-dark400_light800">
                Tags <span className="text-destructive">*</span>
              </FieldLabel>
              <div>
                <Input
                  {...field}
                  aria-invalid={fieldState.invalid}
                  required
                  className="paragraph-regular background-light700_dark300 light-border-2 text-dark300_light700 no-focus min-h-14 rounded-1.5 border"
                  placeholder="Add tags..."
                />
                Tags:
              </div>
              <FieldDescription className="body-regular mt-2.5 text-light-500">
                Add yp to 3 tags to describe what your question is about. You
                need to press enter to add a tag.
              </FieldDescription>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FieldGroup>

      <div className="mt-16 flex justify-end">
        <Button
          type="submit"
          className="primary-gradient w-fit text-light-900!"
        >
          Ask A Question
        </Button>
      </div>
    </form>
  );
}
