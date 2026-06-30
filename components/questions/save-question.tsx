"use client";

import { toggleSaveQuestionAction } from "@/lib/actions/collection.action";
import { cn } from "@/lib/utils";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { use, useState } from "react";
import { toast } from "sonner";

export function SaveQuestion({
  questionId,
  hasSavedQuestionPromise,
}: {
  questionId: string;
  hasSavedQuestionPromise: Promise<ActionResponse<{ saved: boolean }>>;
}) {
  const session = useSession();
  const userId = session.data?.user?.id;

  const { data } = use(hasSavedQuestionPromise);
  const { saved: hasSaved } = data || {};

  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    if (isLoading) return;
    if (!userId)
      return toast.error(
        "Unauthorized: You need to logged in to save a question",
      );

    setIsLoading(true);
    try {
      const { success, error, data } = await toggleSaveQuestionAction({
        questionId,
      });
      if (!success) throw new Error(error?.message || "An error occurred");

      toast.success(
        `Question ${data?.saved ? "saved" : "unsaved"} successfully.`,
      );
    } catch (error) {
      toast.error(
        `Error: ${error instanceof Error ? error.message : "An error occurred"}`,
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Image
      src={hasSaved ? "/icons/star-filled.svg" : "/icons/star-red.svg"}
      width={18}
      height={18}
      alt="save"
      className={cn("cursor-pointer", isLoading && "opacity-50")}
      aria-label="Save Question"
      onClick={handleSave}
    />
  );
}
