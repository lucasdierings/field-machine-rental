import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail, AlertCircle } from 'lucide-react';
import { validateEmail } from '@/lib/validation';
import { useToast } from '@/hooks/use-toast';

interface EmailChangeDialogProps {
    isOpen: boolean;
    onClose: () => void;
    currentEmail: string;
    onChangeEmail: (newEmail: string) => Promise<void>;
}

export const EmailChangeDialog = ({
    isOpen,
    onClose,
    currentEmail,
    onChangeEmail
}: EmailChangeDialogProps) => {
    const [newEmail, setNewEmail] = useState('');
    const [isChanging, setIsChanging] = useState(false);
    const [error, setError] = useState('');
    const { toast } = useToast();

    const handleChange = async () => {
        // Validate
        if (!newEmail) {
            setError('Digite um email');
            return;
        }

        if (!validateEmail(newEmail)) {
            setError('Email inválido');
            return;
        }

        if (newEmail === currentEmail) {
            setError('Este email já está cadastrado');
            return;
        }

        setIsChanging(true);
        setError('');

        try {
            await onChangeEmail(newEmail);
            toast({
                title: 'Email atualizado!',
                description: 'Novo código de verificação enviado',
            });
            onClose();
            setNewEmail('');
        } catch (error: any) {
            setError(error.message || 'Erro ao atualizar email');
        } finally {
            setIsChanging(false);
        }
    };

    const handleClose = () => {
        if (!isChanging) {
            setNewEmail('');
            setError('');
            onClose();
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="w-[calc(100%-2rem)] max-w-md rounded-lg sm:w-full">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-lg sm:text-xl">
                        <Mail className="h-5 w-5 text-primary" />
                        Alterar Email
                    </DialogTitle>
                    <DialogDescription className="text-sm sm:text-base">
                        Digite o novo endereço de email. Enviaremos um novo código de verificação.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    {/* Current Email */}
                    <div className="space-y-2">
                        <Label className="text-sm text-gray-600">Email atual</Label>
                        <div className="rounded-md bg-gray-100 p-3 text-sm text-gray-700">
                            {currentEmail}
                        </div>
                    </div>

                    {/* New Email */}
                    <div className="space-y-2">
                        <Label htmlFor="newEmail">Novo email</Label>
                        <Input
                            id="newEmail"
                            type="email"
                            placeholder="seu.novo@email.com"
                            value={newEmail}
                            onChange={(e) => {
                                setNewEmail(e.target.value);
                                setError('');
                            }}
                            className={error ? 'border-destructive' : ''}
                            disabled={isChanging}
                        />
                        {error && (
                            <div className="flex items-center gap-2 text-sm text-destructive">
                                <AlertCircle className="h-4 w-4" />
                                <span>{error}</span>
                            </div>
                        )}
                    </div>
                </div>

                <DialogFooter className="flex-col gap-2 sm:flex-row">
                    <Button
                        variant="outline"
                        onClick={handleClose}
                        disabled={isChanging}
                        className="w-full sm:w-auto"
                    >
                        Cancelar
                    </Button>
                    <Button
                        onClick={handleChange}
                        disabled={isChanging || !newEmail}
                        className="w-full bg-primary hover:bg-primary/90 sm:w-auto"
                    >
                        {isChanging ? 'Atualizando...' : 'Atualizar Email'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
