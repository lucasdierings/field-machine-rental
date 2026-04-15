/**
 * Mapeia mensagens/códigos de erro do Supabase Auth para mensagens
 * amigáveis em PT-BR para serem exibidas ao usuário.
 *
 * O Supabase retorna mensagens em inglês e às vezes com códigos no objeto
 * `error.code` (ex: "over_email_send_rate_limit"). Esta função normaliza
 * tudo isso em um texto que o usuário consiga entender.
 */

interface SupabaseAuthError {
  message?: string;
  code?: string;
  status?: number;
}

const TRANSLATIONS: Array<{ test: RegExp; message: string }> = [
  // Rate limits
  {
    test: /over_email_send_rate_limit|email rate limit exceeded|For security purposes, you can only request this after/i,
    message:
      "Muitas tentativas em pouco tempo. Aguarde alguns segundos antes de tentar de novo.",
  },
  {
    test: /over_request_rate_limit/i,
    message: "Muitas requisições. Aguarde um momento antes de tentar novamente.",
  },

  // Credenciais
  {
    test: /invalid login credentials|invalid_credentials/i,
    message: "Email ou senha incorretos.",
  },
  {
    test: /email not confirmed|email_not_confirmed/i,
    message:
      "Seu email ainda não foi confirmado. Verifique sua caixa de entrada.",
  },

  // Usuário já existe
  {
    test: /user already registered|user_already_exists|already registered/i,
    message: "Já existe uma conta com este email. Tente fazer login.",
  },
  {
    test: /email address.*invalid|invalid email/i,
    message: "Email inválido.",
  },

  // Senha
  {
    test: /password should be at least|weak_password/i,
    message:
      "Senha muito fraca. Use ao menos 8 caracteres com maiúscula, minúscula, número e caractere especial.",
  },
  {
    test: /same_password|new password should be different/i,
    message: "A nova senha deve ser diferente da atual.",
  },

  // Token / sessão
  {
    test: /invalid token|token has expired|expired_token|otp_expired/i,
    message: "Código ou link expirado. Solicite um novo.",
  },
  {
    test: /session_not_found|jwt expired|invalid session/i,
    message: "Sua sessão expirou. Faça login novamente.",
  },

  // Network
  {
    test: /failed to fetch|network|networkerror/i,
    message: "Falha de conexão. Verifique sua internet e tente novamente.",
  },
];

export const translateSupabaseAuthError = (
  error: SupabaseAuthError | Error | unknown
): string => {
  const message =
    typeof error === "object" && error !== null
      ? (error as SupabaseAuthError).message ?? ""
      : String(error ?? "");
  const code =
    typeof error === "object" && error !== null
      ? (error as SupabaseAuthError).code ?? ""
      : "";

  const haystack = `${code} ${message}`;

  for (const { test, message: translated } of TRANSLATIONS) {
    if (test.test(haystack)) {
      return translated;
    }
  }

  // Fallback: mostra a mensagem original sem expor códigos técnicos.
  return message || "Erro inesperado. Tente novamente.";
};
