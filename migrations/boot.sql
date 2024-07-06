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

-- Create function to automatically release expired holds if it doesn't exist
CREATE OR REPLACE FUNCTION release_expired_holds()
RETURNS void AS $$
BEGIN
    UPDATE seats
    SET status = 'available', user_id = NULL, hold_expires_at = NULL
    WHERE status = 'held' AND hold_expires_at < CURRENT_TIMESTAMP;
END;
$$ LANGUAGE plpgsql;

-- Create pg_cron extension if it doesn't exist
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Schedule the cron job only if it doesn't already exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM cron.job WHERE command = 'SELECT release_expired_holds()') THEN
        PERFORM cron.schedule('release_expired_holds', '*/5 * * * * *', 'SELECT release_expired_holds()');
        RAISE NOTICE 'Created new cron job: release_expired_holds';
    ELSE
        RAISE NOTICE 'Cron job release_expired_holds already exists';
    END IF;
END $$;
