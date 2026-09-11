-- Nicknames for first name party matching

CREATE TABLE nickname (
    name varchar(50) NOT NULL,
    nickname varchar(50) NOT NULL,
    create_user_id varchar(32) NOT NULL,
    create_utc_timestamp timestamp NOT NULL DEFAULT now(),
    CONSTRAINT nickname_pk PRIMARY KEY (name, nickname)
);

COMMENT ON TABLE nickname IS 'English first name nickname pairs sourced from github.com/carltonnorthern/nicknames';
