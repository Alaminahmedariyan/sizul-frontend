"use client";

import { useParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { SeoTabs } from "@/components/admin/seo-tabs";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  useTrackingConfig,
  useUpsertTrackingConfig,
} from "@/hooks/use-seo-tracking-config";

export default function SeoTrackingPage() {
  const { id } = useParams<{ id: string }>();

  const { data: configRes, isLoading } = useTrackingConfig(id);
  const upsertConfig = useUpsertTrackingConfig(id);

  const config = configRes?.data ?? null;

  const [ga4, setGa4] = useState(config?.ga4MeasurementId ?? "");
  const [gtm, setGtm] = useState(config?.gtmContainerId ?? "");
  const [pixel, setPixel] = useState(config?.metaPixelId ?? "");
  const [whatsapp, setWhatsapp] = useState(config?.whatsappNumber ?? "");

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    upsertConfig.mutate(
      {
        ga4MeasurementId: ga4 || undefined,
        gtmContainerId: gtm || undefined,
        metaPixelId: pixel || undefined,
        whatsappNumber: whatsapp || undefined,
      },
      {
        onSuccess: () => toast.success("Tracking config saved"),
        onError: (err) => toast.error(err.message),
      },
    );
  };

  return (
    <div>
      <PageHeader title="Tracking Configuration" />
      <SeoTabs projectId={id} />

      {isLoading && <p className="text-muted-foreground">Loading config...</p>}

      {!isLoading && (
        <Card>
          <CardHeader>
            <CardTitle>Analytics & Tracking IDs</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSave} className="space-y-4 max-w-md">
              <div className="space-y-1">
                <Label>GA4 Measurement ID</Label>
                <Input
                  value={ga4}
                  onChange={(e) => setGa4(e.target.value)}
                  placeholder="G-XXXXXXX"
                />
              </div>
              <div className="space-y-1">
                <Label>GTM Container ID</Label>
                <Input
                  value={gtm}
                  onChange={(e) => setGtm(e.target.value)}
                  placeholder="GTM-XXXXXXX"
                />
              </div>
              <div className="space-y-1">
                <Label>Meta Pixel ID</Label>
                <Input
                  value={pixel}
                  onChange={(e) => setPixel(e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <Label>WhatsApp Number</Label>
                <Input
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  placeholder="+8801700000000"
                />
              </div>
              <Button type="submit" disabled={upsertConfig.isPending}>
                Save
              </Button>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
