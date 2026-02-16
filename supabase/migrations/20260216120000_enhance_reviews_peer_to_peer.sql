-- Migration: Enhance reviews for peer-to-peer model (BlaBlaCar style)
-- Adds new rating categories: service_rating, operator_rating, machine_rating, client_rating
-- Adds observations field for community tips (like BlaBlaCar)
-- Adds review_type to distinguish owner-reviews-client vs client-reviews-owner

-- Add new columns to reviews table
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS service_rating SMALLINT CHECK (service_rating >= 1 AND service_rating <= 5);
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS operator_rating SMALLINT CHECK (operator_rating >= 1 AND operator_rating <= 5);
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS machine_rating SMALLINT CHECK (machine_rating >= 1 AND machine_rating <= 5);
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS client_rating SMALLINT CHECK (client_rating >= 1 AND client_rating <= 5);
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS observations TEXT;
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS review_type VARCHAR(30) DEFAULT 'client_reviews_owner';

-- Comment on new columns
COMMENT ON COLUMN reviews.service_rating IS 'Rating for the quality of service performed (1-5)';
COMMENT ON COLUMN reviews.operator_rating IS 'Rating for the machine operator (1-5)';
COMMENT ON COLUMN reviews.machine_rating IS 'Rating for the machine condition and performance (1-5)';
COMMENT ON COLUMN reviews.client_rating IS 'Rating for the client who hired the service (1-5)';
COMMENT ON COLUMN reviews.observations IS 'Community tips and observations (BlaBlaCar style)';
COMMENT ON COLUMN reviews.review_type IS 'Type: owner_reviews_client or client_reviews_owner';

-- Create index for faster review lookups by machine
CREATE INDEX IF NOT EXISTS idx_reviews_booking_id ON reviews(booking_id);

-- Update the calculate_user_rating function to include new rating types
CREATE OR REPLACE FUNCTION calculate_user_rating(target_user_id UUID)
RETURNS NUMERIC AS $$
DECLARE
    avg_rating NUMERIC;
BEGIN
    SELECT COALESCE(AVG(rating), 0)
    INTO avg_rating
    FROM reviews
    WHERE reviewed_id = target_user_id;

    RETURN ROUND(avg_rating, 1);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to calculate machine average rating
CREATE OR REPLACE FUNCTION calculate_machine_rating(target_machine_id UUID)
RETURNS TABLE(
    avg_rating NUMERIC,
    avg_service NUMERIC,
    avg_operator NUMERIC,
    avg_machine NUMERIC,
    review_count BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        COALESCE(ROUND(AVG(r.rating), 1), 0) as avg_rating,
        COALESCE(ROUND(AVG(r.service_rating), 1), 0) as avg_service,
        COALESCE(ROUND(AVG(r.operator_rating), 1), 0) as avg_operator,
        COALESCE(ROUND(AVG(r.machine_rating), 1), 0) as avg_machine,
        COUNT(r.id) as review_count
    FROM reviews r
    JOIN bookings b ON r.booking_id = b.id
    WHERE b.machine_id = target_machine_id
    AND r.review_type = 'client_reviews_owner';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update bookings payment_status to support peer_to_peer
-- (No schema change needed, just allowing the new status value)
