"use client";

import { useState, useEffect } from "react";
import { useIdentities } from "@/lib/hooks/useData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  UserCircle,
  Plus,
  Mail,
  Server,
  Send,
  Flame,
  Pencil,
  Trash2,
  CheckCircle,
  Pause,
  Shield,
} from "lucide-react";

const STATUS_CONFIG: Record<
  string,
  { label: string; variant: "default" | "secondary" | "outline"; iconColor: string }
> = {
  active: { label: "Activo", variant: "default", iconColor: "text-green-600 dark:text-green-400" },
  paused: { label: "Pausado", variant: "secondary", iconColor: "text-amber-600 dark:text-amber-400" },
  warming_up: { label: "Calentando", variant: "outline", iconColor: "text-blue-600 dark:text-blue-400" },
  warming: { label: "Calentando", variant: "outline", iconColor: "text-blue-600 dark:text-blue-400" },
};

const WARMUP_COLOR = (progress: number) => {
  if (progress >= 80) return "text-green-600 dark:text-green-400";
  if (progress >= 50) return "text-amber-600 dark:text-amber-400";
  return "text-orange-600 dark:text-orange-400";
};

const USAGE_COLOR = (ratio: number) => {
  if (ratio >= 0.9) return "text-red-600 dark:text-red-400";
  if (ratio >= 0.7) return "text-amber-600 dark:text-amber-400";
  return "text-muted-foreground";
};

interface IdentityFormData {
  name: string;
  email: string;
  smtpHost: string;
  smtpPort: number;
  dailyLimit: number;
  warmupEnabled: boolean;
}

const EMPTY_FORM: IdentityFormData = {
  name: "",
  email: "",
  smtpHost: "",
  smtpPort: 587,
  dailyLimit: 50,
  warmupEnabled: true,
};

