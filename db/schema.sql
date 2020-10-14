DROP DATABASE IF EXISTS cheatsheet_db;
CREATE DATABASE cheatsheet_db;

USE cheatsheet_db;

CREATE TABLE Candidate (
    name INT NOT NULL,
    vote BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE Proposition (
    name INT NOT NULL,
    vote BOOLEAN NOT NULL DEFAULT FALSE
);