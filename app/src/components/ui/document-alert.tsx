import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertCircle, FileCheck, Clock, XCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface DocumentAlertProps {
    status: {
        hasDocuments: boolean;
        hasPending: boolean;
        hasApproved: boolean;
        hasRejected: boolean;
        totalDocuments: number;
    };
    context?: "booking" | "machine" | "dashboard";
}

export const DocumentAlert = ({ status, context = "dashboard" }: DocumentAlertProps) => {
    const navigate = useNavigate();

    // Se já tem documentos aprovados, não mostra nada
    if (status.hasApproved) {
        return null;
    }

    const getContextMessage = () => {
        switch (context) {
            case "booking":
                return "Para realizar reservas, você precisa ter documentos aprovados.";
            case "machine":
                return "Para disponibilizar máquinas, você precisa ter documentos aprovados.";
            default:
                return "Complete sua verificação para usar todos os recursos da plataforma.";
        }
    };

    const getIcon = () => {
        if (status.hasRejected) {
            return <XCircle className="h-5 w-5" />;
        }
        if (status.hasPending) {
            return <Clock className="h-5 w-5" />;
        }
        return <AlertCircle className="h-5 w-5" />;
    };

    const getTitle = () => {
        if (status.hasRejected) {
            return "Documento(s) Rejeitado(s)";
        }
        if (status.hasPending) {
            return "Documentos em Análise";
        }
        return "Verificação Pendente";
    };

    const getDescription = () => {
        if (status.hasRejected) {
            return "Alguns documentos foram rejeitados. Envie novos documentos para continuar.";
        }
        if (status.hasPending) {
            return "Seus documentos estão sendo analisados. Aguarde a aprovação para usar todos os recursos.";
        }
        return getContextMessage();
    };

    const getVariant = () => {
        if (status.hasRejected) {
            return "destructive" as const;
        }
        if (status.hasPending) {
            return "default" as const;
        }
        return "default" as const;
    };

    return (
        <Alert variant={getVariant()} className="mb-4">
            <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                    {getIcon()}
                    <div className="flex-1">
                        <AlertTitle className="mb-1">{getTitle()}</AlertTitle>
                        <AlertDescription>{getDescription()}</AlertDescription>
                    </div>
                </div>
                {!status.hasPending && (
                    <Button
                        onClick={() => navigate("/dashboard/perfil?tab=documents")}
                        variant={status.hasRejected ? "destructive" : "default"}
                        size="sm"
                        className="ml-4 whitespace-nowrap"
                    >
                        <FileCheck className="mr-2 h-4 w-4" />
                        {status.hasDocuments ? "Ver Documentos" : "Enviar Documentos"}
                    </Button>
                )}
                {status.hasPending && (
                    <Button
                        onClick={() => navigate("/dashboard/perfil?tab=documents")}
                        variant="outline"
                        size="sm"
                        className="ml-4 whitespace-nowrap"
                    >
                        Ver Status
                    </Button>
                )}
            </div>
        </Alert>
    );
};
