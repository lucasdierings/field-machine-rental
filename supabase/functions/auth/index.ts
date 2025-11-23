import { Hono, Context } from 'https://deno.land/x/hono@v4.0.0/mod.ts';
import { cors } from 'https://deno.land/x/hono@v4.0.0/middleware/cors.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// ---- Config ----
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY')!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

// Cliente com service role para operações administrativas
const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

const app = new Hono();
app.use('*', cors());

// ============================================
// SIGNUP - Usa Supabase Auth com verificação de email
// ============================================
app.post('/signup', async (c: Context) => {
    try {
        const { email, password, full_name, cpf_cnpj, phone, user_type } = await c.req.json();

        if (!email || !password) {
            return c.json({ error: 'Email e senha são obrigatórios' }, 400);
        }

        // Cria usuário com Supabase Auth (envia email de verificação automaticamente)
        const { data, error } = await supabaseAdmin.auth.admin.createUser({
            email,
            password,
            email_confirm: false, // Requer confirmação de email
            user_metadata: {
                full_name: full_name || '',
                cpf_cnpj: cpf_cnpj || '',
                phone: phone || '',
                user_type: user_type || 'producer'
            }
        });

        if (error) {
            return c.json({ error: error.message }, 400);
        }

        // Envia email de verificação
        const { error: emailError } = await supabaseAdmin.auth.admin.generateLink({
            type: 'signup',
            email: email,
        });

        if (emailError) {
            console.error('Erro ao enviar email de verificação:', emailError);
        }

        return c.json({
            user: data.user,
            message: 'Usuário criado com sucesso. Verifique seu email para confirmar a conta.',
            email_sent: !emailError
        });

    } catch (error: any) {
        console.error('Erro no signup:', error);
        return c.json({ error: 'Erro ao criar usuário' }, 500);
    }
});

// ============================================
// LOGIN - Usa Supabase Auth signInWithPassword
// ============================================
app.post('/login', async (c: Context) => {
    try {
        const { email, password } = await c.req.json();

        if (!email || !password) {
            return c.json({ error: 'Email e senha são obrigatórios' }, 400);
        }

        // Cliente temporário para fazer login
        const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

        const { data, error } = await supabaseClient.auth.signInWithPassword({
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

    } catch (error: any) {
        console.error('Erro no login:', error);
        return c.json({ error: 'Erro ao fazer login' }, 500);
    }
});

// ============================================
// VERIFICAR STATUS DE EMAIL
// ============================================
app.get('/verify-status', async (c: Context) => {
    try {
        const authHeader = c.req.header('Authorization');
        if (!authHeader) {
            return c.json({ error: 'Token não fornecido' }, 401);
        }

        const token = authHeader.replace('Bearer ', '');

        const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);

        if (error || !user) {
            return c.json({ error: 'Token inválido' }, 401);
        }

        return c.json({
            email_verified: !!user.email_confirmed_at,
            email_verified_at: user.email_confirmed_at,
            user_id: user.id
        });

    } catch (error: any) {
        console.error('Erro ao verificar status:', error);
        return c.json({ error: 'Erro ao verificar status' }, 500);
    }
});

// ============================================
// REENVIAR EMAIL DE VERIFICAÇÃO
// ============================================
app.post('/resend-verification', async (c: Context) => {
    try {
        const { email } = await c.req.json();

        if (!email) {
            return c.json({ error: 'Email é obrigatório' }, 400);
        }

        // Gera novo link de verificação
        const { data, error } = await supabaseAdmin.auth.admin.generateLink({
            type: 'signup',
            email: email,
        });

        if (error) {
            return c.json({ error: error.message }, 400);
        }

        return c.json({
            message: 'Email de verificação reenviado com sucesso',
            email_sent: true
        });

    } catch (error: any) {
        console.error('Erro ao reenviar email:', error);
        return c.json({ error: 'Erro ao reenviar email' }, 500);
    }
});

// ============================================
// OBTER STATUS DE PERFIL COMPLETO
// ============================================
app.get('/profile-status', async (c: Context) => {
    try {
        const authHeader = c.req.header('Authorization');
        if (!authHeader) {
            return c.json({ error: 'Token não fornecido' }, 401);
        }

        const token = authHeader.replace('Bearer ', '');

        const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);

        if (error || !user) {
            return c.json({ error: 'Token inválido' }, 401);
        }

        // Busca status do perfil
        const { data: profile, error: profileError } = await supabaseAdmin
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

    } catch (error: any) {
        console.error('Erro ao buscar status do perfil:', error);
        return c.json({ error: 'Erro ao buscar status do perfil' }, 500);
    }
});

export default app;
