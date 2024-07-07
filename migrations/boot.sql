-- Create enum type for seat status if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'seat_status') THEN
        CREATE TYPE seat_status AS ENUM ('available', 'held', 'reserved');
    END IF;
END$$;

-- Create events table if it doesn't exist
CREATE TABLE IF NOT EXISTS events (
    id UUID PRIMARY KEY,
    total_seats INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create seats table if it doesn't exist
CREATE TABLE IF NOT EXISTS seats (
    id UUID PRIMARY KEY,
    event_id UUID NOT NULL,
    status seat_status NOT NULL,
    user_id UUID,
    hold_expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Add foreign key constraint if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_seats_event_id') THEN
        ALTER TABLE seats ADD CONSTRAINT fk_seats_event_id FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE;
    END IF;
END$$;

-- Create index on event_id and status if it doesn't exist
CREATE INDEX IF NOT EXISTS idx_seats_event_status ON seats (event_id, status) WHERE status = 'available';

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
