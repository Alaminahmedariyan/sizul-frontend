"use client";

import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

import { useClients } from "@/hooks/use-clients";
import { useCreateProposal } from "@/hooks/use-proposals";

import type { ProposalItemInput } from "@/lib/api/proposals";

type ItemRow = ProposalItemInput & { key: string };

function makeEmptyRow(): ItemRow {
  return { key: crypto.randomUUID(), title: "", quantity: 1, unitPrice: 0 };
}

export default function NewProposalPage() {
  const router = useRouter();

  const { data: clientsRes } = useClients({ limit: 100 });
  const createProposal = useCreateProposal();

  const [clientId, setClientId] = useState("");
  const [title, setTitle] = useState("");
  const [introduction, setIntroduction] = useState("");
  const [terms, setTerms] = useState("");
  const [discount, setDiscount] = useState(0);
  const [tax, setTax] = useState(0);
  const [items, setItems] = useState<ItemRow[]>([makeEmptyRow()]);

  const clients = clientsRes?.data ?? [];

  const updateItem = (key: string, patch: Partial<ItemRow>) => {
    setItems((prev) =>
      prev.map((item) => (item.key === key ? { ...item, ...patch } : item)),
    );
  };

  const addItem = () => setItems((prev) => [...prev, makeEmptyRow()]);
  const removeItem = (key: string) =>
    setItems((prev) => prev.filter((item) => item.key !== key));

  const subtotal = items.reduce(
    (sum, item) => sum + item.quantity * item.unitPrice,
    0,
  );
  const total = subtotal - discount + tax;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    createProposal.mutate(
      {
        clientId: clientId || undefined,
        title,
        introduction: introduction || undefined,
        terms: terms || undefined,
        discount,
        tax,
        items: items.map(({ key, ...item }) => item),
      },
      {
        onSuccess: (res) => {
          toast.success("Proposal created");
          router.push(`/admin/proposals/${res.data.id}`);
        },
        onError: (err) => toast.error(err.message),
      },
    );
  };

  return (
    <form onSubmit={handleSubmit}>
      <PageHeader title="New Proposal" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="space-y-1">
          <Label>Client</Label>
          <Select value={clientId} onValueChange={setClientId}>
            <SelectTrigger>
              <SelectValue placeholder="Select client" />
            </SelectTrigger>
            <SelectContent>
              {clients.map((client) => (
                <SelectItem key={client.id} value={client.id}>
                  {client.name} ({client.email})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1">
          <Label>Title</Label>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div className="space-y-1">
          <Label>Introduction</Label>
          <Textarea
            value={introduction}
            onChange={(e) => setIntroduction(e.target.value)}
          />
        </div>

        <div className="space-y-1">
          <Label>Terms</Label>
          <Textarea value={terms} onChange={(e) => setTerms(e.target.value)} />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Line Items</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {items.map((item) => (
            <div key={item.key} className="flex gap-2 items-end">
              <div className="flex-1 space-y-1">
                <Label className="text-xs">Title</Label>
                <Input
                  value={item.title}
                  onChange={(e) =>
                    updateItem(item.key, { title: e.target.value })
                  }
                  required
                />
              </div>
              <div className="w-20 space-y-1">
                <Label className="text-xs">Qty</Label>
                <Input
                  type="number"
                  min={1}
                  value={item.quantity}
                  onChange={(e) =>
                    updateItem(item.key, { quantity: Number(e.target.value) })
                  }
                  required
                />
              </div>
              <div className="w-28 space-y-1">
                <Label className="text-xs">Unit Price</Label>
                <Input
                  type="number"
                  min={0}
                  step="0.01"
                  value={item.unitPrice}
                  onChange={(e) =>
                    updateItem(item.key, { unitPrice: Number(e.target.value) })
                  }
                  required
                />
              </div>
              <div className="w-24 text-sm pb-2">
                {(item.quantity * item.unitPrice).toFixed(2)}
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                disabled={items.length === 1}
                onClick={() => removeItem(item.key)}
              >
                <Trash2 className="size-4" />
              </Button>
            </div>
          ))}

          <Button type="button" variant="outline" size="sm" onClick={addItem}>
            + Add line item
          </Button>

          <div className="flex justify-end gap-6 pt-4 border-t">
            <div className="space-y-1 w-32">
              <Label className="text-xs">Discount</Label>
              <Input
                type="number"
                min={0}
                step="0.01"
                value={discount}
                onChange={(e) => setDiscount(Number(e.target.value))}
              />
            </div>
            <div className="space-y-1 w-32">
              <Label className="text-xs">Tax</Label>
              <Input
                type="number"
                min={0}
                step="0.01"
                value={tax}
                onChange={(e) => setTax(Number(e.target.value))}
              />
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">
                Subtotal: {subtotal.toFixed(2)}
              </p>
              <p className="font-semibold">Total: {total.toFixed(2)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Button
        type="submit"
        className="mt-4"
        disabled={createProposal.isPending}
      >
        {createProposal.isPending ? "Creating..." : "Create Proposal"}
      </Button>
    </form>
  );
}
