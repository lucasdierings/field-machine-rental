import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";

interface AppError {
  type: string;
  message: string;
  file?: string;
  line?: number;
  time: string;
}

declare global {
  interface Window {
    __APP_ERRORS?: AppError[];
  }
}

export function AdminDebugOverlay() {
  const { isAdmin } = useAuth();
  const [errors, setErrors] = useState<AppError[]>([]);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (!isAdmin) return;

    const check = () => {
      const appErrors = window.__APP_ERRORS || [];
      if (appErrors.length > 0) setErrors([...appErrors]);
    };

    check();
    const interval = setInterval(check, 3000);
    return () => clearInterval(interval);
  }, [isAdmin]);

  if (!isAdmin || errors.length === 0 || dismissed) return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: 16,
        right: 16,
        maxWidth: 420,
        maxHeight: 300,
        overflow: "auto",
        background: "rgba(0,0,0,0.9)",
        color: "#fff",
        padding: 16,
        borderRadius: 8,
        fontFamily: "monospace",
        fontSize: 11,
        zIndex: 99999,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
        <strong style={{ color: "#f87171" }}>Debug ({errors.length} erro{errors.length > 1 ? "s" : ""})</strong>
        <button onClick={() => setDismissed(true)} style={{ background: "none", border: "none", color: "#9ca3af", cursor: "pointer" }}>
          X
        </button>
      </div>
      {errors.map((err, i) => (
        <div key={i} style={{ padding: 6, marginBottom: 4, background: "#1f2937", borderRadius: 4 }}>
          <span style={{ color: "#f87171" }}>[{err.type}]</span> {err.message}
          {err.file && <div style={{ color: "#6b7280", fontSize: 10 }}>{err.file}:{err.line}</div>}
        </div>
      ))}
    </div>
  );
}
