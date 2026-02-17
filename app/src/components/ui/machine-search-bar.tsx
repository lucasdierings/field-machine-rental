import { Search, X } from 'lucide-react';
import { Input } from './input';
import { Button } from './button';
import { useState, useEffect } from 'react';

interface MachineSearchBarProps {
    onSearchChange: (query: string) => void;
    placeholder?: string;
    initialValue?: string;
}

export function MachineSearchBar({
    onSearchChange,
    placeholder = "Buscar máquinas...",
    initialValue = ""
}: MachineSearchBarProps) {
    const [searchQuery, setSearchQuery] = useState(initialValue);

    useEffect(() => {
        const debounceTimer = setTimeout(() => {
            onSearchChange(searchQuery);
        }, 300); // Debounce search input

        return () => clearTimeout(debounceTimer);
    }, [searchQuery, onSearchChange]);

    const handleClear = () => {
        setSearchQuery('');
    };

    return (
        <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
                type="text"
                placeholder={placeholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-10 h-12 text-base"
            />
            {searchQuery && (
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleClear}
                    className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
                >
                    <X className="h-4 w-4" />
                </Button>
            )}
        </div>
    );
}
