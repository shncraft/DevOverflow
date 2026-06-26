"use client";

import { Controller, useForm } from "react-hook-form";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "../ui/field";

import { useRef, useState, useTransition } from "react";
import { MDXEditorMethods } from "@mdxeditor/editor";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnswerSchema } from "@/lib/validations";
import z from "zod";
import dynamic from "next/dynamic";
import { Button } from "../ui/button";
import { LoaderIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { createAnswerAction } from "@/lib/actions/answer.action";
import { toast } from "sonner";

const Editor = dynamic(() => import("@/components/editor"), {
  ssr: false,
});

export function AnswerForm({ questionId }: { questionId: string }) {
  const [isAISubmitting, setIsAISubmitting] = useState(false);

  const [isAnswering, startAnsweringTransition] = useTransition();

  const editorRef = useRef<MDXEditorMethods>(null);

  const form = useForm<z.infer<typeof AnswerSchema>>({
    resolver: zodResolver(AnswerSchema),
    defaultValues: {
      content: "",
    },
  });

  const handleSubmit = async (data: z.infer<typeof AnswerSchema>) => {
    startAnsweringTransition(async () => {
      const result = await createAnswerAction({
        questionId,
        content: data.content,
      });

      if (result.success) {
        form.reset({ content: "" });

        toast.success("Your answer has been posted successfully.");
      } else {
        toast.error(`Error: ${result.error?.message}`);
      }
    });
  };

  return (
    <div>
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center sm:gap-2">
        <h4 className="paragraph-semibold text-dark400_light800">
          Write your answer here
        </h4>
        <Button
          type="submit"
          disabled={isAISubmitting}
          className="btn light-border-2 gap-1.5 rounded-md px-4 py-2.5 text-primary-500 shadow-none dark:text-primary-500"
        >
          {isAISubmitting ? (
            <>
              <LoaderIcon
                aria-label="Loading"
                className={cn("mr-2 size-4 animate-spin")}
              />
              Generating...
            </>
          ) : (
            <>
              <Image
                src="/icons/stars.svg"
                alt="Generate AI Answer"
                width={12}
                height={12}
                className="object-contain size-3"
              />
              Generate AI Answer
            </>
          )}
        </Button>
      </div>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="mt-6 flex w-full flex-col gap-10"
      >
        <FieldGroup>
          <Controller
            name="content"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field
                className="mt-3.5 flex w-full flex-col gap-3"
                data-invalid={fieldState.invalid}
              >
                <Editor
                  editorRef={editorRef}
                  fieldChange={field.onChange}
                  markdown={field.value}
                />
                <FieldDescription className="body-regular mt-2.5 text-light-500">
                  Your answer has to have more 100 characters.
                </FieldDescription>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </FieldGroup>

        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={isAnswering}
            className="primary-gradient w-fit text-light-900! p-4 py-5 rounded-lg"
          >
            {isAnswering ? (
              <>
                <LoaderIcon
                  aria-label="Loading"
                  className={cn("mr-2 size-4 animate-spin")}
                />
                Posting...
              </>
            ) : (
              "Post Answer"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
