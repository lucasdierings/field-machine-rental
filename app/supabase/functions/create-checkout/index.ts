import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

/**
 * Confirma uma reserva entre as partes (modelo peer-to-peer).
 * O pagamento é combinado diretamente entre locatário e proprietário,
 * fora da plataforma (similar ao BlaBlaCar).
 */
serve(async (req: Request) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const supabase = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_ANON_KEY') ?? ''
        )

        const { bookingId, action } = await req.json()

        if (!bookingId) {
            throw new Error('Booking ID is required')
        }

        // Get booking details
        const { data: booking, error: bookingError } = await supabase
            .from('bookings')
            .select(`
                *,
                machine:machines(name, description),
                renter:user_profiles!bookings_renter_id_fkey(full_name, email),
                owner:user_profiles!bookings_owner_id_fkey(full_name, email)
            `)
            .eq('id', bookingId)
            .single()

        if (bookingError || !booking) {
            throw new Error('Booking not found')
        }

        // Confirm booking (owner accepts the request)
        if (action === 'confirm') {
            await supabase
                .from('bookings')
                .update({
                    status: 'confirmed',
                    payment_status: 'peer_to_peer'
                })
                .eq('id', bookingId)

            return new Response(
                JSON.stringify({
                    success: true,
                    message: 'Reserva confirmada. O pagamento deve ser combinado diretamente entre as partes.',
                    booking: {
                        id: booking.id,
                        status: 'confirmed',
                        total_amount: booking.total_amount,
                        renter: booking.renter?.full_name,
                        owner: booking.owner?.full_name
                    }
                }),
                {
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                    status: 200,
                }
            )
        }

        // Reject booking
        if (action === 'reject') {
            await supabase
                .from('bookings')
                .update({
                    status: 'cancelled',
                    cancellation_reason: 'Recusado pelo proprietário'
                })
                .eq('id', bookingId)

            return new Response(
                JSON.stringify({
                    success: true,
                    message: 'Reserva recusada.',
                }),
                {
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                    status: 200,
                }
            )
        }

        throw new Error('Invalid action. Use "confirm" or "reject".')

    } catch (error: any) {
        return new Response(
            JSON.stringify({ error: error.message }),
            {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 400,
            }
        )
    }
})
