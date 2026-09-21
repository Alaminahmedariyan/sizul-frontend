"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
import { useCreateProject } from "@/hooks/use-projects";
import { useServices } from "@/hooks/use-service";

import type { ProjectStatus, ProjectType } from "@/lib/api/projects";

const PROJECT_TYPES: ProjectType[] = [
  "CLIENT_PROJECT",
  "INTERNAL_PROJECT",
  "RESEARCH",
  "MAINTENANCE",
];

const PROJECT_STATUSES: ProjectStatus[] = [
  "PLANNING",
  "IN_PROGRESS",
  "ON_HOLD",
  "REVIEW",
  "COMPLETED",
  "CANCELLED",
];

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function NewProjectPage() {
  const router = useRouter();
  const createProject = useCreateProject();

  const { data: clientsRes } = useClients({ limit: 100 });
  const { data: servicesRes } = useServices();
  const clients = clientsRes?.data ?? [];
  const services = servicesRes?.data ?? [];

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [clientId, setClientId] = useState("");
  const [serviceId, setServiceId] = useState("");
  const [projectType, setProjectType] = useState<ProjectType>("CLIENT_PROJECT");
  const [status, setStatus] = useState<ProjectStatus>("PLANNING");
  const [description, setDescription] = useState("");
  const [budget, setBudget] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [startDate, setStartDate] = useState("");
  const [deadline, setDeadline] = useState("");

  const [autoFilledSlug, setAutoFilledSlug] = useState("");

  // Auto-fill name + slug whenever client or service changes
  useEffect(() => {
    if (!clientId || !serviceId) return;

    const client = clients.find((c) => c.id === clientId);
    const service = services.find((s) => s.id === serviceId);
    if (!client || !service) return;

    const clientLabel = (client.company?.trim() || client.name || "").trim();
    const nextName = `${clientLabel} — ${service.name}`;
    const nextSlug = `${slugify(clientLabel)}-${service.slug}`;

    setName(nextName);
    setSlug(nextSlug);
    setAutoFilledSlug(nextSlug);
  }, [clientId, serviceId, clients, services]);

  function handleNameChange(value: string) {
    setName(value);
    // Only auto-update slug if it still matches the last auto-filled value
    if (!slug || slug === autoFilledSlug) {
      const next = slugify(value);
      setSlug(next);
      setAutoFilledSlug(next);
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Project name is required");
      return;
    }
    if (!slug.trim()) {
      toast.error("Slug is required");
      return;
    }
    if (projectType === "CLIENT_PROJECT" && !clientId) {
      toast.error("Please select a client");
      return;
    }
    if (projectType === "CLIENT_PROJECT" && !serviceId) {
      toast.error("Please select a service");
      return;
    }

    createProject.mutate(
      {
        name,
        slug,
        clientId: clientId || null,
        serviceId: serviceId || null,
        projectType,
        status,
        description: description || undefined,
        budget: budget || undefined,
        currency,
        startDate: startDate || undefined,
        deadline: deadline || undefined,
      },
      {
        onSuccess: (res) => {
          toast.success("Project created");
          router.push(`/admin/projects/${res.data.id}`);
        },
        onError: (err) => toast.error(err.message),
      },
    );
  }

  const showClientFields = projectType === "CLIENT_PROJECT";

  return (
    <div>
      <PageHeader
        title="New Project"
        description="Create a new project and assign it to a client"
      />

      <Card className="mt-6 max-w-3xl">
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            {/* Project type */}
            <div className="space-y-1.5">
              <Label htmlFor="type">Project type</Label>
              <Select
                value={projectType}
                onValueChange={(v) => setProjectType(v as ProjectType)}
              >
                <SelectTrigger id="type" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PROJECT_TYPES.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t.replace(/_/g, " ")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Client + Service (only for CLIENT_PROJECT) */}
            {showClientFields && (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="client">Client</Label>
                  <Select value={clientId} onValueChange={setClientId}>
                    <SelectTrigger id="client" className="w-full">
                      <SelectValue placeholder="Select a client" />
                    </SelectTrigger>
                    <SelectContent>
                      {clients.length === 0 && (
                        <SelectItem value="__none" disabled>
                          No clients yet
                        </SelectItem>
                      )}
                      {clients.map((c) => (
                        <SelectItem key={c.id} value={c.id}>
                          {c.name}
                          {c.company ? ` (${c.company})` : ""}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="service">Service</Label>
                  <Select value={serviceId} onValueChange={setServiceId}>
                    <SelectTrigger id="service" className="w-full">
                      <SelectValue placeholder="Select a service" />
                    </SelectTrigger>
                    <SelectContent>
                      {services.length === 0 && (
                        <SelectItem value="__none" disabled>
                          No services yet
                        </SelectItem>
                      )}
                      {services.map((s) => (
                        <SelectItem key={s.id} value={s.id}>
                          {s.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {/* Name + Slug */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="Project name"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="slug">Slug</Label>
                <Input
                  id="slug"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="project-slug"
                  required
                />
              </div>
            </div>

            {/* Status */}
            <div className="space-y-1.5">
              <Label htmlFor="status">Status</Label>
              <Select
                value={status}
                onValueChange={(v) => setStatus(v as ProjectStatus)}
              >
                <SelectTrigger id="status" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PROJECT_STATUSES.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s.replace(/_/g, " ")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the project scope, deliverables, and goals."
              />
            </div>

            {/* Budget + Currency */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="budget">Budget</Label>
                <Input
                  id="budget"
                  type="number"
                  min={0}
                  step="0.01"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  placeholder="500"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="currency">Currency</Label>
                <Input
                  id="currency"
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                />
              </div>
            </div>

            {/* Dates */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="startDate">Start date</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="deadline">Deadline</Label>
                <Input
                  id="deadline"
                  type="date"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                />
              </div>
            </div>

            {/* Submit */}
            <div className="flex gap-2 pt-2">
              <Button type="submit" disabled={createProject.isPending}>
                {createProject.isPending ? "Creating…" : "Create Project"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
