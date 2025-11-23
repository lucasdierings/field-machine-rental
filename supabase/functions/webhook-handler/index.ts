import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"
import { MercadoPagoConfig, Payment } from 'https://esm.sh/mercadopago@2.0.8'

serve(async (req: Request) => {
    try {
        const url = new URL(req.url)
        const topic = url.searchParams.get('topic') || url.searchParams.get('type')
        const id = url.searchParams.get('id') || url.searchParams.get('data.id')

        if (topic !== 'payment') {
            return new Response('OK', { status: 200 })
        }

        if (!id) {
            return new Response('Missing ID', { status: 400 })
        }

        // 1. Initialize Clients
        const supabase = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
        )

        const client = new MercadoPagoConfig({
            accessToken: Deno.env.get('MP_ACCESS_TOKEN') ?? ''
        });

        const payment = new Payment(client);

        // 2. Get Payment Details
        const paymentData = await payment.get({ id });

        const bookingId = paymentData.external_reference;
        const status = paymentData.status;
        const amount = paymentData.transaction_amount;

        if (!bookingId) {
            throw new Error('No booking ID in external_reference');
        }

        // 3. Record Transaction
        await supabase.from('transactions').insert({
            booking_id: bookingId,
            amount: amount,
            provider: 'mercadopago',
            provider_transaction_id: String(id),
            status: status,
            type: 'payment',
            metadata: paymentData
        });

        // 4. Update Booking Status if Approved
        if (status === 'approved') {
            await supabase
                .from('bookings')
                .update({
                    payment_status: 'paid',
                    status: 'confirmed' // Auto-confirm booking upon payment
                })
                .eq('id', bookingId);
        } else if (status === 'rejected' || status === 'cancelled') {
            await supabase
                .from('bookings')
                .update({
                    payment_status: 'failed'
                })
                .eq('id', bookingId);
        }

        return new Response('OK', { status: 200 })

    } catch (error: any) {
        console.error('Webhook Error:', error)
        return new Response(JSON.stringify({ error: error.message }), { status: 400 })
    }
})
