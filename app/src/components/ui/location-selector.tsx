import { useState, useEffect } from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { supabase } from "@/integrations/supabase/client";
import { Label } from "@/components/ui/label";

interface LocationSelectorProps {
    onLocationChange: (location: {
        country: string;
        state: string;
        city: string;
        country_id?: string;
        state_id?: string;
        city_id?: string;
        latitude?: number | null;
        longitude?: number | null;
    }) => void;
    initialData?: {
        country?: string;
        state?: string;
        city?: string;
    };
    showLabels?: boolean;
    className?: string;
}

export function LocationSelector({
    onLocationChange,
    initialData,
    showLabels = true,
    className,
}: LocationSelectorProps) {
    const [countries, setCountries] = useState<any[]>([]);
    const [states, setStates] = useState<any[]>([]);
    const [cities, setCities] = useState<any[]>([]);

    const [selectedCountry, setSelectedCountry] = useState<string>("");
    const [selectedState, setSelectedState] = useState<string>("");
    const [selectedCity, setSelectedCity] = useState<string>("");

    const [openCountry, setOpenCountry] = useState(false);
    const [openState, setOpenState] = useState(false);
    const [openCity, setOpenCity] = useState(false);

    const [loadingCountries, setLoadingCountries] = useState(false);
    const [loadingStates, setLoadingStates] = useState(false);
    const [loadingCities, setLoadingCities] = useState(false);

    // Load Countries on mount
    useEffect(() => {
        async function loadCountries() {
            setLoadingCountries(true);
            const { data } = await (supabase as any)
                .from("countries")
                .select("*")
                .order("name");
            setCountries(data || []);
            setLoadingCountries(false);
        }
        loadCountries();
    }, []);

    // Sync with initialData
    useEffect(() => {
        if (initialData?.country && countries.length > 0 && !selectedCountry) {
            const country = countries.find(
                (c) => c.name.toUpperCase() === initialData.country?.toUpperCase()
            );
            if (country) setSelectedCountry(country.id);
        }
    }, [initialData?.country, countries]);

    useEffect(() => {
        if (initialData?.state && states.length > 0 && !selectedState) {
            const state = states.find(
                (s) => s.name.toUpperCase() === initialData.state?.toUpperCase()
            );
            if (state) setSelectedState(state.id);
        }
    }, [initialData?.state, states]);

    useEffect(() => {
        if (initialData?.city && cities.length > 0 && !selectedCity) {
            const city = cities.find(
                (c) => c.name.toUpperCase() === initialData.city?.toUpperCase()
            );
            if (city) setSelectedCity(city.id);
        }
    }, [initialData?.city, cities]);


    // Load States when Country changes
    useEffect(() => {
        if (!selectedCountry) {
            setStates([]);
            setSelectedState("");
            return;
        }

        async function loadStates() {
            setLoadingStates(true);
            const { data } = await (supabase as any)
                .from("states")
                .select("*")
                .eq("country_id", selectedCountry)
                .order("name");
            setStates(data || []);
            setLoadingStates(false);
        }
        loadStates();
    }, [selectedCountry]);

    // Load Cities when State changes
    useEffect(() => {
        if (!selectedState) {
            setCities([]);
            setSelectedCity("");
            return;
        }

        async function loadCities() {
            setLoadingCities(true);
            const { data } = await (supabase as any)
                .from("cities")
                .select("*")
                .eq("state_id", selectedState)
                .order("name");
            setCities(data || []);
            setLoadingCities(false);
        }
        loadCities();
    }, [selectedState]);

    // Emit changes
    useEffect(() => {
        // Only emit when strict selection is made, or just pass empty strings if cleared
        const countryObj = countries.find((c) => c.id === selectedCountry);
        const stateObj = states.find((s) => s.id === selectedState);
        const cityObj = cities.find((c) => c.id === selectedCity);

        if (countryObj && stateObj && cityObj) {
            onLocationChange({
                country: countryObj.name,
                state: stateObj.name,
                city: cityObj.name,
                country_id: countryObj.id,
                state_id: stateObj.id,
                city_id: cityObj.id,
                latitude: cityObj.latitude,
                longitude: cityObj.longitude,
            });
        }
    }, [selectedCountry, selectedState, selectedCity]);

    return (
        <div className={cn("grid grid-cols-1 md:grid-cols-3 gap-4", className)}>
            {/* Country Selector */}
            <div className="space-y-2">
                {showLabels && <Label>País</Label>}
                <Popover open={openCountry} onOpenChange={setOpenCountry}>
                    <PopoverTrigger asChild>
                        <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={openCountry}
                            className="w-full justify-between"
                            disabled={loadingCountries}
                        >
                            {selectedCountry
                                ? countries.find((country) => country.id === selectedCountry)?.name
                                : "Selecione o país..."}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[200px] p-0">
                        <Command>
                            <CommandInput placeholder="Buscar país..." />
                            <CommandList>
                                <CommandEmpty>Nenhum país encontrado.</CommandEmpty>
                                <CommandGroup>
                                    {countries.map((country) => (
                                        <CommandItem
                                            key={country.id}
                                            value={country.name}
                                            onSelect={() => {
                                                setSelectedCountry(country.id === selectedCountry ? "" : country.id);
                                                setOpenCountry(false);
                                                // Reset state and city when country changes
                                                setSelectedState("");
                                                setSelectedCity("");
                                            }}
                                        >
                                            <Check
                                                className={cn(
                                                    "mr-2 h-4 w-4",
                                                    selectedCountry === country.id ? "opacity-100" : "opacity-0"
                                                )}
                                            />
                                            {country.name}
                                        </CommandItem>
                                    ))}
                                </CommandGroup>
                            </CommandList>
                        </Command>
                    </PopoverContent>
                </Popover>
            </div>

            {/* State Selector */}
            <div className="space-y-2">
                {showLabels && <Label>Estado</Label>}
                <Popover open={openState} onOpenChange={setOpenState}>
                    <PopoverTrigger asChild>
                        <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={openState}
                            className="w-full justify-between"
                            disabled={!selectedCountry || loadingStates}
                        >
                            {selectedState
                                ? states.find((state) => state.id === selectedState)?.name
                                : "Selecione o estado..."}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[200px] p-0">
                        <Command>
                            <CommandInput placeholder="Buscar estado..." />
                            <CommandList>
                                <CommandEmpty>Nenhum estado encontrado.</CommandEmpty>
                                <CommandGroup>
                                    {states.map((state) => (
                                        <CommandItem
                                            key={state.id}
                                            value={state.name}
                                            onSelect={() => {
                                                setSelectedState(state.id === selectedState ? "" : state.id);
                                                setOpenState(false);
                                                // Reset city when state changes
                                                setSelectedCity("");
                                            }}
                                        >
                                            <Check
                                                className={cn(
                                                    "mr-2 h-4 w-4",
                                                    selectedState === state.id ? "opacity-100" : "opacity-0"
                                                )}
                                            />
                                            {state.name}
                                        </CommandItem>
                                    ))}
                                </CommandGroup>
                            </CommandList>
                        </Command>
                    </PopoverContent>
                </Popover>
            </div>

            {/* City Selector */}
            <div className="space-y-2">
                {showLabels && <Label>Cidade</Label>}
                <Popover open={openCity} onOpenChange={setOpenCity}>
                    <PopoverTrigger asChild>
                        <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={openCity}
                            className="w-full justify-between"
                            disabled={!selectedState || loadingCities}
                        >
                            {selectedCity
                                ? cities.find((city) => city.id === selectedCity)?.name
                                : "Selecione a cidade..."}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[200px] p-0">
                        <Command>
                            <CommandInput placeholder="Buscar cidade..." />
                            <CommandList>
                                <CommandEmpty>Nenhuma cidade encontrada.</CommandEmpty>
                                <CommandGroup>
                                    {cities.map((city) => (
                                        <CommandItem
                                            key={city.id}
                                            value={city.name}
                                            onSelect={() => {
                                                setSelectedCity(city.id === selectedCity ? "" : city.id);
                                                setOpenCity(false);
                                            }}
                                        >
                                            <Check
                                                className={cn(
                                                    "mr-2 h-4 w-4",
                                                    selectedCity === city.id ? "opacity-100" : "opacity-0"
                                                )}
                                            />
                                            {city.name}
                                        </CommandItem>
                                    ))}
                                </CommandGroup>
                            </CommandList>
                        </Command>
                    </PopoverContent>
                </Popover>
            </div>
        </div>
    );
}
