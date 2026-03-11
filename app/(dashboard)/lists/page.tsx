"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import {
  List,
  Plus,
  Search,
  Upload,
  Bot,
  Users,
  ArrowLeft,
  MoreHorizontal,
  Sparkles,
  Send,
  Download,
  Calendar,
  Linkedin,
  Building2,
  Trash2,
} from "lucide-react";
import { leads, type ProspectList } from "@/lib/mockData";
import { useLists, isDynamicList, type DynamicList, type ApolloContact } from "@/lib/listsStore";
import { useToast } from "@/lib/use-toast";

const SOURCE_CONFIG: Record<string, { label: string; variant: "default" | "secondary" | "outline"; className: string }> = {
  search: { label: "Búsqueda", variant: "secondary", className: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300" },
  import: { label: "Importado", variant: "secondary", className: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300" },
  ai: { label: "IA", variant: "secondary", className: "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300" },
  manual: { label: "Manual", variant: "secondary", className: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300" },
};

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function ListCard({
  list,
  onClick,
  onDelete,
  isDynamic,
}: {
  list: ProspectList | DynamicList;
  onClick: () => void;
  onDelete?: () => void;
  isDynamic: boolean;
}) {
  const sourceConfig = SOURCE_CONFIG[list.source] || SOURCE_CONFIG.manual;

  return (
    <Card
      className="hover-elevate active-elevate-2 cursor-pointer group relative"
      onClick={onClick}
      data-testid={`card-list-${list.id}`}
    >
      <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
        <div className="flex items-center gap-2 min-w-0">
          <div className="flex items-center justify-center w-9 h-9 rounded-md bg-primary/10 shrink-0">
            <List className="w-4 h-4 text-primary" />
          </div>
          <CardTitle className="text-sm font-medium truncate">
            {list.name}
          </CardTitle>
        </div>
        <div className="flex items-center gap-1.5">
          <Badge variant={sourceConfig.variant} className={sourceConfig.className} data-testid={`badge-source-${list.id}`}>
            {sourceConfig.label}
          </Badge>
          {isDynamic && onDelete && (
            <Button
              variant="ghost"
              size="icon"
              className="w-7 h-7 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={(e) => { e.stopPropagation(); onDelete(); }}
              data-testid={`button-delete-list-${list.id}`}
            >
              <Trash2 className="w-3.5 h-3.5 text-muted-foreground" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Users className="w-3.5 h-3.5" />
            <span data-testid={`text-count-${list.id}`}>
              {list.contactCount} contactos
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Calendar className="w-3 h-3" />
            <span>{formatDate(list.createdAt)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function DynamicListDetailView({
  list,
  onBack,
}: {
  list: DynamicList;
  onBack: () => void;
}) {
  const { removeContactFromList } = useLists();
  const { toast } = useToast();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const filteredContacts = list.contacts.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const allSelected =
    filteredContacts.length > 0 &&
    filteredContacts.every((c) => selectedIds.has(c.id));

  function toggleAll() {
    if (allSelected) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredContacts.map((c) => c.id)));
    }
  }

  function toggleOne(id: string) {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedIds(next);
  }

  const sourceConfig = SOURCE_CONFIG[list.source] || SOURCE_CONFIG.manual;

  return (
    <div className="flex flex-col gap-4 h-full">
      <div className="flex items-center gap-3 flex-wrap">
        <Button
          variant="ghost"
          size="icon"
          onClick={onBack}
          data-testid="button-back-lists"
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div className="flex items-center gap-2 min-w-0">
          <h2 className="text-lg font-semibold truncate" data-testid="text-list-name">
            {list.name}
          </h2>
          <Badge variant={sourceConfig.variant} className={sourceConfig.className}>
            {sourceConfig.label}
          </Badge>
        </div>
        <span className="text-sm text-muted-foreground">
          {list.contactCount} contactos
        </span>
      </div>

      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar contactos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
            data-testid="input-search-contacts"
          />
        </div>

        {selectedIds.size > 0 && (
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm text-muted-foreground">
              {selectedIds.size} seleccionados
            </span>
            <Button
              size="sm"
              data-testid="button-enrich-all"
              onClick={() => toast({ title: "Enriquecimiento", description: `${selectedIds.size} contactos en cola de enriquecimiento. Requiere créditos de Apollo.` })}
            >
              <Sparkles className="w-3.5 h-3.5 mr-1.5" />
              Enriquecer
            </Button>
            <Button
              size="sm"
              variant="outline"
              data-testid="button-add-campaign"
              onClick={() => { router.push("/campaigns"); toast({ title: "Campaña", description: `${selectedIds.size} contactos listos para añadir a una campaña` }); }}
            >
              <Send className="w-3.5 h-3.5 mr-1.5" />
              Campaña
            </Button>
            <Button
              size="sm"
              variant="outline"
              data-testid="button-export"
              onClick={() => {
                const selected = list.contacts.filter((c) => selectedIds.has(c.id));
                const csv = ["Nombre,Cargo,Empresa,Email,Teléfono,País,LinkedIn"]
                  .concat(selected.map((c) => `"${c.name}","${c.title}","${c.company}","${c.email}","${c.phone}","${c.country}","${c.linkedin_url}"`))
                  .join("\n");
                const blob = new Blob([csv], { type: "text/csv" });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = `${list.name}.csv`;
                a.click();
                URL.revokeObjectURL(url);
                toast({ title: "Exportado", description: `${selected.length} contactos exportados a CSV` });
              }}
            >
              <Download className="w-3.5 h-3.5 mr-1.5" />
              Exportar
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="text-destructive hover:text-destructive"
              data-testid="button-remove-selected"
              onClick={() => {
                selectedIds.forEach((id) => removeContactFromList(list.id, id));
                toast({ title: "Eliminados", description: `${selectedIds.size} contactos eliminados de la lista` });
                setSelectedIds(new Set());
              }}
            >
              <Trash2 className="w-3.5 h-3.5 mr-1.5" />
              Eliminar
            </Button>
          </div>
        )}
      </div>

      <Card>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-10">
                  <Checkbox
                    checked={allSelected}
                    onCheckedChange={toggleAll}
                    data-testid="checkbox-select-all"
                  />
                </TableHead>
                <TableHead>Nombre</TableHead>
                <TableHead>Cargo</TableHead>
                <TableHead>Empresa</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Teléfono</TableHead>
                <TableHead>País</TableHead>
                <TableHead>LinkedIn</TableHead>
                <TableHead className="w-10"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredContacts.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={9}
                    className="text-center text-muted-foreground py-8"
                  >
                    No se encontraron contactos
                  </TableCell>
                </TableRow>
              ) : (
                filteredContacts.map((contact) => (
                  <TableRow
                    key={contact.id}
                    data-testid={`row-contact-${contact.id}`}
                    className={selectedIds.has(contact.id) ? "bg-primary/5" : ""}
                  >
                    <TableCell>
                      <Checkbox
                        checked={selectedIds.has(contact.id)}
                        onCheckedChange={() => toggleOne(contact.id)}
                        data-testid={`checkbox-contact-${contact.id}`}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-muted flex items-center justify-center text-[10px] font-medium text-muted-foreground flex-shrink-0">
                          {contact.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
                        </div>
                        <span className="font-medium" data-testid={`text-name-${contact.id}`}>
                          {contact.name}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {contact.title}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Building2 className="w-3 h-3 text-muted-foreground" />
                        <span>{contact.company}</span>
                      </div>
                      {contact.industry && (
                        <span className="text-[11px] text-muted-foreground">{contact.industry}</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {contact.email ? (
                        <span className="text-sm">{contact.email}</span>
                      ) : (
                        <Badge variant="secondary" className="text-[10px]">
                          {contact.email_status === "available" ? "Disponible" : "No disponible"}
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {contact.phone || "-"}
                    </TableCell>
                    <TableCell>{contact.country || contact.city || "-"}</TableCell>
                    <TableCell>
                      {contact.linkedin_url ? (
                        <a
                          href={contact.linkedin_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 dark:text-blue-400 hover:underline"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Linkedin className="w-4 h-4" />
                        </a>
                      ) : (
                        <span className="text-xs text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            data-testid={`button-actions-${contact.id}`}
                          >
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => toast({ title: "Enriquecimiento", description: `"${contact.name}" en cola de enriquecimiento. Requiere créditos de Apollo.` })}
                          >
                            Enriquecer
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => { router.push("/campaigns"); toast({ title: "Campaña", description: `"${contact.name}" listo para añadir a una campaña` }); }}
                          >
                            Añadir a campaña
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-destructive focus:text-destructive"
                            onClick={() => {
                              removeContactFromList(list.id, contact.id);
                              toast({ title: "Eliminado", description: `"${contact.name}" eliminado de la lista` });
                            }}
                          >
                            Eliminar de lista
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}

function MockListDetailView({
  list,
  onBack,
}: {
  list: ProspectList;
  onBack: () => void;
}) {
  const { toast } = useToast();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [removedIds, setRemovedIds] = useState<Set<string>>(new Set());

  const contactsInList = leads.filter((l) => list.contactIds.includes(l.id) && !removedIds.has(l.id));
  const filteredContacts = contactsInList.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const allSelected =
    filteredContacts.length > 0 &&
    filteredContacts.every((c) => selectedIds.has(c.id));

  function toggleAll() {
    if (allSelected) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredContacts.map((c) => c.id)));
    }
  }

  function toggleOne(id: string) {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedIds(next);
  }

  const sourceConfig = SOURCE_CONFIG[list.source] || SOURCE_CONFIG.manual;

  return (
    <div className="flex flex-col gap-4 h-full">
      <div className="flex items-center gap-3 flex-wrap">
        <Button
          variant="ghost"
          size="icon"
          onClick={onBack}
          data-testid="button-back-lists"
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div className="flex items-center gap-2 min-w-0">
          <h2 className="text-lg font-semibold truncate" data-testid="text-list-name">
            {list.name}
          </h2>
          <Badge variant={sourceConfig.variant} className={sourceConfig.className}>
            {sourceConfig.label}
          </Badge>
        </div>
        <span className="text-sm text-muted-foreground">
          {list.contactCount} contactos
        </span>
      </div>

      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar contactos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
            data-testid="input-search-contacts"
          />
        </div>

        {selectedIds.size > 0 && (
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm text-muted-foreground">
              {selectedIds.size} seleccionados
            </span>
            <Button
              size="sm"
              data-testid="button-enrich-all"
              onClick={() => toast({ title: "Enriquecimiento", description: `${selectedIds.size} contactos en cola de enriquecimiento` })}
            >
              <Sparkles className="w-3.5 h-3.5 mr-1.5" />
              Enriquecer
            </Button>
            <Button
              size="sm"
              variant="outline"
              data-testid="button-add-campaign"
              onClick={() => { router.push("/campaigns"); toast({ title: "Campaña", description: `${selectedIds.size} contactos listos para añadir a una campaña` }); }}
            >
              <Send className="w-3.5 h-3.5 mr-1.5" />
              Campaña
            </Button>
            <Button
              size="sm"
              variant="outline"
              data-testid="button-export"
              onClick={() => {
                const selected = contactsInList.filter((c) => selectedIds.has(c.id));
                const csv = ["Nombre,Cargo,Empresa,Email,Teléfono,País"]
                  .concat(selected.map((c) => `"${c.name}","${c.title}","${c.company}","${c.email}","${c.phone}","${c.country}"`))
                  .join("\n");
                const blob = new Blob([csv], { type: "text/csv" });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = `${list.name}.csv`;
                a.click();
                URL.revokeObjectURL(url);
                toast({ title: "Exportado", description: `${selected.length} contactos exportados a CSV` });
              }}
            >
              <Download className="w-3.5 h-3.5 mr-1.5" />
              Exportar
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="text-destructive hover:text-destructive"
              data-testid="button-remove-selected"
              onClick={() => {
                setRemovedIds((prev) => { const next = new Set(prev); selectedIds.forEach((id) => next.add(id)); return next; });
                toast({ title: "Eliminados", description: `${selectedIds.size} contactos eliminados de la lista` });
                setSelectedIds(new Set());
              }}
            >
              <Trash2 className="w-3.5 h-3.5 mr-1.5" />
              Eliminar
            </Button>
          </div>
        )}
      </div>

      <Card>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-10">
                  <Checkbox
                    checked={allSelected}
                    onCheckedChange={toggleAll}
                    data-testid="checkbox-select-all"
                  />
                </TableHead>
                <TableHead>Nombre</TableHead>
                <TableHead>Cargo</TableHead>
                <TableHead>Empresa</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>País</TableHead>
                <TableHead>Score</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="w-10"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredContacts.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={9}
                    className="text-center text-muted-foreground py-8"
                  >
                    No se encontraron contactos
                  </TableCell>
                </TableRow>
              ) : (
                filteredContacts.map((contact) => (
                  <TableRow
                    key={contact.id}
                    data-testid={`row-contact-${contact.id}`}
                    className={selectedIds.has(contact.id) ? "bg-primary/5" : ""}
                  >
                    <TableCell>
                      <Checkbox
                        checked={selectedIds.has(contact.id)}
                        onCheckedChange={() => toggleOne(contact.id)}
                        data-testid={`checkbox-contact-${contact.id}`}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-muted flex items-center justify-center text-[10px] font-medium text-muted-foreground flex-shrink-0">
                          {contact.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
                        </div>
                        <span className="font-medium" data-testid={`text-name-${contact.id}`}>
                          {contact.name}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {contact.title}
                    </TableCell>
                    <TableCell>{contact.company}</TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {contact.email}
                    </TableCell>
                    <TableCell>{contact.country}</TableCell>
                    <TableCell>
                      <span className="font-medium">{contact.score}</span>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="text-xs">
                        {contact.status.replace("_", " ")}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            data-testid={`button-actions-${contact.id}`}
                          >
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => toast({ title: "Enriquecimiento", description: `"${contact.name}" en cola de enriquecimiento` })}
                          >
                            Enriquecer
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => { router.push("/campaigns"); toast({ title: "Campaña", description: `"${contact.name}" listo para añadir a una campaña` }); }}
                          >
                            Añadir a campaña
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-destructive focus:text-destructive"
                            onClick={() => {
                              setRemovedIds((prev) => { const next = new Set(prev); next.add(contact.id); return next; });
                              toast({ title: "Eliminado", description: `"${contact.name}" eliminado de la lista` });
                            }}
                          >
                            Eliminar de lista
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}

export default function ListsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { getAllLists, getDynamicList, removeList } = useLists();

  const [selectedListId, setSelectedListId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [createOpen, setCreateOpen] = useState(false);

  const allLists = getAllLists();
  const filteredLists = allLists.filter((l) =>
    l.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (selectedListId) {
    const dynamicList = getDynamicList(selectedListId);
    if (dynamicList) {
      return (
        <div className="p-4 h-full overflow-auto">
          <DynamicListDetailView
            list={dynamicList}
            onBack={() => setSelectedListId(null)}
          />
        </div>
      );
    }

    const mockList = allLists.find((l) => l.id === selectedListId && "contactIds" in l) as ProspectList | undefined;
    if (mockList) {
      return (
        <div className="p-4 h-full overflow-auto">
          <MockListDetailView
            list={mockList}
            onBack={() => setSelectedListId(null)}
          />
        </div>
      );
    }

    setSelectedListId(null);
  }

  const handleDeleteList = (id: string, name: string) => {
    removeList(id);
    toast({
      title: "Lista eliminada",
      description: `"${name}" ha sido eliminada`,
    });
  };

  return (
    <div className="p-4 h-full overflow-auto">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div>
            <h1 className="text-xl font-semibold" data-testid="text-page-title">
              Listas
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              Gestiona tus listas de prospectos
            </p>
          </div>

          <Dialog open={createOpen} onOpenChange={setCreateOpen}>
            <DialogTrigger asChild>
              <Button data-testid="button-create-list">
                <Plus className="w-4 h-4 mr-1.5" />
                Nueva Lista
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Crear nueva lista</DialogTitle>
                <DialogDescription>
                  Elige cómo quieres crear tu nueva lista de prospectos
                </DialogDescription>
              </DialogHeader>
              <div className="flex flex-col gap-3 pt-2">
                <Button
                  variant="outline"
                  className="justify-start gap-3 h-auto py-3"
                  onClick={() => {
                    setCreateOpen(false);
                    router.push("/find");
                  }}
                  data-testid="button-create-search"
                >
                  <Search className="w-5 h-5 text-primary flex-shrink-0" />
                  <div className="text-left">
                    <div className="font-medium text-sm">Desde resultados de búsqueda</div>
                    <div className="text-xs text-muted-foreground">
                      Busca prospectos con Apollo y guárdalos como lista
                    </div>
                  </div>
                </Button>
                <Button
                  variant="outline"
                  className="justify-start gap-3 h-auto py-3"
                  onClick={() => {
                    setCreateOpen(false);
                    toast({
                      title: "Importar CSV",
                      description: "Funcionalidad próximamente disponible",
                    });
                  }}
                  data-testid="button-create-import"
                >
                  <Upload className="w-5 h-5 text-primary flex-shrink-0" />
                  <div className="text-left">
                    <div className="font-medium text-sm">Importar CSV</div>
                    <div className="text-xs text-muted-foreground">
                      Sube un archivo CSV con contactos
                    </div>
                  </div>
                </Button>
                <Button
                  variant="outline"
                  className="justify-start gap-3 h-auto py-3"
                  onClick={() => {
                    setCreateOpen(false);
                    toast({
                      title: "Recomendaciones IA",
                      description: "Funcionalidad próximamente disponible",
                    });
                  }}
                  data-testid="button-create-ai"
                >
                  <Bot className="w-5 h-5 text-primary flex-shrink-0" />
                  <div className="text-left">
                    <div className="font-medium text-sm">Recomendaciones IA</div>
                    <div className="text-xs text-muted-foreground">
                      Deja que la IA sugiera prospectos basados en tu ICP
                    </div>
                  </div>
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar listas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
            data-testid="input-search-lists"
          />
        </div>

        {filteredLists.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-muted-foreground gap-3">
            <List className="w-10 h-10" />
            <p className="text-sm">No se encontraron listas</p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push("/find")}
              data-testid="button-go-search"
            >
              <Search className="w-3.5 h-3.5 mr-1.5" />
              Ir a buscar prospectos
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {filteredLists.map((list) => {
              const dynamic = isDynamicList(list);
              return (
                <ListCard
                  key={list.id}
                  list={list}
                  isDynamic={dynamic}
                  onClick={() => setSelectedListId(list.id)}
                  onDelete={dynamic ? () => handleDeleteList(list.id, list.name) : undefined}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
