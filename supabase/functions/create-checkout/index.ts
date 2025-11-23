import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"
import { MercadoPagoConfig, Preference } from 'https://esm.sh/mercadopago@2.0.8'

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req: Request) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const supabase = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_ANON_KEY') ?? ''
        )

        const { bookingId } = await req.json()

        if (!bookingId) {
            throw new Error('Booking ID is required')
        }

        // 1. Get booking details
        const { data: booking, error: bookingError } = await supabase
            .from('bookings')
            .select(`
        *,
        machine:machines(name, description),
        renter:user_profiles!bookings_renter_id_fkey(full_name, email)
      `)
            .eq('id', bookingId)
            .single()

        if (bookingError || !booking) {
            throw new Error('Booking not found')
        }

        // 2. Configure Mercado Pago
        const client = new MercadoPagoConfig({
            accessToken: Deno.env.get('MP_ACCESS_TOKEN') ?? ''
        });

        const preference = new Preference(client);

        // 3. Create Preference
        const result = await preference.create({
            body: {
                items: [
                    {
                        id: booking.id,
                        title: `Aluguel: ${booking.machine.name}`,
                        description: `Reserva de ${booking.start_date} a ${booking.end_date}`,
                        quantity: 1,
                        unit_price: Number(booking.total_amount),
                        currency_id: 'BRL',
                    }
                ],
                payer: {
                    name: booking.renter.full_name,
                    email: booking.renter.email,
                },
                back_urls: {
                    success: `${req.headers.get('origin')}/bookings/${booking.id}?status=success`,
                    failure: `${req.headers.get('origin')}/bookings/${booking.id}?status=failure`,
                    pending: `${req.headers.get('origin')}/bookings/${booking.id}?status=pending`,
                },
                auto_return: 'approved',
                external_reference: booking.id,
                notification_url: `${Deno.env.get('SUPABASE_URL')}/functions/v1/webhook-handler`,
                metadata: {
                    booking_id: booking.id,
                }
            }
        });

        // 4. Update booking with preference ID (optional, but good for tracking)
        await supabase
            .from('bookings')
            .update({
                payment_provider: 'mercadopago',
                payment_id: result.id
            })
            .eq('id', bookingId)

        return new Response(
            JSON.stringify({
                preferenceId: result.id,
                initPoint: result.init_point, // URL to redirect user
                sandboxInitPoint: result.sandbox_init_point
            }),
            {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 200,
            }
        )

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
