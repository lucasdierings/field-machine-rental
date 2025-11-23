import { Badge } from './badge';
import { ScrollArea, ScrollBar } from './scroll-area';
import { cn } from '@/lib/utils';

interface CategoryChipsProps {
    categories: string[];
    selectedCategories: string[];
    onCategoryToggle: (category: string) => void;
}

export function CategoryChips({
    categories,
    selectedCategories,
    onCategoryToggle
}: CategoryChipsProps) {
    return (
        <ScrollArea className="w-full whitespace-nowrap">
            <div className="flex gap-2 p-4">
                {categories.map((category) => {
                    const isSelected = selectedCategories.includes(category);
                    return (
                        <Badge
                            key={category}
                            variant={isSelected ? 'default' : 'outline'}
                            className={cn(
                                'cursor-pointer px-4 py-2 text-sm font-medium transition-all hover:scale-105',
                                isSelected && 'bg-primary text-primary-foreground shadow-md'
                            )}
                            onClick={() => onCategoryToggle(category)}
                        >
                            {category}
                        </Badge>
                    );
                })}
            </div>
            <ScrollBar orientation="horizontal" />
        </ScrollArea>
    );
}
