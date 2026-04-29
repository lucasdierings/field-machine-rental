import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LocationSelector } from "@/components/ui/location-selector";
import { MultiCitySelector } from "@/components/ui/multi-city-selector";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ShieldCheck } from "lucide-react";
import { CATEGORY_NAMES } from "@/data/categories";
import { MACHINERY_BRANDS } from "@/data/brands";

const CATEGORIES = CATEGORY_NAMES;
const BRANDS = MACHINERY_BRANDS;

interface FormData {
    name: string;
    category: string;
    brand: string;
    model: string;
    year: number;
    description?: string;
    price_hour: string;
    price_day: string;
    price_hectare: string;
    location: { city: string; state: string; address: string };
    radius_km: number;
    operator_type: string;
    specifications: object;
    service_cities: string[];
}

interface MachineFormFieldsProps {
    formData: FormData;
    onChange: (field: string, value: any) => void;
}

export function MachineFormFields({ formData, onChange }: MachineFormFieldsProps) {
    return (
        <>
            <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="name">Nome/Modelo da Máquina *</Label>
                    <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => onChange('name', e.target.value)}
                        placeholder="Ex: Trator John Deere 6155R"
                        required
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="category">Categoria *</Label>
                    <Select onValueChange={(value) => onChange('category', value)} value={formData.category}>
                        <SelectTrigger>
                            <SelectValue placeholder="Selecione a categoria" />
                        </SelectTrigger>
                        <SelectContent>
                            {CATEGORIES.map((category) => (
                                <SelectItem key={category} value={category}>
                                    {category}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="brand">Marca *</Label>
                    <Select onValueChange={(value) => onChange('brand', value)} value={formData.brand}>
                        <SelectTrigger>
                            <SelectValue placeholder="Selecione a marca" />
                        </SelectTrigger>
                        <SelectContent>
                            {BRANDS.map((brand) => (
                                <SelectItem key={brand} value={brand}>
                                    {brand}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="model">Modelo</Label>
                    <Input
                        id="model"
                        value={formData.model}
                        onChange={(e) => onChange('model', e.target.value)}
                        placeholder="Ex: 6155R"
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="year">Ano</Label>
                    <Input
                        id="year"
                        type="number"
                        min="1990"
                        max={new Date().getFullYear() + 1}
                        value={formData.year}
                        onChange={(e) => onChange('year', parseInt(e.target.value))}
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="operator_type">Tipo de Operador *</Label>
                    <Select
                        value={formData.operator_type}
                        onValueChange={(value) => onChange('operator_type', value)}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Selecione quem opera" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="owner">O Próprio Dono</SelectItem>
                            <SelectItem value="employee">Funcionário</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="description">Descrição do Serviço</Label>
                <Textarea
                    id="description"
                    value={formData.description || ""}
                    onChange={(e) => onChange('description', e.target.value)}
                    placeholder="Descreva o equipamento, condições de uso, implementos inclusos, diferenciais (ex.: ar-condicionado, GPS, piloto automático)..."
                    rows={4}
                    maxLength={2000}
                />
                <p className="text-xs text-muted-foreground">
                    {(formData.description || "").length}/2000 caracteres — uma boa descrição aumenta as chances de contratação.
                </p>
            </div>

            <div>
                <h3 className="text-lg font-medium mb-4">Preços do Serviço</h3>
                <div className="grid md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="price_hour">Preço por Hora (R$)</Label>
                        <Input
                            id="price_hour"
                            type="number"
                            step="0.01"
                            value={formData.price_hour}
                            onChange={(e) => onChange('price_hour', e.target.value)}
                            placeholder="0.00"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="price_day">Preço por Dia (R$)</Label>
                        <Input
                            id="price_day"
                            type="number"
                            step="0.01"
                            value={formData.price_day}
                            onChange={(e) => onChange('price_day', e.target.value)}
                            placeholder="0.00"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="price_hectare">Preço por Hectare (R$)</Label>
                        <Input
                            id="price_hectare"
                            type="number"
                            step="0.01"
                            value={formData.price_hectare}
                            onChange={(e) => onChange('price_hectare', e.target.value)}
                            placeholder="0.00"
                        />
                    </div>
                </div>
            </div>

            <div>
                <h3 className="text-lg font-medium mb-4">Localização</h3>
                <div className="grid md:grid-cols-2 gap-4">
                    <div className="md:col-span-2 space-y-2">
                        <Label>Base da Máquina (Onde ela fica)</Label>
                        <LocationSelector
                            onLocationChange={(loc) => {
                                onChange('location.city', loc.city);
                                onChange('location.state', loc.state);
                            }}
                            initialData={{
                                country: 'BRASIL',
                                state: formData.location.state,
                                city: formData.location.city
                            }}
                        />
                    </div>

                    <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="address">Endereço / Ponto de Referência</Label>
                        <Textarea
                            id="address"
                            value={formData.location.address}
                            onChange={(e) => onChange('location.address', e.target.value)}
                            placeholder="Endereço onde a máquina está estacionada"
                            rows={2}
                        />
                        <Alert className="bg-green-50 border-green-200">
                            <ShieldCheck className="h-4 w-4 text-green-600" />
                            <AlertDescription className="text-xs text-green-700">
                                Seu endereço exato <strong>não será exibido</strong> para contratantes.
                                Apenas a cidade/região será visível no anúncio para proteger sua segurança.
                            </AlertDescription>
                        </Alert>
                    </div>

                    <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="radius">Raio de Atendimento (km do ponto base)</Label>
                        <Input
                            id="radius"
                            type="number"
                            min="1"
                            max="1000"
                            value={formData.radius_km}
                            onChange={(e) => onChange('radius_km', parseInt(e.target.value))}
                            className="max-w-[200px]"
                        />
                    </div>

                    <div className="md:col-span-2 space-y-2 border-t pt-4 mt-2">
                        <Label>Cidades de Atuação Específicas (Opcional)</Label>
                        <p className="text-sm text-muted-foreground mb-2">
                            Além do raio, você pode listar cidades específicas onde aceita trabalhar.
                        </p>
                        <MultiCitySelector
                            onCitiesChange={(cities) => onChange('service_cities', cities)}
                            initialCities={formData.service_cities}
                        />
                    </div>
                </div>
            </div>
        </>
    );
}
