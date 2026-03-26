import {
    Tractor, Droplets, Wheat, Truck, Plane, Sprout,
    Mountain, Scissors, Package, Wrench, Leaf, Sun
} from "lucide-react";

/**
 * Single source of truth for all service/machine categories.
 * Import this everywhere instead of hardcoding categories.
 */

export interface ServiceCategory {
    id: string;
    name: string;
    slug: string;
    description: string;
    icon: typeof Tractor;
    color: string;       // gradient/bg class
    iconColor: string;   // icon color class
}

export const SERVICE_CATEGORIES: ServiceCategory[] = [
    {
        id: "tratores",
        name: "Tratores",
        slug: "tratores",
        description: "Tratores para preparo de solo, plantio e operações gerais",
        icon: Tractor,
        color: "bg-green-500",
        iconColor: "text-green-600",
    },
    {
        id: "colheitadeiras",
        name: "Colheitadeiras",
        slug: "colheitadeiras",
        description: "Colheitadeiras para soja, milho, arroz e outras culturas",
        icon: Wheat,
        color: "bg-yellow-500",
        iconColor: "text-yellow-600",
    },
    {
        id: "pulverizadores",
        name: "Pulverização",
        slug: "pulverizadores",
        description: "Pulverizadores autopropelidos e de arrasto para defensivos",
        icon: Droplets,
        color: "bg-blue-500",
        iconColor: "text-blue-600",
    },
    {
        id: "plantio",
        name: "Plantio e Semeadura",
        slug: "plantio",
        description: "Plantadeiras e semeadoras para plantio direto e convencional",
        icon: Sprout,
        color: "bg-emerald-500",
        iconColor: "text-emerald-600",
    },
    {
        id: "drones",
        name: "Drones Agrícolas",
        slug: "drones",
        description: "Drones para pulverização, mapeamento e monitoramento de lavouras",
        icon: Plane,
        color: "bg-purple-500",
        iconColor: "text-purple-600",
    },
    {
        id: "calcario",
        name: "Calagem e Adubação",
        slug: "calcario",
        description: "Distribuidores de calcário, fertilizantes e corretivos de solo",
        icon: Mountain,
        color: "bg-amber-500",
        iconColor: "text-amber-600",
    },
    {
        id: "preparo-solo",
        name: "Preparo de Solo",
        slug: "preparo-solo",
        description: "Grades, arados, subsoladores e niveladoras para preparo de solo",
        icon: Sun,
        color: "bg-orange-500",
        iconColor: "text-orange-600",
    },
    {
        id: "silagem",
        name: "Silagem e Fenação",
        slug: "silagem",
        description: "Ensiladeiras, enfardadoras e equipamentos para forragem",
        icon: Scissors,
        color: "bg-lime-500",
        iconColor: "text-lime-600",
    },
    {
        id: "transporte",
        name: "Transporte de Cargas",
        slug: "transporte",
        description: "Caminhões, carretas e transbordos para transporte de safra",
        icon: Truck,
        color: "bg-red-500",
        iconColor: "text-red-600",
    },
    {
        id: "implementos",
        name: "Implementos Diversos",
        slug: "implementos",
        description: "Roçadeiras, perfuradores, guindastes e outros implementos",
        icon: Wrench,
        color: "bg-gray-500",
        iconColor: "text-gray-600",
    },
    {
        id: "irrigacao",
        name: "Irrigação",
        slug: "irrigacao",
        description: "Pivôs, carretéis e sistemas de irrigação para lavouras",
        icon: Droplets,
        color: "bg-cyan-500",
        iconColor: "text-cyan-600",
    },
    {
        id: "florestal",
        name: "Serviços Florestais",
        slug: "florestal",
        description: "Harvesters, forwarders e equipamentos para silvicultura",
        icon: Leaf,
        color: "bg-teal-500",
        iconColor: "text-teal-600",
    },
];

/** Just the category names — useful for filters, dropdowns, etc. */
export const CATEGORY_NAMES = SERVICE_CATEGORIES.map(c => c.name);

/** Map slug → name */
export const SLUG_TO_NAME: Record<string, string> = Object.fromEntries(
    SERVICE_CATEGORIES.map(c => [c.slug, c.name])
);

/** Map name → slug */
export const NAME_TO_SLUG: Record<string, string> = Object.fromEntries(
    SERVICE_CATEGORIES.map(c => [c.name, c.slug])
);
