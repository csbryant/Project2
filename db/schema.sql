DROP DATABASE IF EXISTS cheatsheet_db;
CREATE DATABASE cheatsheet_db;

USE cheatsheet_db;

CREATE TABLE candidates (
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    office_name VARCHAR(100) NOT NULL,
    summary VARCHAR(300) NOT NULL,
    party VARCHAR(100) NOT NULL,
    PRIMARY KEY (id)
);

SELECT * FROM candidates;