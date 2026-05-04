/**
 * Single source of truth for machinery brands.
 * Sorted alphabetically. Based on market research of Brazilian agriculture.
 */

export const MACHINERY_BRANDS = [
    // Tratores, Colheitadeiras, Pulverizadores multimarca
    "AGCO",
    "Agrale",
    "Baldan",
    "BertiMaq",
    "Case IH",
    "CAT (Caterpillar)",
    "CLAAS",
    "DAF",
    "Deutz-Fahr",
    "DJI (Drones)",
    "Fankhauser",
    "Ford",
    "Husqvarna",
    "Imasa",
    "Iveco",
    "Jacto",
    "Jan",
    "JCB",
    "John Deere",
    "Komatsu",
    "KWS",
    "Kuhn",
    "Landini",
    "LS Tractor",
    "Mahindra",
    "Marchesan",
    "Maschietto",
    "Massey Ferguson",
    "Mercedes-Benz",
    "Montana",
    "New Holland",
    "Noma",
    "Piccin",
    "Semeato",
    "Scania",
    "Stara",
    "Tatu Marchesan",
    "Tramontini",
    "Valtra",
    "Volkswagen",
    "Volvo",
    "XAG (Drones)",
    "Yanmar",
    "Outra",
] as const;

export type MachineryBrand = typeof MACHINERY_BRANDS[number];
