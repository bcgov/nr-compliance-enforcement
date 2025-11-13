CREATE TABLE
    shared.event_entity_type_code (
        event_entity_type_code character varying(16) UNIQUE NOT NULL,
        short_description character varying(64) NOT NULL,
        long_description character varying(256),
        display_order integer,
        active_ind boolean DEFAULT true NOT NULL,
        create_user_id character varying(32) NOT NULL,
        create_utc_timestamp timestamp without time zone DEFAULT now () NOT NULL,
        update_user_id character varying(32),
        update_utc_timestamp timestamp without time zone
    );

COMMENT ON TABLE shared.event_entity_type_code IS 'Defines entity types that can participate in events, including actors, targets, and sources (e.g., person, case file, complaint).';

COMMENT ON COLUMN shared.event_entity_type_code.event_entity_type_code IS 'Primary key: Human readable code representing an event entity type.';

COMMENT ON COLUMN shared.event_entity_type_code.short_description IS 'The short description of the event entity type.  Used to store shorter versions of the long description when applicable.';

COMMENT ON COLUMN shared.event_entity_type_code.long_description IS 'The long description of the event entity type.  May contain additional detail not typically displayed in the application.';

COMMENT ON COLUMN shared.event_entity_type_code.display_order IS 'The order in which the values of the event entity type should be displayed when presented to a user in a list.  Originally incremented by 10s to allow for new values to be easily added.';

COMMENT ON COLUMN shared.event_entity_type_code.active_ind IS 'A boolean indicator to determine if the event entity type is active.  Inactive values are still retained in the system for legacy data integrity but are not valid choices for new data being added.';

COMMENT ON COLUMN shared.event_entity_type_code.create_user_id IS 'The id of the user that created the event entity type.';

COMMENT ON COLUMN shared.event_entity_type_code.create_utc_timestamp IS 'The timestamp when the event entity type was created. The timestamp is stored in UTC with no offset.';

COMMENT ON COLUMN shared.event_entity_type_code.update_user_id IS 'The id of the user that updated the event entity type.';

COMMENT ON COLUMN shared.event_entity_type_code.update_utc_timestamp IS 'The timestamp when the event entity type was updated. The timestamp is stored in UTC with no offset.';

CREATE TABLE
    shared.event_verb_type_code (
        event_verb_type_code character varying(16) UNIQUE NOT NULL,
        short_description character varying(64) NOT NULL,
        long_description character varying(256),
        display_order integer,
        active_ind boolean DEFAULT true NOT NULL,
        create_user_id character varying(32) NOT NULL,
        create_utc_timestamp timestamp without time zone DEFAULT now () NOT NULL,
        update_user_id character varying(32),
        update_utc_timestamp timestamp without time zone
    );

COMMENT ON TABLE shared.event_verb_type_code IS 'Defines action verbs that describe what happened in an event (e.g., created, updated, deleted, submitted, approved).';

COMMENT ON COLUMN shared.event_verb_type_code.event_verb_type_code IS 'Primary key: Human readable code representing an event verb type.';

COMMENT ON COLUMN shared.event_verb_type_code.short_description IS 'The short description of the event verb type.  Used to store shorter versions of the long description when applicable.';

COMMENT ON COLUMN shared.event_verb_type_code.long_description IS 'The long description of the event verb type.  May contain additional detail not typically displayed in the application.';

COMMENT ON COLUMN shared.event_verb_type_code.display_order IS 'The order in which the values of the event verb type should be displayed when presented to a user in a list.  Originally incremented by 10s to allow for new values to be easily added.';

COMMENT ON COLUMN shared.event_verb_type_code.active_ind IS 'A boolean indicator to determine if the event verb type is active.  Inactive values are still retained in the system for legacy data integrity but are not valid choices for new data being added.';

COMMENT ON COLUMN shared.event_verb_type_code.create_user_id IS 'The id of the user that created the event verb type.';

COMMENT ON COLUMN shared.event_verb_type_code.create_utc_timestamp IS 'The timestamp when the event verb type was created. The timestamp is stored in UTC with no offset.';

COMMENT ON COLUMN shared.event_verb_type_code.update_user_id IS 'The id of the user that updated the event verb type.';

COMMENT ON COLUMN shared.event_verb_type_code.update_utc_timestamp IS 'The timestamp when the event verb type was updated. The timestamp is stored in UTC with no offset.';

CREATE TABLE
    shared.event (
        event_guid uuid DEFAULT public.uuid_generate_v4 () PRIMARY KEY UNIQUE NOT NULL,
        event_verb_type_code character varying(16) NOT NULL,
        published_utc_timestamp timestamp without time zone DEFAULT now () NOT NULL,
        source_id character varying(64),
        source_entity_type_code character varying(16),
        actor_id character varying(64) NOT NULL,
        actor_entity_type_code character varying(16) NOT NULL,
        target_id character varying(64) NOT NULL,
        target_entity_type_code character varying(16) NOT NULL,
        content jsonb,
        create_user_id character varying(32) NOT NULL,
        create_utc_timestamp timestamp without time zone DEFAULT now () NOT NULL,
        update_user_id character varying(32),
        update_utc_timestamp timestamp without time ZONE,
        FOREIGN KEY (event_verb_type_code) REFERENCES shared.event_verb_type_code (event_verb_type_code),
        FOREIGN KEY (source_entity_type_code) REFERENCES shared.event_entity_type_code (event_entity_type_code),
        FOREIGN KEY (target_entity_type_code) REFERENCES shared.event_entity_type_code (event_entity_type_code),
        FOREIGN KEY (actor_entity_type_code) REFERENCES shared.event_entity_type_code (event_entity_type_code)
    );

COMMENT ON TABLE shared.event IS 'Stores activity events in the system, recording what action was performed, who performed it, and what entity was affected, with support for optional source and additional content data.';

COMMENT ON COLUMN shared.event.event_guid IS 'Primary key: System generated unique identifier for an event.';

COMMENT ON COLUMN shared.event.event_verb_type_code IS 'Foreign key: References the verb type that describes the action that occurred in this event.';

COMMENT ON COLUMN shared.event.published_utc_timestamp IS 'The timestamp when the event was published. The timestamp is stored in UTC with no offset.';

COMMENT ON COLUMN shared.event.source_id IS 'Optional identifier of the source entity that triggered or initiated the event.';

COMMENT ON COLUMN shared.event.source_entity_type_code IS 'Foreign key: References the entity type of the source. Required if source_id is provided.';

COMMENT ON COLUMN shared.event.actor_id IS 'Identifier of the actor that originated the action in this event, eg a Complaint ID when added to a Case file.';

COMMENT ON COLUMN shared.event.actor_entity_type_code IS 'Foreign key: References the entity type of the actor that performed the action.';

COMMENT ON COLUMN shared.event.target_id IS 'Identifier of the target entity that was affected by the action in this event, eg a Case file ID when a complaint is added to it.';

COMMENT ON COLUMN shared.event.target_entity_type_code IS 'Foreign key: References the entity type of the target that was affected by the action.';

COMMENT ON COLUMN shared.event.content IS 'Optional JSONB field containing additional contextual data or metadata about the event.';

COMMENT ON COLUMN shared.event.create_user_id IS 'The id of the user that created the event.';

COMMENT ON COLUMN shared.event.create_utc_timestamp IS 'The timestamp when the event was created. The timestamp is stored in UTC with no offset.';

COMMENT ON COLUMN shared.event.update_user_id IS 'The id of the user that updated the event.';

COMMENT ON COLUMN shared.event.update_utc_timestamp IS 'The timestamp when the event was updated. The timestamp is stored in UTC with no offset.';
