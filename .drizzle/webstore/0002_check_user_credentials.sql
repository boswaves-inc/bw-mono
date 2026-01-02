-- Custom SQL migration file, put your code below! --
CREATE OR REPLACE FUNCTION public.check_user_credentials_provider() RETURNS trigger LANGUAGE 'plpgsql' COST 100 VOLATILE NOT LEAKPROOF AS $BODY$ BEGIN IF NOT EXISTS (
        SELECT 1
        FROM users
        WHERE uid = NEW.uid
            AND provider = 'internal'
    ) THEN RAISE EXCEPTION 'user_credentials can only be created for users with provider = internal';
END IF;
RETURN NEW;
END;
$BODY$;

CREATE OR REPLACE TRIGGER user_credentials_provider_check_trigger BEFORE
INSERT
    OR
UPDATE ON public.user_credentials FOR EACH ROW EXECUTE FUNCTION public.check_user_credentials_provider();