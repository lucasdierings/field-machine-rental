import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export default function SupabaseConnectionTest() {
    const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function checkConnection() {
            try {
                const { data, error } = await supabase.auth.getSession();
                if (error) {
                    throw error;
                }
                setStatus("success");
            } catch (err: any) {
                setStatus("error");
                setError(err);
            }
        }

        checkConnection();
    }, []);

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Supabase Connection Test</h1>

            <div className="mb-4 text-sm text-gray-600">
                <p>URL: {import.meta.env.VITE_SUPABASE_URL ? "Defined" : "Missing"}</p>
                <p>Key: {import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ? "Defined" : "Missing"}</p>
            </div>

            {status === "loading" && <p>Checking connection...</p>}
            {status === "success" && <p className="text-green-600">Connection successful!</p>}
            {status === "error" && (
                <div className="text-red-600">
                    <p>Connection failed:</p>
                    <pre className="whitespace-pre-wrap break-all bg-gray-100 p-2 rounded mt-2 text-xs">
                        {(error as any) instanceof Error ? (error as any).message : JSON.stringify(error, null, 2)}
                    </pre>
                </div>
            )}
        </div>
    );
}
