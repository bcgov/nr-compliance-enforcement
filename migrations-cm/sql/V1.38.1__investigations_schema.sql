CREATE SCHEMA IF NOT EXISTS investigation;

DO $$
BEGIN
IF NOT EXISTS (SELECT 1 FROM pg_catalog.pg_user WHERE usename = 'investigation') THEN
    CREATE USER investigation WITH PASSWORD '${INV_PASSWORD}';
END IF;
END $$;
 
-- Grant access to schema
GRANT USAGE, CREATE ON SCHEMA investigation TO investigation;

DO $$
BEGIN
IF NOT EXISTS (SELECT 1 FROM pg_catalog.pg_user WHERE usename = 'case_management') THEN
    CREATE USER case_management WITH PASSWORD '${CM_PASSWORD}';
END IF;
END $$;
 
-- Grant access to schema
GRANT USAGE, CREATE ON SCHEMA case_management TO case_management;

CREATE SEQUENCE IF NOT EXISTS investigation."TEMP_POC_SEQ"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 100;

CREATE TABLE IF NOT EXISTS investigation.TEMP_POC
(
    ID    numeric      not null
    constraint "TEMP_POC_PK"
    primary key DEFAULT nextval('investigation."TEMP_POC_SEQ"'),
    FIRST_NAME  varchar(200) not null,
    LAST_NAME varchar(200) not null
);

INSERT INTO investigation.TEMP_POC (FIRST_NAME, LAST_NAME)
VALUES ('Homer', 'Simpson'),
       ('Marge', 'Simpson'),
       ('Bart', 'Simpson'),
       ('Lisa', 'Simpson'),
       ('Maggie', 'Simpson');
