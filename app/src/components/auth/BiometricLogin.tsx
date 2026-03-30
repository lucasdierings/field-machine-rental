import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Fingerprint, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import {
  isBiometricAvailable,
  isBiometricEnabled,
  getBiometricCredentials,
  getBiometricLabel,
  removeBiometricCredentials,
  setBiometricEnabled,
} from '@/lib/biometric';

const MAX_FAILURES = 3;

export function BiometricLogin() {
  const [available, setAvailable] = useState(false);
  const [biometryType, setBiometryType] = useState('');
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [failures, setFailures] = useState(0);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    async function check() {
      const enabled = await isBiometricEnabled();
      if (!enabled) return;

      const { available: isAvail, type } = await isBiometricAvailable();
      if (isAvail) {
        setAvailable(true);
        setBiometryType(type);
      }
    }
    check();
  }, []);

  const handleBiometricLogin = async () => {
    setIsAuthenticating(true);
    try {
      const credentials = await getBiometricCredentials();

      if (!credentials) {
        const newFailures = failures + 1;
        setFailures(newFailures);

        if (newFailures >= MAX_FAILURES) {
          toast({
            title: 'Biometria desativada',
            description: 'Muitas tentativas. Use email e senha.',
            variant: 'destructive',
          });
          // Disable after too many failures
          await setBiometricEnabled(false);
          await removeBiometricCredentials();
          setAvailable(false);
        } else {
          toast({
            title: 'Autenticacao cancelada',
            description: `Tentativa ${newFailures}/${MAX_FAILURES}. Use email e senha se preferir.`,
            variant: 'destructive',
          });
        }
        return;
      }

      const { error } = await supabase.auth.refreshSession({
        refresh_token: credentials.refreshToken,
      });

      if (error) {
        toast({
          title: 'Sessao expirada',
          description: 'Faca login com email e senha para renovar.',
          variant: 'destructive',
        });
        await removeBiometricCredentials();
        setAvailable(false);
        return;
      }

      // Success — redirect
      navigate('/dashboard', { replace: true });
    } catch {
      toast({
        title: 'Erro na autenticacao',
        description: 'Tente novamente ou use email e senha.',
        variant: 'destructive',
      });
    } finally {
      setIsAuthenticating(false);
    }
  };

  if (!available || failures >= MAX_FAILURES) return null;

  const label = getBiometricLabel(biometryType);

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-3"
    >
      <Button
        variant="outline"
        onClick={handleBiometricLogin}
        disabled={isAuthenticating}
        className="w-full h-14 text-base"
      >
        {isAuthenticating ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Autenticando...
          </>
        ) : (
          <>
            <Fingerprint className="mr-2 h-5 w-5" />
            Entrar com {label}
          </>
        )}
      </Button>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            ou entre com email
          </span>
        </div>
      </div>
    </motion.div>
  );
}
