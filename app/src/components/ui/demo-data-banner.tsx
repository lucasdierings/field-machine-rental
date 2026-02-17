import { Info, X } from 'lucide-react';
import { Alert, AlertDescription } from './alert';
import { Button } from './button';
import { useState } from 'react';

interface DemoDataBannerProps {
    onRegisterClick?: () => void;
}

export function DemoDataBanner({ onRegisterClick }: DemoDataBannerProps) {
    const [isVisible, setIsVisible] = useState(true);

    if (!isVisible) return null;

    return (
        <Alert className="mb-4 bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
            <Info className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            <AlertDescription className="flex items-center justify-between gap-4">
                <span className="text-sm text-blue-900 dark:text-blue-100">
                    <strong>Dados de demonstração:</strong> Cadastre suas máquinas para ver dados reais e começar a alugar.
                </span>
                <div className="flex items-center gap-2">
                    {onRegisterClick && (
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={onRegisterClick}
                            className="border-blue-300 dark:border-blue-700 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/30 whitespace-nowrap"
                        >
                            Cadastrar máquina
                        </Button>
                    )}
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsVisible(false)}
                        className="h-8 w-8 p-0 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30"
                    >
                        <X className="h-4 w-4" />
                    </Button>
                </div>
            </AlertDescription>
        </Alert>
    );
}
