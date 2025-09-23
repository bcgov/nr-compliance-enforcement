DO $$
BEGIN
IF NOT EXISTS (SELECT 1 FROM pg_catalog.pg_user WHERE usename = 'metabase_readonly') THEN
    CREATE USER metabase_readonly WITH PASSWORD '${METABASE_READONLY_PASSWORD}';
END IF;
END $$;