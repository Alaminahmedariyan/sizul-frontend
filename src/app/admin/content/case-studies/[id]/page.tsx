"use client";

import { useParams } from "next/navigation";
import { useState } from "react";
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

import { useUploadMedia } from "@/hooks/use-media";
import { useCaseStudyForManage, useUpdateCaseStudy, useUpdateCaseStudyStatus } from "@/hooks/use-case-studies";
import { ContentStatus } from "@/lib/api/testimonials";

const STATUS_OPTIONS: ContentStatus[] = ["DRAFT", "PUBLISHED", "ARCHIVED"];

export default function CaseStudyDetailPage() {
	const { id } = useParams<{ id: string }>();

	const { data: itemRes, isLoading } = useCaseStudyForManage(id);
	const updateCaseStudy = useUpdateCaseStudy(id);
	const updateStatus = useUpdateCaseStudyStatus(id);
	const uploadMedia = useUploadMedia();

	const [clientName, setClientName] = useState<string | null>(null);
	const [industry, setIndustry] = useState<string | null>(null);
	const [location, setLocation] = useState<string | null>(null);
	const [problem, setProblem] = useState<string | null>(null);
	const [strategy, setStrategy] = useState<string | null>(null);
	const [implementation, setImplementation] = useState<string | null>(null);
	const [results, setResults] = useState<string | null>(null);
	const [seoTitle, setSeoTitle] = useState<string | null>(null);
	const [seoDescription, setSeoDescription] = useState<string | null>(null);
	const [isFeatured, setIsFeatured] = useState<boolean | null>(null);
	const [status, setStatus] = useState<ContentStatus | null>(null);
	const [isUploadingCover, setIsUploadingCover] = useState(false);

	if (isLoading) return <p className="text-muted-foreground">Loading case study...</p>;

	const item = itemRes?.data;
	if (!item) return <p className="text-muted-foreground">Case study not found.</p>;

	const v = {
		clientName: clientName ?? item.clientName ?? "",
		industry: industry ?? item.industry ?? "",
		location: location ?? item.location ?? "",
		problem: problem ?? item.problem ?? "",
		strategy: strategy ?? item.strategy ?? "",
		implementation: implementation ?? item.implementation ?? "",
		results: results ?? item.results ?? "",
		seoTitle: seoTitle ?? item.seoTitle ?? "",
		seoDescription: seoDescription ?? item.seoDescription ?? "",
		isFeatured: isFeatured ?? item.isFeatured,
		status: status ?? item.status,
	};

	const isSaving = updateCaseStudy.isPending || updateStatus.isPending;

	const handleSaveAll = async () => {
		try {
			await updateCaseStudy.mutateAsync({
				clientName: v.clientName || null,
				industry: v.industry || null,
				location: v.location || null,
				problem: v.problem || null,
				strategy: v.strategy || null,
				implementation: v.implementation || null,
				results: v.results || null,
				seoTitle: v.seoTitle || null,
				seoDescription: v.seoDescription || null,
				isFeatured: v.isFeatured,
			});

			if (v.status !== item.status) {
				await updateStatus.mutateAsync(v.status);
			}

			toast.success("Changes saved");
			setClientName(null);
			setIndustry(null);
			setLocation(null);
			setProblem(null);
			setStrategy(null);
			setImplementation(null);
			setResults(null);
			setSeoTitle(null);
			setSeoDescription(null);
			setIsFeatured(null);
			setStatus(null);
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Failed to save changes");
		}
	};

	const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;

		setIsUploadingCover(true);
		try {
			const res = await uploadMedia.mutateAsync({ file });
			await updateCaseStudy.mutateAsync({ coverImage: res.data.url });
			toast.success("Cover image updated");
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Upload failed");
		} finally {
			setIsUploadingCover(false);
			e.target.value = "";
		}
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

			<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
				<div className="md:col-span-2 space-y-4">
					<Card>
						<CardHeader>
							<CardTitle>Overview</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="grid grid-cols-2 gap-3">
								<div className="space-y-1">
									<Label>Client Name</Label>
									<Input value={v.clientName} onChange={(e) => setClientName(e.target.value)} />
								</div>
								<div className="space-y-1">
									<Label>Industry</Label>
									<Input value={v.industry} onChange={(e) => setIndustry(e.target.value)} />
								</div>
							</div>
							<div className="space-y-1">
								<Label>Location</Label>
								<Input value={v.location} onChange={(e) => setLocation(e.target.value)} />
							</div>

							<div className="space-y-1">
								<Label>Cover Image</Label>
								{item.coverImage && (
									// eslint-disable-next-line @next/next/no-img-element
									<img src={item.coverImage} alt={item.title} className="w-full h-40 object-cover rounded-md mb-2" />
								)}
								<Input type="file" accept="image/*" onChange={handleCoverUpload} disabled={isUploadingCover} />
							</div>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle>Problem</CardTitle>
						</CardHeader>
						<CardContent>
							<Textarea value={v.problem} onChange={(e) => setProblem(e.target.value)} rows={4} />
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle>Strategy</CardTitle>
						</CardHeader>
						<CardContent>
							<Textarea value={v.strategy} onChange={(e) => setStrategy(e.target.value)} rows={4} />
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle>Implementation</CardTitle>
						</CardHeader>
						<CardContent>
							<Textarea value={v.implementation} onChange={(e) => setImplementation(e.target.value)} rows={4} />
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle>Results</CardTitle>
						</CardHeader>
						<CardContent>
							<Textarea value={v.results} onChange={(e) => setResults(e.target.value)} rows={4} />
						</CardContent>
					</Card>
				</div>

				<div className="space-y-4">
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

					<Card>
						<CardHeader>
							<CardTitle>SEO</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="space-y-1">
								<Label>SEO Title</Label>
								<Input value={v.seoTitle} onChange={(e) => setSeoTitle(e.target.value)} />
							</div>
							<div className="space-y-1">
								<Label>SEO Description</Label>
								<Textarea value={v.seoDescription} onChange={(e) => setSeoDescription(e.target.value)} rows={3} />
							</div>
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
}