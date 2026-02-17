import { Tractor, AlertCircle } from 'lucide-react';
import { Button } from './button';
import { useNavigate } from 'react-router-dom';

interface EmptyMachineStateProps {
    onClearFilters?: () => void;
    showClearFilters?: boolean;
}

export function EmptyMachineState({
    onClearFilters,
    showClearFilters = true
}: EmptyMachineStateProps) {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
            <div className="relative mb-6">
                <div className="absolute inset-0 bg-primary/10 blur-3xl rounded-full" />
                <Tractor className="relative h-24 w-24 text-primary/60" strokeWidth={1.5} />
            </div>

            <h3 className="text-2xl font-semibold mb-2 text-foreground">
                Nenhuma máquina encontrada
            </h3>

            <p className="text-muted-foreground mb-8 max-w-md">
                Não encontramos máquinas com os filtros selecionados.
                Tente ajustar seus critérios de busca ou expandir a área.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
                <Button
                    onClick={() => navigate('/add-machine')}
                    size="lg"
                    className="gap-2"
                >
                    <Tractor className="h-4 w-4" />
                    Cadastre sua máquina
                </Button>

                {showClearFilters && onClearFilters && (
                    <Button
                        onClick={onClearFilters}
                        variant="outline"
                        size="lg"
                        className="gap-2"
                    >
                        <AlertCircle className="h-4 w-4" />
                        Limpar filtros
                    </Button>
                )}
            </div>
        </div>
    );
}
