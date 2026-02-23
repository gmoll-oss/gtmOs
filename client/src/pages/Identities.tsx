import { useState } from "react";
import { identities, Identity } from "@/lib/mockData";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
} from "lucide-react";

const STATUS_CONFIG: Record<Identity["status"], { label: string; variant: "default" | "secondary" | "outline" }> = {
  active: { label: "Activo", variant: "default" },
  paused: { label: "Pausado", variant: "secondary" },
  warming_up: { label: "Calentando", variant: "outline" },
};

const WARMUP_COLOR = (progress: number) => {
  if (progress >= 80) return "text-green-600 dark:text-green-400";
  if (progress >= 50) return "text-amber-600 dark:text-amber-400";
  return "text-orange-600 dark:text-orange-400";
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
  const [identityList, setIdentityList] = useState<Identity[]>([...identities]);
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
          i.id === editingId
            ? { ...i, ...formData }
            : i
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
              <CardTitle className="text-sm font-medium">Warmup Progreso</CardTitle>
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

        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Identidad</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>SMTP</TableHead>
                  <TableHead className="text-center">Límite Diario</TableHead>
                  <TableHead className="text-center">Enviados Hoy</TableHead>
                  <TableHead>Warmup</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {identityList.map((identity) => (
                  <TableRow key={identity.id} data-testid={`row-identity-${identity.id}`}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <UserCircle className="w-5 h-5 text-muted-foreground" />
                        <span className="font-medium" data-testid={`text-identity-name-${identity.id}`}>
                          {identity.name}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5">
                        <Mail className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm" data-testid={`text-identity-email-${identity.id}`}>
                          {identity.email}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5">
                        <Server className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                          {identity.smtpHost}:{identity.smtpPort}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <span className="text-sm font-medium">{identity.dailyLimit}</span>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex flex-col items-center gap-1">
                        <span className="text-sm font-medium">
                          {identity.sentToday}
                        </span>
                        <Progress
                          value={(identity.sentToday / identity.dailyLimit) * 100}
                          className="w-16 h-1.5"
                        />
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1 min-w-[100px]">
                        <div className="flex items-center justify-between gap-2">
                          <Flame className={`w-4 h-4 ${WARMUP_COLOR(identity.warmupProgress)}`} />
                          <span className={`text-sm font-medium ${WARMUP_COLOR(identity.warmupProgress)}`}>
                            {identity.warmupProgress}%
                          </span>
                        </div>
                        <Progress
                          value={identity.warmupProgress}
                          className="h-1.5"
                        />
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={STATUS_CONFIG[identity.status].variant}
                        data-testid={`badge-identity-status-${identity.id}`}
                      >
                        {identity.status === "active" && <CheckCircle className="w-3 h-3 mr-1" />}
                        {identity.status === "paused" && <Pause className="w-3 h-3 mr-1" />}
                        {identity.status === "warming_up" && <Flame className="w-3 h-3 mr-1" />}
                        {STATUS_CONFIG[identity.status].label}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
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
                    </TableCell>
                  </TableRow>
                ))}
                {identityList.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-12 text-muted-foreground">
                      No hay identidades configuradas. Añade una para empezar a enviar.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
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
