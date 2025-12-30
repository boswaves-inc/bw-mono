-- Custom SQL migration file, put your code below!
-- Function to notify on new email
CREATE OR REPLACE FUNCTION notify_email_queued() RETURNS TRIGGER AS $$ BEGIN PERFORM pg_notify(
        'email_queued',
        json_build_object(
            'id',
            NEW.id,
            'recipient',
            NEW.recipient
        )::text
    );
RETURN NEW;
END;
$$ LANGUAGE plpgsql;
-- Trigger on INSERT
CREATE TRIGGER notify_email_queued_trigger
AFTER
INSERT ON emails FOR EACH ROW EXECUTE FUNCTION notify_email_queued();
COMMENT ON TRIGGER notify_email_queued_trigger ON emails IS 'Notifies the background worker that a new email has been queued';