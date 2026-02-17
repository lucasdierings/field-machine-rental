import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Check, X, Search, MapPin } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface MultiCitySelectorProps {
    onCitiesChange: (cities: string[]) => void;
    initialCities?: string[];
    placeholder?: string;
}

export function MultiCitySelector({ onCitiesChange, initialCities = [], placeholder = "Selecione as cidades..." }: MultiCitySelectorProps) {
    const [selectedCities, setSelectedCities] = useState<string[]>(initialCities);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [states, setStates] = useState<any[]>([]);
    const [selectedState, setSelectedState] = useState<string>('all');

    // Load States for filter
    useEffect(() => {
        async function loadStates() {
            const { data } = await (supabase as any)
                .from('states')
                .select('*')
                .order('name');
            setStates(data || []);
        }
        loadStates();
    }, []);

    // Search cities based on input and state filter
    useEffect(() => {
        const delayDebounceFn = setTimeout(async () => {
            if (searchTerm.length < 3 && selectedState === 'all') {
                setSearchResults([]);
                return;
            }

            setIsSearching(true);

            let query = (supabase as any)
                .from('cities')
                .select('*, states(name, country_id)')
                .limit(20);

            if (searchTerm) {
                query = query.ilike('name', `%${searchTerm}%`);
            }

            if (selectedState !== 'all') {
                query = query.eq('state_id', selectedState);
            }

            // If no search term but state selected, show first 20
            if (!searchTerm && selectedState !== 'all') {
                // just fetch
            }

            const { data, error } = await query;

            if (!error) {
                // Transform data to easy format
                setSearchResults(data || []);
            }

            setIsSearching(false);
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm, selectedState]);

    const toggleCity = (city: any) => {
        const cityLabel = `${city.name} - ${city.states?.name}`;
        let newSelection;

        // Check if already selected (by string matching for now as requested by user JSON structure)
        // Actually, storing just "CityName - StateName" string is simple but "CityName" might be ambiguous.
        // The user previously wanted "City" and "State" filters.
        // For specific service cities, storing a list of strings "City - UF" is robust enough for display.
        // Ideally we store objects. But `onCitiesChange` expects string[].

        if (selectedCities.includes(cityLabel)) {
            newSelection = selectedCities.filter(c => c !== cityLabel);
        } else {
            newSelection = [...selectedCities, cityLabel];
        }

        setSelectedCities(newSelection);
        onCitiesChange(newSelection);
    };

    const removeCity = (cityLabel: string) => {
        const newSelection = selectedCities.filter(c => c !== cityLabel);
        setSelectedCities(newSelection);
        onCitiesChange(newSelection);
    };

    return (
        <div className="space-y-4">
            <div className="flex flex-col gap-2">
                {/* Filters */}
                <div className="flex gap-2">
                    <Select value={selectedState} onValueChange={setSelectedState}>
                        <SelectTrigger className="w-[140px]">
                            <SelectValue placeholder="Estado" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Todos Estados</SelectItem>
                            {states.map(state => (
                                <SelectItem key={state.id} value={state.id}>{state.name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <div className="relative flex-1">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Buscar cidade..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-8"
                        />
                    </div>
                </div>

                {/* Search Results */}
                {(searchResults.length > 0 || isSearching) && (
                    <div className="border rounded-md p-2 max-h-40 overflow-y-auto bg-background shadow-sm">
                        {isSearching && <div className="p-2 text-sm text-muted-foreground">Buscando...</div>}
                        {!isSearching && searchResults.map(city => {
                            const label = `${city.name} - ${city.states?.name}`;
                            const isSelected = selectedCities.includes(label);
                            return (
                                <div
                                    key={city.id}
                                    onClick={() => toggleCity(city)}
                                    className={`flex items-center justify-between p-2 rounded-sm cursor-pointer hover:bg-accent text-sm ${isSelected ? 'bg-accent/50' : ''}`}
                                >
                                    <div className="flex items-center gap-2">
                                        <MapPin className="h-3 w-3 text-muted-foreground" />
                                        <span>{city.name}</span>
                                        <span className="text-xs text-muted-foreground">({city.states?.name})</span>
                                    </div>
                                    {isSelected && <Check className="h-4 w-4 text-primary" />}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Selected Tags */}
            {selectedCities.length > 0 && (
                <div className="flex flex-wrap gap-2">
                    {selectedCities.map(city => (
                        <Badge key={city} variant="secondary" className="pl-2 pr-1 py-1 flex items-center gap-1">
                            {city}
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-4 w-4 hover:bg-destructive/20 hover:text-destructive rounded-full p-0"
                                onClick={() => removeCity(city)}
                            >
                                <X className="h-3 w-3" />
                            </Button>
                        </Badge>
                    ))}
                </div>
            )}
        </div>
    );
}
