"use client";

import { Trash2 } from "lucide-react";
import { useParams } from "next/navigation";
import { useRef, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

import { PageHeader } from "@/components/shared/page-header";
import { StatusBadge } from "@/components/shared/status-badge";

import {
	useAddPortfolioImage,
	usePortfolioItemForManage,
	useRemovePortfolioImage,
	useUpdatePortfolio,
	useUpdatePortfolioStatus,
} from "@/hooks/use-portfolio";
import { ContentStatus } from "@/lib/api/testimonials";


const STATUS_OPTIONS: ContentStatus[] = ["DRAFT", "PUBLISHED", "ARCHIVED"];

/** Comma-separated input <-> string[] stored as JSON in the DB. */
function parseCommaList(value: string): string[] {
	return value
		.split(",")
		.map((s) => s.trim())
		.filter(Boolean);
}

export default function PortfolioDetailPage() {
	const { id } = useParams<{ id: string }>();

	const { data: itemRes, isLoading } = usePortfolioItemForManage(id);
	const updatePortfolio = useUpdatePortfolio(id);
	const updateStatus = useUpdatePortfolioStatus(id);
	const addImage = useAddPortfolioImage(id);
	const removeImage = useRemovePortfolioImage(id);

	// Local "draft" state for every editable field — nothing hits the API
	// until "Save Changes" is clicked.
	const [clientName, setClientName] = useState<string | null>(null);
	const [industry, setIndustry] = useState<string | null>(null);
	const [location, setLocation] = useState<string | null>(null);
	const [websiteUrl, setWebsiteUrl] = useState<string | null>(null);
	const [duration, setDuration] = useState<string | null>(null);
	const [description, setDescription] = useState<string | null>(null);
	const [technologiesText, setTechnologiesText] = useState<string | null>(null);
	const [resultsText, setResultsText] = useState<string | null>(null);
	const [seoTitle, setSeoTitle] = useState<string | null>(null);
	const [seoDescription, setSeoDescription] = useState<string | null>(null);
	const [isFeatured, setIsFeatured] = useState<boolean | null>(null);
	const [status, setStatus] = useState<ContentStatus | null>(null);

	const [altText, setAltText] = useState("");
	const fileInputRef = useRef<HTMLInputElement>(null);

	if (isLoading) return <p className="text-muted-foreground">Loading portfolio item...</p>;

	const item = itemRes?.data;
	if (!item) return <p className="text-muted-foreground">Portfolio item not found.</p>;

	const existingTechnologies = Array.isArray(item.technologies) ? (item.technologies as string[]).join(", ") : "";
	const existingResults = Array.isArray(item.results) ? (item.results as string[]).join(", ") : "";

	const clientNameValue = clientName ?? item.clientName ?? "";
	const industryValue = industry ?? item.industry ?? "";
	const locationValue = location ?? item.location ?? "";
	const websiteUrlValue = websiteUrl ?? item.websiteUrl ?? "";
	const durationValue = duration ?? item.duration ?? "";
	const descriptionValue = description ?? item.description ?? "";
	const technologiesValue = technologiesText ?? existingTechnologies;
	const resultsValue = resultsText ?? existingResults;
	const seoTitleValue = seoTitle ?? item.seoTitle ?? "";
	const seoDescriptionValue = seoDescription ?? item.seoDescription ?? "";
	const isFeaturedValue = isFeatured ?? item.isFeatured;
	const statusValue = status ?? item.status;

	const isSaving = updatePortfolio.isPending || updateStatus.isPending;

	const handleSaveAll = async () => {
		try {
			await updatePortfolio.mutateAsync({
				clientName: clientNameValue || null,
				industry: industryValue || null,
				location: locationValue || null,
				websiteUrl: websiteUrlValue || null,
				duration: durationValue || null,
				description: descriptionValue || null,
				technologies: parseCommaList(technologiesValue),
				results: parseCommaList(resultsValue),
				seoTitle: seoTitleValue || null,
				seoDescription: seoDescriptionValue || null,
				isFeatured: isFeaturedValue,
			});

			if (statusValue !== item.status) {
				await updateStatus.mutateAsync(statusValue);
			}

			toast.success("Changes saved");
			setClientName(null);
			setIndustry(null);
			setLocation(null);
			setWebsiteUrl(null);
			setDuration(null);
			setDescription(null);
			setTechnologiesText(null);
			setResultsText(null);
			setSeoTitle(null);
			setSeoDescription(null);
			setIsFeatured(null);
			setStatus(null);
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Failed to save changes");
		}
	};

	const handleAddImage = (e: React.FormEvent) => {
		e.preventDefault();
		const file = fileInputRef.current?.files?.[0];
		if (!file) {
			toast.error("Please choose an image file.");
			return;
		}

		addImage.mutate(
			{ file, altText: altText || undefined, order: item.images.length },
			{
				onSuccess: () => {
					setAltText("");
					if (fileInputRef.current) fileInputRef.current.value = "";
					toast.success("Image uploaded");
				},
				onError: (err) => toast.error(err.message),
			},
		);
	};

	return (
		<div>
			<PageHeader
				title={item.title}
				action={
					<div className="flex items-center gap-3">
						<StatusBadge status={item.status} />
						<Button disabled={isSaving} onClick={handleSaveAll}>
							{isSaving ? "Saving..." : "Save Changes"}
						</Button>
					</div>
				}
			/>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				<Card>
					<CardHeader>
						<CardTitle>Project Details</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="grid grid-cols-2 gap-3">
							<div className="space-y-1">
								<Label>Client Name</Label>
								<Input value={clientNameValue} onChange={(e) => setClientName(e.target.value)} placeholder="Rangs Electronics" />
							</div>
							<div className="space-y-1">
								<Label>Industry</Label>
								<Input value={industryValue} onChange={(e) => setIndustry(e.target.value)} placeholder="Electronics Retail" />
							</div>
						</div>

						<div className="grid grid-cols-2 gap-3">
							<div className="space-y-1">
								<Label>Location</Label>
								<Input value={locationValue} onChange={(e) => setLocation(e.target.value)} placeholder="Dhaka, Bangladesh" />
							</div>
							<div className="space-y-1">
								<Label>Duration</Label>
								<Input value={durationValue} onChange={(e) => setDuration(e.target.value)} placeholder="3 Months" />
							</div>
						</div>

						<div className="space-y-1">
							<Label>Website URL</Label>
							<Input value={websiteUrlValue} onChange={(e) => setWebsiteUrl(e.target.value)} placeholder="https://rangs.com" />
						</div>

						<div className="space-y-1">
							<Label>Description</Label>
							<Textarea value={descriptionValue} onChange={(e) => setDescription(e.target.value)} rows={5} />
						</div>

						<div className="space-y-1">
							<Label>Technologies (comma-separated)</Label>
							<Input
								value={technologiesValue}
								onChange={(e) => setTechnologiesText(e.target.value)}
								placeholder="Next.js, Node.js, PostgreSQL, Tailwind CSS, Stripe"
							/>
						</div>

						<div className="space-y-1">
							<Label>Results (comma-separated)</Label>
							<Input
								value={resultsValue}
								onChange={(e) => setResultsText(e.target.value)}
								placeholder="300% increase in sales, 50% faster page load"
							/>
						</div>
					</CardContent>
				</Card>

				<div className="space-y-4">
					<Card>
						<CardHeader>
							<CardTitle>Visibility</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="space-y-1">
								<Label>Status</Label>
								<Select value={statusValue} onValueChange={(v) => setStatus(v as ContentStatus)}>
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
								<Checkbox id="featured" checked={isFeaturedValue} onCheckedChange={(checked) => setIsFeatured(!!checked)} />
								<Label htmlFor="featured">Featured</Label>
							</div>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle>SEO</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="space-y-1">
								<Label>SEO Title</Label>
								<Input
									value={seoTitleValue}
									onChange={(e) => setSeoTitle(e.target.value)}
									placeholder="E-commerce Website Development for Rangs Electronics | Sizul"
								/>
							</div>
							<div className="space-y-1">
								<Label>SEO Description</Label>
								<Textarea
									value={seoDescriptionValue}
									onChange={(e) => setSeoDescription(e.target.value)}
									rows={3}
									placeholder="Shown in Google search results — keep it under 160 characters."
								/>
							</div>
						</CardContent>
					</Card>
				</div>
			</div>

			<Card className="mt-4">
				<CardHeader>
					<CardTitle>Images</CardTitle>
				</CardHeader>
				<CardContent>
					<form onSubmit={handleAddImage} className="flex gap-2 mb-4">
						<Input ref={fileInputRef} type="file" accept="image/*" required className="max-w-xs" />
						<Input placeholder="Alt text (optional)" value={altText} onChange={(e) => setAltText(e.target.value)} className="max-w-xs" />
						<Button type="submit" disabled={addImage.isPending}>
							{addImage.isPending ? "Uploading..." : "Upload"}
						</Button>
					</form>

					<div className="flex gap-3 flex-wrap">
						{item.images.map((image) => (
							<div key={image.id} className="relative">
								{/* eslint-disable-next-line @next/next/no-img-element */}
								<img src={image.url} alt={image.altText ?? ""} className="w-28 h-28 object-cover rounded-md" />
								<Button
									type="button"
									variant="destructive"
									size="icon"
									className="absolute top-1 right-1 size-6"
									onClick={() => removeImage.mutate(image.id)}
								>
									<Trash2 className="size-3" />
								</Button>
							</div>
						))}
					</div>
				</CardContent>
			</Card>
		</div>
	);
}