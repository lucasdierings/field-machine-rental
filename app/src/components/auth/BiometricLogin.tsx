import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Fingerprint, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import {
  isBiometricAvailable,
  isBiometricEnabled,
  authenticateWithBiometric,
  getBiometricSession,
  getBiometricLabel,
} from '@/lib/biometric';

export function BiometricLogin() {
  const [available, setAvailable] = useState(false);
  const [biometryType, setBiometryType] = useState('');
  const [isAuthenticating, setIsAuthenticating] = useState(false);
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
      const success = await authenticateWithBiometric();
      if (!success) {
        toast({
          title: 'Autenticacao cancelada',
          description: 'Use email e senha para entrar.',
          variant: 'destructive',
        });
        return;
      }

      const refreshToken = await getBiometricSession();
      if (!refreshToken) {
        toast({
          title: 'Sessao expirada',
          description: 'Faca login com email e senha.',
          variant: 'destructive',
        });
        return;
      }

      const { error } = await supabase.auth.refreshSession({ refresh_token: refreshToken });
      if (error) {
        toast({
          title: 'Sessao expirada',
          description: 'Faca login com email e senha.',
          variant: 'destructive',
        });
        return;
      }

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

  if (!available) return null;

  const label = getBiometricLabel(biometryType);

  return (
    <Button
      variant="outline"
      onClick={handleBiometricLogin}
      disabled={isAuthenticating}
      className="w-full"
    >
      {isAuthenticating ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Autenticando...
        </>
      ) : (
        <>
          <Fingerprint className="mr-2 h-4 w-4" />
          Entrar com {label}
        </>
      )}
    </Button>
  );
}
