import { Loader2 } from "lucide-react";

interface PageLoaderProps {
    message?: string;
}

export function PageLoader({ message }: PageLoaderProps) {
    return (
        <div
            className="flex flex-col items-center justify-center min-h-screen gap-3"
            style={{
                backgroundColor: '#ffffff',
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                zIndex: 9999
            }}
        >
            <Loader2
                className="h-8 w-8 animate-spin"
                style={{ color: '#16a34a' }}
            />
            {message && (
                <p
                    className="text-sm animate-pulse"
                    style={{ color: '#666' }}
                >
                    {message}
                </p>
            )}
        </div>
    );
}
