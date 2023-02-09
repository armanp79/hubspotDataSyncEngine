drop table if exists users;

create table users (
    userID SERIAL,
    name TEXT,
    service TEXT,
    data TEXT,
    timestamp TIMESTAMP,
    PRIMARY KEY (userID)
);
