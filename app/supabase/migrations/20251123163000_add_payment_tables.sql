-- Update bookings table with payment fields
ALTER TABLE bookings 
ADD COLUMN IF NOT EXISTS payment_status VARCHAR(20) DEFAULT 'pending', -- pending, paid, failed, refunded
ADD COLUMN IF NOT EXISTS payment_id VARCHAR(100), -- Transaction ID from the gateway
ADD COLUMN IF NOT EXISTS payment_provider VARCHAR(20), -- 'stripe' or 'mercadopago'
ADD COLUMN IF NOT EXISTS payment_url TEXT; -- Link to payment page (if applicable)

-- Create transactions table for financial logging
CREATE TABLE IF NOT EXISTS transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID REFERENCES bookings(id),
  amount DECIMAL(10,2) NOT NULL,
  provider VARCHAR(20) NOT NULL, -- 'stripe' or 'mercadopago'
  provider_transaction_id VARCHAR(100),
  status VARCHAR(20) NOT NULL, -- 'pending', 'completed', 'failed'
  type VARCHAR(20) NOT NULL, -- 'payment', 'refund', 'payout'
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_bookings_payment_status ON bookings(payment_status);
CREATE INDEX IF NOT EXISTS idx_transactions_booking_id ON transactions(booking_id);
CREATE INDEX IF NOT EXISTS idx_transactions_provider_id ON transactions(provider_transaction_id);

-- Add RLS policies for transactions
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view transactions related to their bookings (as renter or owner)
CREATE POLICY "Users can view their own transactions" ON transactions
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM bookings b
      WHERE b.id = transactions.booking_id
      AND (b.renter_id = auth.uid() OR b.owner_id = auth.uid())
    )
  );

-- Policy: Only system/admin can insert/update transactions (usually via Edge Functions)
-- We'll allow service_role to manage this, so no explicit policy for authenticated users to write.
