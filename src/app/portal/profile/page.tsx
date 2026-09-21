"use client";

import { useState } from "react";
import { toast } from "sonner";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { useMyClientProfile, useUpdateClient } from "@/hooks/use-clients";

export default function PortalProfilePage() {
  const { data: clientRes, isLoading } = useMyClientProfile();
  const client = clientRes?.data;

  const updateClient = useUpdateClient(client?.id ?? "");

  const [company, setCompany] = useState("");
  const [phone, setPhone] = useState("");

  if (isLoading)
    return <p className="text-muted-foreground">Loading profile...</p>;
  if (!client)
    return <p className="text-muted-foreground">Profile not found.</p>;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateClient.mutate(
      { company: company || undefined, phone: phone || undefined },
      {
        onSuccess: () => toast.success("Profile updated"),
        onError: (err) => toast.error(err.message),
      },
    );
  };

  return (
    <div>
      <PageHeader title="Your Profile" />

      <Card>
        <CardHeader>
          <CardTitle>Account Info</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
            <div className="space-y-1">
              <Label>Name</Label>
              <Input value={client.name} disabled />
            </div>

            <div className="space-y-1">
              <Label>Email</Label>
              <Input value={client.email} disabled />
            </div>

            <div className="space-y-1">
              <Label>Company</Label>
              <Input
                defaultValue={client.company ?? ""}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="Your company name"
              />
            </div>

            <div className="space-y-1">
              <Label>Phone</Label>
              <Input
                defaultValue={client.phone ?? ""}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Your phone number"
              />
            </div>

            <Button type="submit" disabled={updateClient.isPending}>
              Save Changes
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
