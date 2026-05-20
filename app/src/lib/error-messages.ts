/**
 * Sanitiza mensagens de erro do Supabase para o usuário final
 * Remove detalhes técnicos em produção para não expor informações sensíveis
 */

interface SupabaseError {
  message: string;
  code?: string;
  status?: number;
}

const ERROR_MESSAGES: Record<string, string> = {
  // Auth errors
  'User already registered': 'Este email já está cadastrado. Tente fazer login ou recuperar sua senha.',
  'Invalid login credentials': 'Email ou senha incorretos.',
  'Email not confirmed': 'Por favor, confirme seu email antes de fazer login.',
  'Invalid email': 'Email inválido.',
  'Weak password': 'A senha deve ter pelo menos 6 caracteres.',

  // Network errors
  'Failed to fetch': 'Erro de conexão. Verifique sua internet e tente novamente.',
  'Network error': 'Erro de conexão. Verifique sua internet e tente novamente.',

  // Database errors
  '23505': 'Este registro já existe no sistema.',
  '23503': 'Não foi possível completar a operação. Verifique os dados e tente novamente.',
  '42501': 'Você não tem permissão para realizar esta ação.',

  // Generic
  'default': 'Ocorreu um erro inesperado. Tente novamente em alguns instantes.',
};

/**
 * Converte erro do Supabase em mensagem amigável para o usuário
 */
export function getErrorMessage(error: unknown): string {
  // Desenvolvimento: mostrar erro completo
  if (import.meta.env.DEV) {
    const err = error as SupabaseError;
    return `${err.message} ${err.code ? `(Code: ${err.code})` : ''}`.trim();
  }

  // Produção: mensagens sanitizadas
  const err = error as SupabaseError;

  // Tentar encontrar mensagem específica
  if (err.message && ERROR_MESSAGES[err.message]) {
    return ERROR_MESSAGES[err.message];
  }

  // Tentar encontrar por código de erro
  if (err.code && ERROR_MESSAGES[err.code]) {
    return ERROR_MESSAGES[err.code];
  }

  // Mensagem genérica
  return ERROR_MESSAGES['default'];
}

/**
 * Mensagens de erro específicas por contexto
 */
export const AUTH_ERRORS = {
  signUp: {
    title: 'Erro ao criar conta',
    default: 'Não foi possível criar sua conta. Tente novamente.',
  },
  signIn: {
    title: 'Erro ao fazer login',
    default: 'Não foi possível fazer login. Verifique suas credenciais.',
  },
  signOut: {
    title: 'Erro ao sair',
    default: 'Não foi possível sair da conta. Tente novamente.',
  },
  resetPassword: {
    title: 'Erro ao recuperar senha',
    default: 'Não foi possível enviar email de recuperação. Verifique o endereço.',
  },
  verifyOtp: {
    title: 'Código inválido',
    default: 'O código digitado está incorreto ou expirou. Tente novamente.',
  },
} as const;

/**
 * Log de erro para monitoramento (pode integrar com Sentry, LogRocket, etc)
 */
export function logError(context: string, error: unknown) {
  // Em desenvolvimento, sempre logar no console
  if (import.meta.env.DEV) {
    console.error(`[${context}]`, error);
    return;
  }

  // Em produção, enviar para serviço de monitoramento
  // TODO: Integrar com Sentry ou similar
  console.error(`[${context}]`, {
    message: (error as Error).message,
    // Não logar stack trace completo em produção
  });
}
