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
    total_seats INTEGER NOT NULL CHECK (total_seats >= 10 AND total_seats <= 1000),
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
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_seats_event_id FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
    CONSTRAINT check_hold_expires_at CHECK (
        (status = 'held' AND hold_expires_at IS NOT NULL) OR 
        (status != 'held' AND hold_expires_at IS NULL)
    )
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_seats_event_status ON seats (event_id, status);
CREATE INDEX IF NOT EXISTS idx_seats_hold_expires ON seats (hold_expires_at) WHERE status = 'held';
CREATE INDEX IF NOT EXISTS idx_seats_user ON seats (user_id) WHERE user_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_seats_held ON seats (user_id, hold_expires_at) WHERE status = 'held';

-- Create function to update 'updated_at' timestamp
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update 'updated_at' on seats table
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_seats_modtime') THEN
        CREATE TRIGGER update_seats_modtime
        BEFORE UPDATE ON seats
        FOR EACH ROW
        EXECUTE FUNCTION update_modified_column();
    END IF;
END $$;

-- Add a function to check the hold limit
CREATE OR REPLACE FUNCTION check_hold_limit() RETURNS TRIGGER AS $$
DECLARE
    hold_count INTEGER;
    max_holds CONSTANT INTEGER := 5; -- Set the maximum number of holds per user
BEGIN
    SELECT COUNT(*) INTO hold_count
    FROM seats
    WHERE user_id = NEW.user_id AND status = 'held';

    IF hold_count >= max_holds THEN
        RAISE EXCEPTION 'User has reached the maximum number of held seats';
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add a trigger to enforce the hold limit
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'enforce_hold_limit') THEN
        CREATE TRIGGER enforce_hold_limit
        BEFORE INSERT OR UPDATE ON seats
        FOR EACH ROW
        WHEN (NEW.status = 'held')
        EXECUTE FUNCTION check_hold_limit();
    END IF;
END $$;
