import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

/**
 * Webhook handler para eventos da plataforma.
 * Com o modelo peer-to-peer, este handler processa eventos de
 * confirmação de serviço e avaliações, não mais pagamentos.
 */
serve(async (req: Request) => {
    try {
        const url = new URL(req.url)
        const eventType = url.searchParams.get('type')

        const supabase = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
        )

        // Handle service completion notifications
        if (eventType === 'service_completed') {
            const { bookingId } = await req.json()

            if (!bookingId) {
                return new Response('Missing booking ID', { status: 400 })
            }

            // Update booking status to completed
            await supabase
                .from('bookings')
                .update({
                    status: 'completed'
                })
                .eq('id', bookingId)

            // TODO: Send notification to both parties to leave reviews

            return new Response('OK', { status: 200 })
        }

        // Default response for unknown event types
        return new Response('OK', { status: 200 })

    } catch (error: any) {
        console.error('Webhook Error:', error)
        return new Response(JSON.stringify({ error: error.message }), { status: 400 })
    }
})
