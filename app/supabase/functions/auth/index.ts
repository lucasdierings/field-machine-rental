import { Hono } from 'https://deno.land/x/hono@v4.0.0/mod.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// ---- Config ----
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY')!;

const ALLOWED_ORIGINS = [
    'https://app.fieldmachine.com.br',
    'https://fieldmachine.com.br',
    'https://www.fieldmachine.com.br',
    'https://field-machine-rental.pages.dev',
    'http://localhost:5173',
    'http://localhost:8080',
];

const isAllowedOrigin = (origin: string | undefined): boolean => {
    if (!origin) return true;
    if (ALLOWED_ORIGINS.includes(origin)) return true;
    return /^https:\/\/[a-z0-9-]+\.field-machine-rental\.pages\.dev$/.test(origin);
};

const publicClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
        persistSession: false,
        autoRefreshToken: false,
    },
});

const createUserClient = (authHeader: string) =>
    createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
        auth: {
            persistSession: false,
            autoRefreshToken: false,
        },
        global: {
            headers: { Authorization: authHeader },
        },
    });

const app = new Hono();

app.use('*', async (c, next) => {
    const origin = c.req.header('Origin');
    const allowedOrigin = origin && isAllowedOrigin(origin) ? origin : ALLOWED_ORIGINS[0];

    c.header('Access-Control-Allow-Origin', allowedOrigin);
    c.header('Access-Control-Allow-Headers', 'authorization, x-client-info, apikey, content-type');
    c.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    c.header('Vary', 'Origin');

    if (c.req.method === 'OPTIONS') {
        return c.text('ok', 200);
    }

    if (!isAllowedOrigin(origin)) {
        return c.json({ error: 'Origin not allowed' }, 403);
    }

    await next();
});

// ============================================
// SIGNUP - Usa Supabase Auth com verificação de email
// ============================================
app.post('/signup', async (c) => {
    try {
        const { email, password, full_name, cpf_cnpj, phone, user_type } = await c.req.json();

        if (!email || !password) {
            return c.json({ error: 'Email e senha são obrigatórios' }, 400);
        }

        const { data, error } = await publicClient.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: full_name || '',
                    cpf_cnpj: cpf_cnpj || '',
                    phone: phone || '',
                    user_type: user_type || 'producer'
                }
            },
        });

        if (error) {
            return c.json({ error: error.message }, 400);
        }

        return c.json({
            user: data.user,
            message: 'Usuário criado com sucesso. Verifique seu email para confirmar a conta.',
            email_sent: true
        });

    } catch (error: unknown) {
        console.error('Erro no signup:', error);
        return c.json({ error: 'Erro ao criar usuário' }, 500);
    }
});

// ============================================
// LOGIN - Usa Supabase Auth signInWithPassword
// ============================================
app.post('/login', async (c) => {
    try {
        const { email, password } = await c.req.json();

        if (!email || !password) {
            return c.json({ error: 'Email e senha são obrigatórios' }, 400);
        }

        // Cliente temporário para fazer login
        const { data, error } = await publicClient.auth.signInWithPassword({
            email,
            password
        });

        if (error) {
            return c.json({ error: 'Credenciais inválidas' }, 401);
        }

        return c.json({
            session: data.session,
            user: data.user
        });

    } catch (error: unknown) {
        console.error('Erro no login:', error);
        return c.json({ error: 'Erro ao fazer login' }, 500);
    }
});

// ============================================
// VERIFICAR STATUS DE EMAIL
// ============================================
app.get('/verify-status', async (c) => {
    try {
        const authHeader = c.req.header('Authorization');
        if (!authHeader) {
            return c.json({ error: 'Token não fornecido' }, 401);
        }

        const token = authHeader.replace('Bearer ', '');

        const { data: { user }, error } = await publicClient.auth.getUser(token);

        if (error || !user) {
            return c.json({ error: 'Token inválido' }, 401);
        }

        return c.json({
            email_verified: !!user.email_confirmed_at,
            email_verified_at: user.email_confirmed_at,
            user_id: user.id
        });

    } catch (error: unknown) {
        console.error('Erro ao verificar status:', error);
        return c.json({ error: 'Erro ao verificar status' }, 500);
    }
});

// ============================================
// REENVIAR EMAIL DE VERIFICAÇÃO
// ============================================
app.post('/resend-verification', async (c) => {
    try {
        const { email } = await c.req.json();

        if (!email) {
            return c.json({ error: 'Email é obrigatório' }, 400);
        }

        const { error } = await publicClient.auth.resend({
            type: 'signup',
            email,
        });

        if (error) {
            console.warn('Falha ao reenviar verificação:', error.message);
        }

        return c.json({
            message: 'Se o email estiver cadastrado, enviaremos uma nova verificação.',
            email_sent: true
        });

    } catch (error: unknown) {
        console.error('Erro ao reenviar email:', error);
        return c.json({ error: 'Erro ao reenviar email' }, 500);
    }
});

// ============================================
// OBTER STATUS DE PERFIL COMPLETO
// ============================================
app.get('/profile-status', async (c) => {
    try {
        const authHeader = c.req.header('Authorization');
        if (!authHeader) {
            return c.json({ error: 'Token não fornecido' }, 401);
        }

        const token = authHeader.replace('Bearer ', '');

        const { data: { user }, error } = await publicClient.auth.getUser(token);

        if (error || !user) {
            return c.json({ error: 'Token inválido' }, 401);
        }

        const supabaseUser = createUserClient(authHeader);

        const { data: profile, error: profileError } = await supabaseUser
            .from('user_profiles')
            .select('profile_completed, profile_completion_step, email_verified_at')
            .eq('auth_user_id', user.id)
            .single();

        if (profileError) {
            return c.json({ error: 'Erro ao buscar perfil' }, 500);
        }

        return c.json({
            email_verified: !!user.email_confirmed_at,
            profile_completed: profile?.profile_completed || false,
            profile_completion_step: profile?.profile_completion_step || 1,
            can_create_booking: !!user.email_confirmed_at
        });

    } catch (error: unknown) {
        console.error('Erro ao buscar status do perfil:', error);
        return c.json({ error: 'Erro ao buscar status do perfil' }, 500);
    }
});

Deno.serve(app.fetch);
