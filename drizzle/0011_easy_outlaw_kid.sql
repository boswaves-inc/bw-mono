-- Custom SQL migration file, put your code below! --
CREATE OR REPLACE FUNCTION user_credentials_provider_check() RETURNS TRIGGER AS $$ BEGIN IF NOT EXISTS (
        SELECT 1
        FROM users
        WHERE uid = NEW.uid
            AND provider = 'internal'
    ) THEN RAISE EXCEPTION 'user_credentials can only be created for users with provider = internal';
END IF;
RETURN NEW;
END;
$$ LANGUAGE plpgsql;
-- Create trigger that fires before insert or update
CREATE TRIGGER user_credentials_provider_check_trigger BEFORE
INSERT
    OR
UPDATE ON user_credentials FOR EACH ROW EXECUTE FUNCTION user_credentials_provider_check();

-- Add comment for documentation
COMMENT ON TRIGGER user_credentials_provider_check_trigger ON user_credentials IS 'Ensures credentials can only be created for users with provider = internal';