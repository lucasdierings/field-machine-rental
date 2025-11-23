import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { MessageSquare, Mail } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { fadeIn } from '@/animations/onboarding';

interface FallbackOptionsProps {
    email: string;
    phone: string;
    onSendSMS: () => Promise<void>;
    disabled?: boolean;
}

export const FallbackOptions = ({
    email,
    phone,
    onSendSMS,
    disabled = false
}: FallbackOptionsProps) => {
    const [isSendingSMS, setIsSendingSMS] = useState(false);
    const { toast } = useToast();

    const handleSendSMS = async () => {
        setIsSendingSMS(true);
        try {
            await onSendSMS();
            toast({
                title: 'SMS enviado!',
                description: `Código enviado para ${phone}`,
            });
        } catch (error: any) {
            toast({
                title: 'Erro ao enviar SMS',
                description: error.message,
                variant: 'destructive',
            });
        } finally {
            setIsSendingSMS(false);
        }
    };

    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            className="w-full"
        >
            <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="fallback" className="border-none">
                    <AccordionTrigger className="text-sm text-gray-600 hover:no-underline">
                        Não recebeu o código?
                    </AccordionTrigger>
                    <AccordionContent>
                        <div className="space-y-3 pt-2">
                            {/* Email Info */}
                            <Card className="border-blue-200 bg-blue-50">
                                <CardContent className="flex items-start gap-3 p-4">
                                    <Mail className="mt-1 h-5 w-5 flex-shrink-0 text-blue-600" />
                                    <div className="flex-1 space-y-1">
                                        <p className="text-sm font-medium text-blue-900">
                                            Verifique sua caixa de spam
                                        </p>
                                        <p className="text-xs text-blue-700">
                                            Email enviado para: {email}
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* SMS Option */}
                            <Card>
                                <CardContent className="flex items-start gap-3 p-4">
                                    <MessageSquare className="mt-1 h-5 w-5 flex-shrink-0 text-primary" />
                                    <div className="flex-1 space-y-2">
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">
                                                Receber código por SMS
                                            </p>
                                            <p className="text-xs text-gray-600">
                                                Enviaremos para: {phone}
                                            </p>
                                        </div>
                                        <Button
                                            onClick={handleSendSMS}
                                            disabled={disabled || isSendingSMS}
                                            size="sm"
                                            variant="outline"
                                            className="w-full sm:w-auto"
                                        >
                                            {isSendingSMS ? 'Enviando...' : 'Enviar SMS'}
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </motion.div>
    );
};
