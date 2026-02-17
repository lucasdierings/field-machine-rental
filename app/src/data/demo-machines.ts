// Demo machine data for testing and demonstration purposes
export interface DemoMachine {
    id: string;
    name: string;
    category: string;
    brand: string;
    model: string;
    year: number;
    images: string[];
    location: {
        city: string;
        state: string;
        coordinates: {
            lat: number;
            lng: number;
        };
    };
    price_hour: number;
    price_day?: number;
    price_hectare?: number;
    rating: number;
    reviewCount: number;
    specifications: {
        power?: string;
        weight?: string;
        capacity?: string;
    };
    owner_id: string;
    status: string;
    verified: boolean;
    hasInsurance: boolean;
    deliveryAvailable: boolean;
}

export const demoMachines: DemoMachine[] = [
    {
        id: 'demo-1',
        name: 'Trator John Deere 6125R',
        category: 'Tratores',
        brand: 'John Deere',
        model: '6125R',
        year: 2022,
        images: [
            'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800&h=600&fit=crop',
        ],
        location: {
            city: 'Passo Fundo',
            state: 'RS',
            coordinates: { lat: -28.2636, lng: -52.4066 }
        },
        price_hour: 250,
        price_day: 1800,
        rating: 4.8,
        reviewCount: 24,
        specifications: {
            power: '125 CV',
            weight: '5.200 kg',
        },
        owner_id: 'demo-owner-1',
        status: 'available',
        verified: true,
        hasInsurance: true,
        deliveryAvailable: true,
    },
    {
        id: 'demo-2',
        name: 'Colheitadeira Case IH Axial Flow 9240',
        category: 'Colheitadeiras',
        brand: 'Case IH',
        model: 'Axial Flow 9240',
        year: 2021,
        images: [
            'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=800&h=600&fit=crop',
        ],
        location: {
            city: 'Dourados',
            state: 'MS',
            coordinates: { lat: -22.2211, lng: -54.8056 }
        },
        price_hour: 850,
        price_hectare: 180,
        rating: 4.9,
        reviewCount: 18,
        specifications: {
            power: '490 CV',
            capacity: 'Tanque 14.500 L',
        },
        owner_id: 'demo-owner-2',
        status: 'available',
        verified: true,
        hasInsurance: true,
        deliveryAvailable: true,
    },
    {
        id: 'demo-3',
        name: 'Pulverizador Autopropelido Jacto Uniport 3030',
        category: 'Pulverizadores',
        brand: 'Jacto',
        model: 'Uniport 3030',
        year: 2023,
        images: [
            'https://images.unsplash.com/photo-1589923188900-85dae523342b?w=800&h=600&fit=crop',
        ],
        location: {
            city: 'Rio Verde',
            state: 'GO',
            coordinates: { lat: -17.7975, lng: -50.9189 }
        },
        price_hour: 380,
        price_hectare: 45,
        rating: 5.0,
        reviewCount: 12,
        specifications: {
            power: '225 CV',
            capacity: 'Tanque 3.000 L',
        },
        owner_id: 'demo-owner-3',
        status: 'available',
        verified: true,
        hasInsurance: true,
        deliveryAvailable: false,
    },
    {
        id: 'demo-4',
        name: 'Plantadeira John Deere DB60',
        category: 'Plantadeiras',
        brand: 'John Deere',
        model: 'DB60',
        year: 2022,
        images: [
            'https://images.unsplash.com/photo-1595278069441-2cf29f8005a4?w=800&h=600&fit=crop',
        ],
        location: {
            city: 'Sorriso',
            state: 'MT',
            coordinates: { lat: -12.5494, lng: -55.7139 }
        },
        price_hour: 320,
        price_hectare: 55,
        rating: 4.7,
        reviewCount: 31,
        specifications: {
            capacity: '15 linhas',
        },
        owner_id: 'demo-owner-4',
        status: 'available',
        verified: true,
        hasInsurance: false,
        deliveryAvailable: true,
    },
    {
        id: 'demo-5',
        name: 'Trator Massey Ferguson 7415',
        category: 'Tratores',
        brand: 'Massey Ferguson',
        model: '7415',
        year: 2020,
        images: [
            'https://images.unsplash.com/photo-1527788263495-3518a5c1c42d?w=800&h=600&fit=crop',
        ],
        location: {
            city: 'Cascavel',
            state: 'PR',
            coordinates: { lat: -24.9555, lng: -53.4552 }
        },
        price_hour: 220,
        price_day: 1600,
        rating: 4.6,
        reviewCount: 19,
        specifications: {
            power: '150 CV',
            weight: '6.100 kg',
        },
        owner_id: 'demo-owner-5',
        status: 'available',
        verified: true,
        hasInsurance: true,
        deliveryAvailable: true,
    },
    {
        id: 'demo-6',
        name: 'Grade Aradora Baldan GAC 32',
        category: 'Implementos',
        brand: 'Baldan',
        model: 'GAC 32',
        year: 2021,
        images: [
            'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800&h=600&fit=crop',
        ],
        location: {
            city: 'Cruz Alta',
            state: 'RS',
            coordinates: { lat: -28.6389, lng: -53.6058 }
        },
        price_hour: 180,
        price_hectare: 35,
        rating: 4.5,
        reviewCount: 15,
        specifications: {
            capacity: '32 discos',
        },
        owner_id: 'demo-owner-6',
        status: 'available',
        verified: false,
        hasInsurance: false,
        deliveryAvailable: false,
    },
    {
        id: 'demo-7',
        name: 'Caminhão Volkswagen Constellation 17.280',
        category: 'Transporte de Cargas',
        brand: 'Volkswagen',
        model: 'Constellation 17.280',
        year: 2019,
        images: [
            'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=800&h=600&fit=crop',
        ],
        location: {
            city: 'Uberlândia',
            state: 'MG',
            coordinates: { lat: -18.9186, lng: -48.2772 }
        },
        price_hour: 150,
        price_day: 900,
        rating: 4.4,
        reviewCount: 27,
        specifications: {
            power: '280 CV',
            capacity: 'Carreta 15 ton',
        },
        owner_id: 'demo-owner-7',
        status: 'available',
        verified: true,
        hasInsurance: true,
        deliveryAvailable: false,
    },
    {
        id: 'demo-8',
        name: 'Trator Valtra BH185',
        category: 'Tratores',
        brand: 'Valtra',
        model: 'BH185',
        year: 2023,
        images: [
            'https://images.unsplash.com/photo-1560493676-04071c5f467b?w=800&h=600&fit=crop',
        ],
        location: {
            city: 'Londrina',
            state: 'PR',
            coordinates: { lat: -23.3045, lng: -51.1696 }
        },
        price_hour: 280,
        price_day: 2000,
        rating: 4.9,
        reviewCount: 8,
        specifications: {
            power: '185 CV',
            weight: '7.200 kg',
        },
        owner_id: 'demo-owner-8',
        status: 'available',
        verified: true,
        hasInsurance: true,
        deliveryAvailable: true,
    },
    {
        id: 'demo-9',
        name: 'Colheitadeira New Holland CR 8.90',
        category: 'Colheitadeiras',
        brand: 'New Holland',
        model: 'CR 8.90',
        year: 2022,
        images: [
            'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?w=800&h=600&fit=crop',
        ],
        location: {
            city: 'Luís Eduardo Magalhães',
            state: 'BA',
            coordinates: { lat: -12.0969, lng: -45.7845 }
        },
        price_hour: 780,
        price_hectare: 175,
        rating: 4.8,
        reviewCount: 21,
        specifications: {
            power: '460 CV',
            capacity: 'Tanque 13.500 L',
        },
        owner_id: 'demo-owner-9',
        status: 'available',
        verified: true,
        hasInsurance: true,
        deliveryAvailable: true,
    },
    {
        id: 'demo-10',
        name: 'Pulverizador Montana Parruda 3027',
        category: 'Pulverizadores',
        brand: 'Montana',
        model: 'Parruda 3027',
        year: 2021,
        images: [
            'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=800&h=600&fit=crop',
        ],
        location: {
            city: 'Sinop',
            state: 'MT',
            coordinates: { lat: -11.8639, lng: -55.5050 }
        },
        price_hour: 350,
        price_hectare: 42,
        rating: 4.7,
        reviewCount: 16,
        specifications: {
            power: '200 CV',
            capacity: 'Tanque 2.700 L',
        },
        owner_id: 'demo-owner-10',
        status: 'available',
        verified: true,
        hasInsurance: false,
        deliveryAvailable: true,
    },
    {
        id: 'demo-11',
        name: 'Plantadeira Semeato PSE 8',
        category: 'Plantadeiras',
        brand: 'Semeato',
        model: 'PSE 8',
        year: 2020,
        images: [
            'https://images.unsplash.com/photo-1615671524827-c1fe3973b648?w=800&h=600&fit=crop',
        ],
        location: {
            city: 'Campo Mourão',
            state: 'PR',
            coordinates: { lat: -24.0456, lng: -52.3789 }
        },
        price_hour: 280,
        price_hectare: 48,
        rating: 4.6,
        reviewCount: 13,
        specifications: {
            capacity: '8 linhas',
        },
        owner_id: 'demo-owner-11',
        status: 'available',
        verified: false,
        hasInsurance: true,
        deliveryAvailable: false,
    },
    {
        id: 'demo-12',
        name: 'Distribuidor de Calcário Stara Hercules 10000',
        category: 'Implementos',
        brand: 'Stara',
        model: 'Hercules 10000',
        year: 2022,
        images: [
            'https://images.unsplash.com/photo-1615671524827-c1fe3973b648?w=800&h=600&fit=crop',
        ],
        location: {
            city: 'Chapecó',
            state: 'SC',
            coordinates: { lat: -27.1004, lng: -52.6151 }
        },
        price_hour: 200,
        price_hectare: 38,
        rating: 4.8,
        reviewCount: 9,
        specifications: {
            capacity: '10.000 kg',
        },
        owner_id: 'demo-owner-12',
        status: 'available',
        verified: true,
        hasInsurance: false,
        deliveryAvailable: true,
    },
];

export const categories = [
    'Tratores',
    'Colheitadeiras',
    'Pulverizadores',
    'Plantadeiras',
    'Implementos',
    'Transporte de Cargas',
];
