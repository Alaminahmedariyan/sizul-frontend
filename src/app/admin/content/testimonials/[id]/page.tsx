"use client";

import { useParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

import { PageHeader } from "@/components/shared/page-header";
import { StatusBadge } from "@/components/shared/status-badge";

import { useUploadMedia } from "@/hooks/use-media";
import { useTestimonialForManage, useUpdateTestimonial } from "@/hooks/use-testimonials";

import type { ContentStatus } from "@/lib/api/testimonials";

const STATUS_OPTIONS: ContentStatus[] = ["DRAFT", "PUBLISHED", "ARCHIVED"];

export default function TestimonialDetailPage() {
	const { id } = useParams<{ id: string }>();

	const { data: itemRes, isLoading } = useTestimonialForManage(id);
	const updateTestimonial = useUpdateTestimonial(id);
	const uploadMedia = useUploadMedia();

	const [clientName, setClientName] = useState<string | null>(null);
	const [clientRole, setClientRole] = useState<string | null>(null);
	const [companyName, setCompanyName] = useState<string | null>(null);
	const [serviceName, setServiceName] = useState<string | null>(null);
	const [content, setContent] = useState<string | null>(null);
	const [rating, setRating] = useState<number | null>(null);
	const [status, setStatus] = useState<ContentStatus | null>(null);
	const [isFeatured, setIsFeatured] = useState<boolean | null>(null);
	const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);

	if (isLoading) return <p className="text-muted-foreground">Loading testimonial...</p>;

	const item = itemRes?.data;
	if (!item) return <p className="text-muted-foreground">Testimonial not found.</p>;

	const v = {
		clientName: clientName ?? item.clientName,
		clientRole: clientRole ?? item.clientRole ?? "",
		companyName: companyName ?? item.companyName ?? "",
		serviceName: serviceName ?? item.serviceName ?? "",
		content: content ?? item.content,
		rating: rating ?? item.rating,
		status: status ?? item.status,
		isFeatured: isFeatured ?? item.isFeatured,
	};

	const handleSave = () => {
		updateTestimonial.mutate(
			{
				clientName: v.clientName,
				clientRole: v.clientRole || null,
				companyName: v.companyName || null,
				serviceName: v.serviceName || null,
				content: v.content,
				rating: v.rating,
				status: v.status,
				isFeatured: v.isFeatured,
			},
			{
				onSuccess: () => {
					toast.success("Changes saved");
					setClientName(null);
					setClientRole(null);
					setCompanyName(null);
					setServiceName(null);
					setContent(null);
					setRating(null);
					setStatus(null);
					setIsFeatured(null);
				},
				onError: (err) => toast.error(err.message),
			},
		);
	};

	const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;

		setIsUploadingPhoto(true);
		try {
			const res = await uploadMedia.mutateAsync({ file });
			await updateTestimonial.mutateAsync({ clientImage: res.data.url });
			toast.success("Photo updated");
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Upload failed");
		} finally {
			setIsUploadingPhoto(false);
			e.target.value = "";
		}
	};

	return (
		<div>
			<PageHeader
				title={item.clientName}
				action={
					<div className="flex items-center gap-3">
						<StatusBadge status={item.status} />
						<Button disabled={updateTestimonial.isPending} onClick={handleSave}>
							{updateTestimonial.isPending ? "Saving..." : "Save Changes"}
						</Button>
					</div>
				}
			/>

			<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
				<Card className="md:col-span-2">
					<CardHeader>
						<CardTitle>Details</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="flex items-center gap-4">
							<Avatar className="size-16">
								<AvatarImage src={item.clientImage ?? undefined} />
								<AvatarFallback>{item.clientName.charAt(0)}</AvatarFallback>
							</Avatar>
							<Input type="file" accept="image/*" onChange={handlePhotoUpload} disabled={isUploadingPhoto} className="max-w-xs" />
						</div>

						<div className="grid grid-cols-3 gap-3">
							<div className="space-y-1">
								<Label>Client Name</Label>
								<Input value={v.clientName} onChange={(e) => setClientName(e.target.value)} />
							</div>
							<div className="space-y-1">
								<Label>Role</Label>
								<Input value={v.clientRole} onChange={(e) => setClientRole(e.target.value)} placeholder="CEO" />
							</div>
							<div className="space-y-1">
								<Label>Company</Label>
								<Input value={v.companyName} onChange={(e) => setCompanyName(e.target.value)} />
							</div>
						</div>

						<div className="space-y-1">
							<Label>Service Used</Label>
							<Input value={v.serviceName} onChange={(e) => setServiceName(e.target.value)} placeholder="Web Development" />
						</div>

						<div className="space-y-1">
							<Label>Content</Label>
							<Textarea value={v.content} onChange={(e) => setContent(e.target.value)} rows={5} />
						</div>

						<div className="space-y-1">
							<Label>Rating (1-5)</Label>
							<Input type="number" min={1} max={5} value={v.rating} onChange={(e) => setRating(Number(e.target.value))} className="w-24" />
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Visibility</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="space-y-1">
							<Label>Status</Label>
							<Select value={v.status} onValueChange={(val) => setStatus(val as ContentStatus)}>
								<SelectTrigger>
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									{STATUS_OPTIONS.map((s) => (
										<SelectItem key={s} value={s}>
											{s}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
						<div className="flex items-center gap-2">
							<Checkbox id="featured" checked={v.isFeatured} onCheckedChange={(c) => setIsFeatured(!!c)} />
							<Label htmlFor="featured">Featured</Label>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}