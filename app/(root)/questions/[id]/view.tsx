"use client";

import { incrementViewsAction } from "@/lib/actions/question.action";
import { useEffect } from "react";
import { toast } from "sonner";

export function View({ questionId }: { questionId: string }) {
  const handleIncrementView = async () => {
    const result = await incrementViewsAction({ questionId });

    if (result.success) {
      toast.success(`Success! views count: ${result.data?.views}`);
    } else toast.error(`Error: ${result.error?.message}`);
  };

  useEffect(() => {
    handleIncrementView();
  }, []);
  return null;
}
