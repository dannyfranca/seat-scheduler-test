-- Create events table if it doesn't exist
CREATE TABLE IF NOT EXISTS events (
    id UUID PRIMARY KEY,
    total_seats INTEGER NOT NULL CHECK (total_seats >= 10 AND total_seats <= 1000),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create seats table if it doesn't exist
CREATE TABLE IF NOT EXISTS seats (
    id UUID PRIMARY KEY,
    event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    status VARCHAR(10) NOT NULL CHECK (status IN ('available', 'held', 'reserved')),
    user_id UUID,
    hold_expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create index on event_id and status if it doesn't exist
CREATE INDEX IF NOT EXISTS idx_seats_event_status ON seats (event_id, status);

-- Create index on hold_expires_at if it doesn't exist
CREATE INDEX IF NOT EXISTS idx_seats_hold_expires ON seats (hold_expires_at) WHERE status = 'held';

-- Create index on user_id if it doesn't exist
CREATE INDEX IF NOT EXISTS idx_seats_user ON seats (user_id) WHERE user_id IS NOT NULL;

-- Create function to update 'updated_at' timestamp if it doesn't exist
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update 'updated_at' on seats table if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_seats_modtime') THEN
        CREATE TRIGGER update_seats_modtime
        BEFORE UPDATE ON seats
        FOR EACH ROW
        EXECUTE FUNCTION update_modified_column();
    END IF;
END $$;
