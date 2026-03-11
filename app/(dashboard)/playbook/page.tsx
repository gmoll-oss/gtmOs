"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import {
  Bot,
  Globe,
  Linkedin,
  Building2,
  Sparkles,
  Plus,
  Trash2,
  Quote,
  Swords,
  Target,
  Package,
  Star,
  Variable,
  Save,
  ExternalLink,
  Pencil,
  X,
  Loader2,
} from "lucide-react";
import { usePlaybook } from "@/lib/hooks/useData";

export default function AIPlaybook() {
  const { data: playbookData, isLoading: playbookLoading } = usePlaybook() as { data: any; isLoading: boolean };
  const [data, setData] = useState<any>({ productsServices: [], valuePropositions: [], competitors: [], aiVariables: { variables: [] }, testimonials: [] });
  const [isFilling, setIsFilling] = useState(false);
  const [activeTab, setActiveTab] = useState("company");
  const [isEditing, setIsEditing] = useState(false);
  const [newProduct, setNewProduct] = useState("");
  const [newValueProp, setNewValueProp] = useState("");
  const [newCompetitor, setNewCompetitor] = useState("");

  useEffect(() => {
    if (playbookData && !data.companyName) setData(playbookData);
  }, [playbookData]);

  const handleFillWithAI = () => {
    setIsFilling(true);
    setTimeout(() => {
      if (playbookData) setData({ ...playbookData });
      setIsFilling(false);
    }, 1500);
  };

  const updateField = (field: string, value: string) => {
    setData((prev: any) => ({ ...prev, [field]: value }));
  };

  const addProduct = () => {
    if (!newProduct.trim()) return;
    setData((prev) => ({
      ...prev,
      productsServices: [...(prev.productsServices || []), newProduct.trim()],
    }));
    setNewProduct("");
  };

  const removeProduct = (index: number) => {
    setData((prev) => ({
      ...prev,
      productsServices: (prev.productsServices || []).filter((_: any, i: number) => i !== index),
    }));
  };

  const addValueProp = () => {
    if (!newValueProp.trim()) return;
    setData((prev) => ({
      ...prev,
      valuePropositions: [...(prev.valuePropositions || []), newValueProp.trim()],
    }));
    setNewValueProp("");
  };

  const removeValueProp = (index: number) => {
    setData((prev) => ({
      ...prev,
      valuePropositions: (prev.valuePropositions || []).filter((_: any, i: number) => i !== index),
    }));
  };

  const addCompetitor = () => {
    if (!newCompetitor.trim()) return;
    setData((prev) => ({
      ...prev,
      competitors: [...(prev.competitors || []), newCompetitor.trim()],
    }));
    setNewCompetitor("");
  };

  const removeCompetitor = (index: number) => {
    setData((prev) => ({
      ...prev,
      competitors: (prev.competitors || []).filter((_: any, i: number) => i !== index),
    }));
  };

  return (
    <div className="h-full overflow-auto">
      <div className="max-w-5xl mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-md bg-primary/10">
              <Bot className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold" data-testid="text-page-title">
                AI Playbook
              </h1>
              <p className="text-sm text-muted-foreground">
                Define tu empresa, ICP y variables para que la IA personalice tus campañas
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Button
              variant="outline"
              onClick={handleFillWithAI}
              disabled={isFilling}
              data-testid="button-fill-ai"
            >
              {isFilling ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Sparkles className="w-4 h-4 mr-2" />
              )}
              {isFilling ? "Rellenando..." : "Rellenar con IA"}
            </Button>
            <Button data-testid="button-save-playbook">
              <Save className="w-4 h-4 mr-2" />
              Guardar
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList data-testid="tabs-playbook">
            <TabsTrigger value="company" data-testid="tab-company">
              <Building2 className="w-4 h-4 mr-1.5" />
              Empresa
            </TabsTrigger>
            <TabsTrigger value="variables" data-testid="tab-variables">
              <Variable className="w-4 h-4 mr-1.5" />
              Variables IA
            </TabsTrigger>
            <TabsTrigger value="competitors" data-testid="tab-competitors">
              <Swords className="w-4 h-4 mr-1.5" />
              Competidores
            </TabsTrigger>
          </TabsList>

          <TabsContent value="company" className="space-y-6 mt-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-4">
                <CardTitle className="text-base flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-muted-foreground" />
                  Información de la empresa
                </CardTitle>
                <Button
                  variant={isEditing ? "default" : "outline"}
                  size="sm"
                  onClick={() => setIsEditing(!isEditing)}
                  data-testid="button-toggle-edit"
                >
                  {isEditing ? (
                    <>
                      <X className="w-4 h-4 mr-1.5" />
                      Cancelar edición
                    </>
                  ) : (
                    <>
                      <Pencil className="w-4 h-4 mr-1.5" />
                      Editar
                    </>
                  )}
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-muted-foreground">
                      Nombre de la empresa
                    </label>
                    <Input
                      value={data.companyName}
                      onChange={(e) => updateField("companyName", e.target.value)}
                      readOnly={!isEditing}
                      className={!isEditing ? "bg-muted/50" : ""}
                      data-testid="input-company-name"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-muted-foreground">Industria</label>
                    <Input
                      value={data.industry}
                      onChange={(e) => updateField("industry", e.target.value)}
                      readOnly={!isEditing}
                      className={!isEditing ? "bg-muted/50" : ""}
                      data-testid="input-industry"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-muted-foreground flex items-center gap-1.5">
                      <Globe className="w-3.5 h-3.5" />
                      Website
                    </label>
                    <div className="flex items-center gap-2">
                      <Input
                        value={data.website}
                        onChange={(e) => updateField("website", e.target.value)}
                        readOnly={!isEditing}
                        className={!isEditing ? "bg-muted/50" : ""}
                        data-testid="input-website"
                      />
                      {data.website && (
                        <a href={data.website} target="_blank" rel="noopener noreferrer">
                          <Button size="icon" variant="ghost" data-testid="link-website">
                            <ExternalLink className="w-4 h-4" />
                          </Button>
                        </a>
                      )}
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-muted-foreground flex items-center gap-1.5">
                      <Linkedin className="w-3.5 h-3.5" />
                      LinkedIn
                    </label>
                    <div className="flex items-center gap-2">
                      <Input
                        value={data.linkedIn}
                        onChange={(e) => updateField("linkedIn", e.target.value)}
                        readOnly={!isEditing}
                        className={!isEditing ? "bg-muted/50" : ""}
                        data-testid="input-linkedin"
                      />
                      {data.linkedIn && (
                        <a href={data.linkedIn} target="_blank" rel="noopener noreferrer">
                          <Button size="icon" variant="ghost" data-testid="link-linkedin">
                            <ExternalLink className="w-4 h-4" />
                          </Button>
                        </a>
                      )}
                    </div>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-muted-foreground">
                    Descripción de la empresa
                  </label>
                  <Textarea
                    value={data.description}
                    onChange={(e) => updateField("description", e.target.value)}
                    readOnly={!isEditing}
                    className={!isEditing ? "bg-muted/50" : ""}
                    rows={4}
                    data-testid="input-description"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-4">
                <CardTitle className="text-base flex items-center gap-2">
                  <Package className="w-4 h-4 text-muted-foreground" />
                  Productos y Servicios
                </CardTitle>
                <Badge variant="secondary" className="text-xs">
                  {(data.productsServices || []).length}
                </Badge>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  {(data.productsServices || []).map((item: any, index: number) => (
                    <div
                      key={index}
                      className="flex items-center justify-between gap-2 p-2.5 rounded-md bg-muted/50"
                      data-testid={`item-product-${index}`}
                    >
                      <span className="text-sm">{item}</span>
                      {isEditing && (
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => removeProduct(index)}
                          data-testid={`button-remove-product-${index}`}
                        >
                          <Trash2 className="w-3.5 h-3.5 text-muted-foreground" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
                {isEditing && (
                  <div className="flex items-center gap-2">
                    <Input
                      placeholder="Añadir producto o servicio..."
                      value={newProduct}
                      onChange={(e) => setNewProduct(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && addProduct()}
                      data-testid="input-new-product"
                    />
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={addProduct}
                      data-testid="button-add-product"
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-4">
                <CardTitle className="text-base flex items-center gap-2">
                  <Star className="w-4 h-4 text-muted-foreground" />
                  Propuestas de Valor
                </CardTitle>
                <Badge variant="secondary" className="text-xs">
                  {(data.valuePropositions || []).length}
                </Badge>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  {(data.valuePropositions || []).map((item: any, index: number) => (
                    <div
                      key={index}
                      className="flex items-center justify-between gap-2 p-2.5 rounded-md bg-muted/50"
                      data-testid={`item-value-prop-${index}`}
                    >
                      <span className="text-sm">{item}</span>
                      {isEditing && (
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => removeValueProp(index)}
                          data-testid={`button-remove-value-prop-${index}`}
                        >
                          <Trash2 className="w-3.5 h-3.5 text-muted-foreground" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
                {isEditing && (
                  <div className="flex items-center gap-2">
                    <Input
                      placeholder="Añadir propuesta de valor..."
                      value={newValueProp}
                      onChange={(e) => setNewValueProp(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && addValueProp()}
                      data-testid="input-new-value-prop"
                    />
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={addValueProp}
                      data-testid="button-add-value-prop"
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-4">
                <CardTitle className="text-base flex items-center gap-2">
                  <Target className="w-4 h-4 text-muted-foreground" />
                  Definición de ICP
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={data.icpDefinition}
                  onChange={(e) => updateField("icpDefinition", e.target.value)}
                  readOnly={!isEditing}
                  className={!isEditing ? "bg-muted/50" : ""}
                  rows={4}
                  data-testid="input-icp-definition"
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="variables" className="space-y-6 mt-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-4">
                <div>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Variable className="w-4 h-4 text-muted-foreground" />
                    Variables de IA
                  </CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    Variables personalizadas que la IA usa para enriquecer tus campañas
                  </p>
                </div>
                <Badge variant="secondary" className="text-xs">
                  {(data.aiVariables?.variables || []).length}
                </Badge>
              </CardHeader>
              <CardContent>
                <div className="border rounded-md overflow-hidden">
                  <table className="w-full" data-testid="table-ai-variables">
                    <thead>
                      <tr className="border-b bg-muted/50">
                        <th className="text-left text-xs font-medium text-muted-foreground p-3">Variable</th>
                        <th className="text-left text-xs font-medium text-muted-foreground p-3">Descripción</th>
                        <th className="text-left text-xs font-medium text-muted-foreground p-3">Fuente</th>
                        <th className="text-right text-xs font-medium text-muted-foreground p-3 w-12"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {(data.aiVariables?.variables || []).map((variable: any, index: number) => (
                        <tr
                          key={index}
                          className="border-b last:border-b-0"
                          data-testid={`row-variable-${index}`}
                        >
                          <td className="p-3">
                            <Badge variant="outline" className="font-mono text-xs">
                              {"{"}
                              {variable.name}
                              {"}"}
                            </Badge>
                          </td>
                          <td className="p-3 text-sm">{variable.description}</td>
                          <td className="p-3">
                            <Badge variant="secondary" className="text-xs">
                              {variable.source}
                            </Badge>
                          </td>
                          <td className="p-3 text-right">
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() =>
                                setData((prev) => ({
                                  ...prev,
                                  aiVariables: prev.aiVariables.filter((_, i) => i !== index),
                                }))
                              }
                              data-testid={`button-remove-variable-${index}`}
                            >
                              <Trash2 className="w-3.5 h-3.5 text-muted-foreground" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <Separator className="my-4" />

                <div className="space-y-3">
                  <p className="text-sm font-medium text-muted-foreground">
                    Añadir nueva variable
                  </p>
                  <AddVariableForm
                    onAdd={(v) =>
                      setData((prev) => ({
                        ...prev,
                        aiVariables: [...prev.aiVariables, v],
                      }))
                    }
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-base flex items-center gap-2">
                  <Bot className="w-4 h-4 text-muted-foreground" />
                  Variables del sistema
                </CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Variables automáticas disponibles en todas las campañas
                </p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {[
                    { name: "nombre", desc: "Nombre del contacto" },
                    { name: "empresa", desc: "Nombre de la empresa" },
                    { name: "ciudad", desc: "Ciudad del contacto" },
                    { name: "titulo", desc: "Cargo del contacto" },
                    { name: "industria", desc: "Industria de la empresa" },
                    { name: "empleados", desc: "Cantidad de empleados" },
                  ].map((sysVar) => (
                    <div
                      key={sysVar.name}
                      className="flex items-center gap-2 p-2.5 rounded-md bg-muted/50"
                      data-testid={`system-var-${sysVar.name}`}
                    >
                      <Badge variant="outline" className="font-mono text-xs">
                        {"{"}
                        {sysVar.name}
                        {"}"}
                      </Badge>
                      <span className="text-sm text-muted-foreground">{sysVar.desc}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="competitors" className="space-y-6 mt-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-4">
                <CardTitle className="text-base flex items-center gap-2">
                  <Swords className="w-4 h-4 text-muted-foreground" />
                  Competidores
                </CardTitle>
                <Badge variant="secondary" className="text-xs">
                  {(data.competitors || []).length}
                </Badge>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex flex-wrap gap-2">
                  {(data.competitors || []).map((item: any, index: number) => (
                    <Badge
                      key={index}
                      variant="outline"
                      className="gap-1.5 pr-1"
                      data-testid={`badge-competitor-${index}`}
                    >
                      {item}
                      <button
                        onClick={() => removeCompetitor(index)}
                        className="ml-0.5 rounded-sm hover-elevate"
                        data-testid={`button-remove-competitor-${index}`}
                      >
                        <Trash2 className="w-3 h-3 text-muted-foreground" />
                      </button>
                    </Badge>
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <Input
                    placeholder="Añadir competidor..."
                    value={newCompetitor}
                    onChange={(e) => setNewCompetitor(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && addCompetitor()}
                    data-testid="input-new-competitor"
                  />
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={addCompetitor}
                    data-testid="button-add-competitor"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-4">
                <CardTitle className="text-base flex items-center gap-2">
                  <Quote className="w-4 h-4 text-muted-foreground" />
                  Testimonios de Clientes
                </CardTitle>
                <Badge variant="secondary" className="text-xs">
                  {(data.testimonials || []).length}
                </Badge>
              </CardHeader>
              <CardContent className="space-y-3">
                {(data.testimonials || []).map((testimonial: any, index: number) => (
                  <div
                    key={index}
                    className="p-4 rounded-md bg-muted/50 space-y-2"
                    data-testid={`card-testimonial-${index}`}
                  >
                    <p className="text-sm italic text-muted-foreground">
                      &ldquo;{testimonial.quote}&rdquo;
                    </p>
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <div>
                        <span className="text-sm font-medium">{testimonial.name}</span>
                        <span className="text-sm text-muted-foreground">
                          {" "}
                          &middot; {testimonial.role}, {testimonial.company}
                        </span>
                      </div>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() =>
                          setData((prev) => ({
                            ...prev,
                            testimonials: prev.testimonials.filter((_, i) => i !== index),
                          }))
                        }
                        data-testid={`button-remove-testimonial-${index}`}
                      >
                        <Trash2 className="w-3.5 h-3.5 text-muted-foreground" />
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function AddVariableForm({
  onAdd,
}: {
  onAdd: (v: { name: string; description: string; source: string }) => void;
}) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [source, setSource] = useState("");

  const handleAdd = () => {
    if (!name.trim() || !description.trim()) return;
    onAdd({ name: name.trim(), description: description.trim(), source: source.trim() || "Manual" });
    setName("");
    setDescription("");
    setSource("");
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      <Input
        placeholder="Nombre (ej: case_study)"
        value={name}
        onChange={(e) => setName(e.target.value)}
        data-testid="input-new-var-name"
      />
      <Input
        placeholder="Descripción"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        data-testid="input-new-var-description"
      />
      <div className="flex items-center gap-2">
        <Input
          placeholder="Fuente"
          value={source}
          onChange={(e) => setSource(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAdd()}
          data-testid="input-new-var-source"
        />
        <Button
          size="icon"
          variant="outline"
          onClick={handleAdd}
          data-testid="button-add-variable"
        >
          <Plus className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
