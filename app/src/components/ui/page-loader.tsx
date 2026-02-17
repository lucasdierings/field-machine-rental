import { Loader2 } from "lucide-react";

interface PageLoaderProps {
    message?: string;
}

export function PageLoader({ message }: PageLoaderProps) {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            {message && (
                <p className="text-sm text-muted-foreground animate-pulse">{message}</p>
            )}
        </div>
    );
}
