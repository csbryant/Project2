DROP DATABASE IF EXISTS cheatsheet_db;
CREATE DATABASE cheatsheet_db;

USE cheatsheet_db;

CREATE TABLE Votes (
    name INT NOT NULL,
    vote BOOLEAN NOT NULL DEFAULT FALSE
);