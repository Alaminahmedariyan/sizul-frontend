"use client";

import { useState } from "react";
import { toast } from "sonner";
import { ContentTabs } from "@/components/admin/content-tabs";
import { ConfirmDeleteDialog } from "@/components/shared/confirm-delete-dialog";
import { EmptyState } from "@/components/shared/empty-state";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import {
  useCreateFaq,
  useDeleteFaq,
  useFaqsForManage,
  useUpdateFaq,
} from "@/hooks/use-faqs";

export default function ContentFaqsPage() {
  const { data, isLoading, isError, error } = useFaqsForManage();

  const createFaq = useCreateFaq();
  const updateFaq = useUpdateFaq();
  const deleteFaq = useDeleteFaq();

  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [category, setCategory] = useState("");

  const faqs = data?.data ?? [];

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim() || !answer.trim()) return;

    createFaq.mutate(
      { question, answer, category: category || undefined },
      {
        onSuccess: () => {
          setQuestion("");
          setAnswer("");
          setCategory("");
          toast.success("FAQ added");
        },
        onError: (err) => toast.error(err.message),
      },
    );
  };

  if (isError)
    return <p className="text-destructive text-sm">{error?.message}</p>;

  return (
    <div>
      <PageHeader
        title="FAQs"
        description="Frequently asked questions shown on the public site"
      />
      <ContentTabs />

      <Card className="mb-4">
        <CardContent className="pt-6">
          <form onSubmit={handleCreate} className="space-y-3">
            <Input
              placeholder="Question"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              required
            />
            <Textarea
              placeholder="Answer"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              required
            />
            <div className="flex gap-2">
              <Input
                placeholder="Category (optional)"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="max-w-xs"
              />
              <Button type="submit" disabled={createFaq.isPending}>
                Add FAQ
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {isLoading && <p className="text-muted-foreground">Loading FAQs...</p>}
      {!isLoading && faqs.length === 0 && (
        <EmptyState
          title="No FAQs yet"
          description="Add your first FAQ above."
        />
      )}

      <div className="space-y-2">
        {faqs.map((faq) => (
          <Card key={faq.id}>
            <CardContent className="pt-6 flex items-start justify-between gap-4">
              <div>
                <p className="font-medium text-sm">{faq.question}</p>
                <p className="text-sm text-muted-foreground mt-1">
                  {faq.answer}
                </p>
                {faq.category && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Category: {faq.category}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={faq.isActive}
                    onCheckedChange={(checked) =>
                      updateFaq.mutate({
                        id: faq.id,
                        payload: { isActive: !!checked },
                      })
                    }
                  />
                  <span className="text-xs">Active</span>
                </div>
                <ConfirmDeleteDialog
                  trigger={
                    <Button variant="ghost" size="sm">
                      Delete
                    </Button>
                  }
                  onConfirm={() => deleteFaq.mutate(faq.id)}
                  isPending={deleteFaq.isPending}
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
