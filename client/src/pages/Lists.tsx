import { useState } from "react";
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
} from "lucide-react";
import { prospectLists, leads, type ProspectList, type Lead } from "@/lib/mockData";

const SOURCE_CONFIG: Record<ProspectList["source"], { label: string; variant: "default" | "secondary" | "outline" }> = {
  search: { label: "Busqueda", variant: "secondary" },
  import: { label: "Importado", variant: "outline" },
  ai: { label: "IA", variant: "default" },
  manual: { label: "Manual", variant: "outline" },
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
}: {
  list: ProspectList;
  onClick: () => void;
}) {
  const sourceConfig = SOURCE_CONFIG[list.source];

  return (
    <Card
      className="hover-elevate active-elevate-2 cursor-pointer"
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
        <Badge variant={sourceConfig.variant} data-testid={`badge-source-${list.id}`}>
          {sourceConfig.label}
        </Badge>
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

function ListDetailView({
  list,
  onBack,
}: {
  list: ProspectList;
  onBack: () => void;
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const contactsInList = leads.filter((l) => list.contactIds.includes(l.id));
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
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    setSelectedIds(next);
  }

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
          <Badge variant={SOURCE_CONFIG[list.source].variant}>
            {SOURCE_CONFIG[list.source].label}
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
            <Button size="sm" data-testid="button-enrich-all">
              <Sparkles className="w-3.5 h-3.5 mr-1.5" />
              Enriquecer
            </Button>
            <Button size="sm" variant="outline" data-testid="button-add-campaign">
              <Send className="w-3.5 h-3.5 mr-1.5" />
              Campaña
            </Button>
            <Button size="sm" variant="outline" data-testid="button-export">
              <Download className="w-3.5 h-3.5 mr-1.5" />
              Exportar
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
                  >
                    <TableCell>
                      <Checkbox
                        checked={selectedIds.has(contact.id)}
                        onCheckedChange={() => toggleOne(contact.id)}
                        data-testid={`checkbox-contact-${contact.id}`}
                      />
                    </TableCell>
                    <TableCell className="font-medium" data-testid={`text-name-${contact.id}`}>
                      {contact.name}
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
                          <DropdownMenuItem>Enriquecer</DropdownMenuItem>
                          <DropdownMenuItem>Añadir a campaña</DropdownMenuItem>
                          <DropdownMenuItem>Eliminar de lista</DropdownMenuItem>
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
  const [selectedList, setSelectedList] = useState<ProspectList | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [createOpen, setCreateOpen] = useState(false);

  const filteredLists = prospectLists.filter((l) =>
    l.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (selectedList) {
    return (
      <div className="p-4 h-full overflow-auto">
        <ListDetailView
          list={selectedList}
          onBack={() => setSelectedList(null)}
        />
      </div>
    );
  }

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
              </DialogHeader>
              <div className="flex flex-col gap-3 pt-2">
                <Button
                  variant="outline"
                  className="justify-start gap-3"
                  onClick={() => setCreateOpen(false)}
                  data-testid="button-create-search"
                >
                  <Search className="w-4 h-4 text-primary" />
                  <div className="text-left">
                    <div className="font-medium text-sm">Desde resultados de búsqueda</div>
                    <div className="text-xs text-muted-foreground">
                      Crea una lista a partir de una búsqueda de prospectos
                    </div>
                  </div>
                </Button>
                <Button
                  variant="outline"
                  className="justify-start gap-3"
                  onClick={() => setCreateOpen(false)}
                  data-testid="button-create-import"
                >
                  <Upload className="w-4 h-4 text-primary" />
                  <div className="text-left">
                    <div className="font-medium text-sm">Importar CSV</div>
                    <div className="text-xs text-muted-foreground">
                      Sube un archivo CSV con contactos
                    </div>
                  </div>
                </Button>
                <Button
                  variant="outline"
                  className="justify-start gap-3"
                  onClick={() => setCreateOpen(false)}
                  data-testid="button-create-ai"
                >
                  <Bot className="w-4 h-4 text-primary" />
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
          <div className="flex flex-col items-center justify-center py-16 text-muted-foreground gap-2">
            <List className="w-10 h-10" />
            <p className="text-sm">No se encontraron listas</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {filteredLists.map((list) => (
              <ListCard
                key={list.id}
                list={list}
                onClick={() => setSelectedList(list)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
