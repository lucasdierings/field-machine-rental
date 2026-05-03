import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const ALLOWED_ORIGINS = [
    'https://app.fieldmachine.com.br',
    'https://fieldmachine.com.br',
    'https://www.fieldmachine.com.br',
    'https://field-machine-rental.pages.dev',
    'http://localhost:5173',
    'http://localhost:8080',
]

const isAllowedOrigin = (origin: string | null): boolean => {
    if (!origin) return true
    if (ALLOWED_ORIGINS.includes(origin)) return true
    return /^https:\/\/[a-z0-9-]+\.field-machine-rental\.pages\.dev$/.test(origin)
}

const buildCorsHeaders = (origin: string | null): Record<string, string> => ({
    'Access-Control-Allow-Origin': origin && isAllowedOrigin(origin) ? origin : ALLOWED_ORIGINS[0],
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Vary': 'Origin',
})

const jsonResponse = (
    body: Record<string, unknown>,
    status: number,
    corsHeaders: Record<string, string>,
) =>
    new Response(JSON.stringify(body), {
        status,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })

/**
 * Webhook handler para eventos da plataforma.
 * Com o modelo peer-to-peer, este handler processa eventos de
 * confirmação de serviço e avaliações, não mais pagamentos.
 */
serve(async (req: Request) => {
    const origin = req.headers.get('origin')
    const corsHeaders = buildCorsHeaders(origin)

    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    if (req.method !== 'POST') {
        return jsonResponse({ error: 'Method not allowed' }, 405, corsHeaders)
    }

    if (!isAllowedOrigin(origin)) {
        return jsonResponse({ error: 'Origin not allowed' }, 403, corsHeaders)
    }

    try {
        const url = new URL(req.url)
        const eventType = url.searchParams.get('type')
        const authHeader = req.headers.get('Authorization')

        if (!authHeader?.startsWith('Bearer ')) {
            return jsonResponse({ error: 'Authentication required' }, 401, corsHeaders)
        }

        const supabase = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_ANON_KEY') ?? '',
            {
                auth: {
                    persistSession: false,
                    autoRefreshToken: false,
                },
                global: {
                    headers: { Authorization: authHeader },
                },
            },
        )

        const { data: { user }, error: userError } = await supabase.auth.getUser()
        if (userError || !user) {
            return jsonResponse({ error: 'Invalid token' }, 401, corsHeaders)
        }

        if (eventType === 'service_completed') {
            const { bookingId } = await req.json()

            if (!bookingId) {
                return jsonResponse({ error: 'Missing booking ID' }, 400, corsHeaders)
            }

            const { data: booking, error: bookingError } = await supabase
                .from('bookings')
                .select('id, renter_id, owner_id, status')
                .eq('id', bookingId)
                .single()

            if (bookingError || !booking) {
                return jsonResponse({ error: 'Booking not found' }, 404, corsHeaders)
            }

            if (booking.renter_id !== user.id && booking.owner_id !== user.id) {
                return jsonResponse({ error: 'Not authorized for this booking' }, 403, corsHeaders)
            }

            const { error: updateError } = await supabase
                .from('bookings')
                .update({
                    status: 'completed',
                    completed_at: new Date().toISOString(),
                })
                .eq('id', bookingId)
                .or(`renter_id.eq.${user.id},owner_id.eq.${user.id}`)

            if (updateError) {
                return jsonResponse({ error: updateError.message }, 400, corsHeaders)
            }

            return jsonResponse({ success: true }, 200, corsHeaders)
        }

        return jsonResponse({ error: 'Unknown event type' }, 400, corsHeaders)

    } catch (error: unknown) {
        console.error('Webhook Error:', error)
        const message = error instanceof Error ? error.message : 'Webhook error'
        return jsonResponse({ error: message }, 400, corsHeaders)
    }
})
