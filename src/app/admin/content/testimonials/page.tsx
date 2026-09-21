"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { ContentTabs } from "@/components/admin/content-tabs";
import { DataTable, type Column } from "@/components/shared/data-table";
import { EmptyState } from "@/components/shared/empty-state";
import { PageHeader } from "@/components/shared/page-header";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import { useCreateTestimonial, useTestimonialsForManage } from "@/hooks/use-testimonials";

import type { Testimonial } from "@/lib/api/testimonials";

export default function ContentTestimonialsPage() {
	const router = useRouter();
	const { data, isLoading, isError, error } = useTestimonialsForManage();
	const createTestimonial = useCreateTestimonial();

	const [clientName, setClientName] = useState("");
	const [clientRole, setClientRole] = useState("");
	const [companyName, setCompanyName] = useState("");
	const [serviceName, setServiceName] = useState("");
	const [content, setContent] = useState("");
	const [rating, setRating] = useState(5);

	const testimonials = data?.data ?? [];

	const columns: Column<Testimonial>[] = [
		{ header: "Client", cell: (t) => <span className="font-medium">{t.clientName}</span> },
		{ header: "Company", cell: (t) => t.companyName ?? "-" },
		{ header: "Rating", cell: (t) => `${t.rating}★` },
		{ header: "Status", cell: (t) => <StatusBadge status={t.status} /> },
		{ header: "Featured", cell: (t) => (t.isFeatured ? "Yes" : "No") },
	];

	const handleCreate = (e: React.FormEvent) => {
		e.preventDefault();
		if (!clientName.trim() || !content.trim()) return;

		createTestimonial.mutate(
			{
				clientName,
				content,
				rating,
				clientRole: clientRole || undefined,
				companyName: companyName || undefined,
				serviceName: serviceName || undefined,
			},
			{
				onSuccess: () => {
					setClientName("");
					setClientRole("");
					setCompanyName("");
					setServiceName("");
					setContent("");
					setRating(5);
					toast.success("Testimonial added — click it below to add a photo");
				},
				onError: (err) => toast.error(err.message),
			},
		);
	};

	if (isError) return <p className="text-destructive text-sm">{error?.message}</p>;

	return (
		<div>
			<PageHeader title="Testimonials" description="Client testimonials shown on the public site" />
			<ContentTabs />

			<Card className="mb-4">
				<CardContent className="pt-6">
					<form onSubmit={handleCreate} className="space-y-3">
						<div className="grid grid-cols-1 md:grid-cols-3 gap-2">
							<Input placeholder="Client name" value={clientName} onChange={(e) => setClientName(e.target.value)} required />
							<Input placeholder="Role (e.g. CEO)" value={clientRole} onChange={(e) => setClientRole(e.target.value)} />
							<Input placeholder="Company name" value={companyName} onChange={(e) => setCompanyName(e.target.value)} />
						</div>
						<Input placeholder="Service used (optional)" value={serviceName} onChange={(e) => setServiceName(e.target.value)} />
						<Textarea placeholder="Testimonial content" value={content} onChange={(e) => setContent(e.target.value)} required />
						<div className="flex gap-2 items-center">
							<Input
								type="number"
								min={1}
								max={5}
								value={rating}
								onChange={(e) => setRating(Number(e.target.value))}
								className="w-20"
							/>
							<Button type="submit" disabled={createTestimonial.isPending}>
								Add testimonial
							</Button>
						</div>
					</form>
				</CardContent>
			</Card>

			{isLoading && <p className="text-muted-foreground">Loading testimonials...</p>}
			{!isLoading && testimonials.length === 0 && <EmptyState title="No testimonials yet" />}

			<DataTable
				columns={columns}
				data={testimonials}
				isLoading={false}
				emptyMessage="No testimonials found."
				getRowKey={(t) => t.id}
				onRowClick={(t) => router.push(`/admin/content/testimonials/${t.id}`)}
			/>
		</div>
	);
}