export default function Identities() {
  const { data: identitiesData = [] } = useIdentities() as { data: any[] };
  const [identityList, setIdentityList] = useState<any[]>([]);
  useEffect(() => { if (identitiesData.length > 0 && identityList.length === 0) setIdentityList(identitiesData); }, [identitiesData]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<IdentityFormData>(EMPTY_FORM);

  const activeCount = identityList.filter((i) => i.status === "active").length;
  const totalSentToday = identityList.reduce((sum, i) => sum + i.sentToday, 0);
  const totalDailyLimit = identityList.reduce((sum, i) => sum + i.dailyLimit, 0);

  const openAdd = () => {
    setEditingId(null);
    setFormData(EMPTY_FORM);
    setDialogOpen(true);
  };

  const openEdit = (identity: Identity) => {
    setEditingId(identity.id);
    setFormData({
      name: identity.name,
      email: identity.email,
      smtpHost: identity.smtpHost,
      smtpPort: identity.smtpPort,
      dailyLimit: identity.dailyLimit,
      warmupEnabled: identity.warmupEnabled,
    });
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (editingId) {
      setIdentityList((prev) =>
        prev.map((i) =>
          i.id === editingId ? { ...i, ...formData } : i
        )
      );
    } else {
      const newIdentity: Identity = {
        id: `id-${Date.now()}`,
        ...formData,
        sentToday: 0,
        warmupProgress: formData.warmupEnabled ? 0 : 100,
        status: formData.warmupEnabled ? "warming_up" : "active",
        createdAt: new Date().toISOString(),
      };
      setIdentityList((prev) => [...prev, newIdentity]);
    }
    setDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    setIdentityList((prev) => prev.filter((i) => i.id !== id));
  };

  return (
    <div className="flex flex-col h-full overflow-auto">
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-semibold" data-testid="text-identities-title">
              Identidades
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Gestiona tus cuentas de envío y configuración SMTP
            </p>
          </div>
          <Button onClick={openAdd} data-testid="button-add-identity">
            <Plus className="w-4 h-4 mr-2" />
            Añadir Identidad
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Identidades Activas</CardTitle>
              <CheckCircle className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" data-testid="text-active-identities">
                {activeCount}
              </div>
              <p className="text-xs text-muted-foreground">
                de {identityList.length} total
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Enviados Hoy</CardTitle>
              <Send className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" data-testid="text-sent-today">
                {totalSentToday}
              </div>
              <p className="text-xs text-muted-foreground">
                de {totalDailyLimit} límite diario
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Warmup Promedio</CardTitle>
              <Flame className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" data-testid="text-warmup-avg">
                {identityList.length > 0
                  ? Math.round(
                      identityList.reduce((sum, i) => sum + i.warmupProgress, 0) /
                        identityList.length
                    )
                  : 0}
                %
              </div>
              <p className="text-xs text-muted-foreground">promedio de calentamiento</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {identityList.map((identity) => {
            const usageRatio = identity.sentToday / identity.dailyLimit;
            const usagePercent = Math.min(usageRatio * 100, 100);

            return (
              <Card key={identity.id} data-testid={`card-identity-${identity.id}`}>
                <CardHeader className="flex flex-row items-start justify-between gap-2 space-y-0 pb-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="flex items-center justify-center w-10 h-10 rounded-md bg-muted shrink-0">
                      <UserCircle className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <div className="min-w-0">
                      <CardTitle className="text-base font-semibold truncate" data-testid={`text-identity-name-${identity.id}`}>
                        {identity.name}
                      </CardTitle>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <Mail className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                        <span className="text-sm text-muted-foreground truncate" data-testid={`text-identity-email-${identity.id}`}>
                          {identity.email}
                        </span>
                      </div>
                    </div>
                  </div>
                  <Badge
                    variant={(STATUS_CONFIG[identity.status] || STATUS_CONFIG.active).variant}
                    className="shrink-0"
                    data-testid={`badge-identity-status-${identity.id}`}
                  >
                    {identity.status === "active" && <CheckCircle className="w-3 h-3 mr-1" />}
                    {identity.status === "paused" && <Pause className="w-3 h-3 mr-1" />}
                    {identity.status === "warming_up" && <Flame className="w-3 h-3 mr-1" />}
                    {(STATUS_CONFIG[identity.status] || STATUS_CONFIG.active).label}
                  </Badge>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Server className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">
                      {identity.smtpHost}:{identity.smtpPort}
                    </span>
                    <Shield className={`w-3.5 h-3.5 shrink-0 ml-auto ${(STATUS_CONFIG[identity.status] || STATUS_CONFIG.active).iconColor}`} />
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between gap-2 text-sm">
                      <div className="flex items-center gap-1.5">
                        <Send className="w-3.5 h-3.5 text-muted-foreground" />
                        <span className="font-medium">Enviados hoy</span>
                      </div>
                      <span className={`font-medium ${USAGE_COLOR(usageRatio)}`}>
                        {identity.sentToday} / {identity.dailyLimit}
                      </span>
                    </div>
                    <Progress
                      value={usagePercent}
                      className="h-2"
                      data-testid={`progress-daily-usage-${identity.id}`}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between gap-2 text-sm">
                      <div className="flex items-center gap-1.5">
                        <Flame className={`w-3.5 h-3.5 ${WARMUP_COLOR(identity.warmupProgress)}`} />
                        <span className="font-medium">Warmup</span>
                      </div>
                      <span className={`font-medium ${WARMUP_COLOR(identity.warmupProgress)}`}>
                        {identity.warmupProgress}%
                      </span>
                    </div>
                    <Progress
                      value={identity.warmupProgress}
                      className="h-2"
                      data-testid={`progress-warmup-${identity.id}`}
                    />
                  </div>

                  <div className="flex items-center justify-end gap-1 pt-1 border-t">
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => openEdit(identity)}
                      data-testid={`button-edit-identity-${identity.id}`}
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleDelete(identity.id)}
                      data-testid={`button-delete-identity-${identity.id}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {identityList.length === 0 && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <UserCircle className="w-10 h-10 mb-3" />
              <p className="text-sm">No hay identidades configuradas. Añade una para empezar a enviar.</p>
            </CardContent>
          </Card>
        )}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent data-testid="dialog-identity-form">
          <DialogHeader>
            <DialogTitle>
              {editingId ? "Editar Identidad" : "Añadir Identidad"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="identity-name">Nombre</Label>
              <Input
                id="identity-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ej: Equipo Ventas"
                data-testid="input-identity-name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="identity-email">Email</Label>
              <Input
                id="identity-email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="ventas@tuempresa.com"
                data-testid="input-identity-email"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="identity-smtp-host">SMTP Host</Label>
                <Input
                  id="identity-smtp-host"
                  value={formData.smtpHost}
                  onChange={(e) => setFormData({ ...formData, smtpHost: e.target.value })}
                  placeholder="smtp.ejemplo.com"
                  data-testid="input-identity-smtp-host"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="identity-smtp-port">Puerto SMTP</Label>
                <Input
                  id="identity-smtp-port"
                  type="number"
                  value={formData.smtpPort}
                  onChange={(e) =>
                    setFormData({ ...formData, smtpPort: parseInt(e.target.value) || 587 })
                  }
                  data-testid="input-identity-smtp-port"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="identity-daily-limit">Límite diario de envíos</Label>
              <Input
                id="identity-daily-limit"
                type="number"
                value={formData.dailyLimit}
                onChange={(e) =>
                  setFormData({ ...formData, dailyLimit: parseInt(e.target.value) || 50 })
                }
                data-testid="input-identity-daily-limit"
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="identity-warmup">Activar Warmup</Label>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Calienta gradualmente la cuenta para mejor deliverability
                </p>
              </div>
              <Switch
                id="identity-warmup"
                checked={formData.warmupEnabled}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, warmupEnabled: checked })
                }
                data-testid="switch-identity-warmup"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)} data-testid="button-cancel-identity">
              Cancelar
            </Button>
            <Button
              onClick={handleSave}
              disabled={!formData.name || !formData.email || !formData.smtpHost}
              data-testid="button-save-identity"
            >
              {editingId ? "Guardar Cambios" : "Añadir"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
