CREATE TABLE companies
(
    handle text PRIMARY KEY,
    name text NOT NULL UNIQUE,
    num_employees INT,
    description text,
    logo_url text
);

CREATE TABLE jobs (
    id SERIAL PRIMARY KEY, 
    title text NOT NULL, 
    salary  float,
    equity float NOT NULL CHECK(equity <= 1.0),
    company_handle TEXT NOT NULL REFERENCES companies ON DELETE CASCADE, 
    date_posted TIMESTAMP
);

CREATE TABLE users (
    username text PRIMARY KEY,
    password text NOT NULL,
    first_name text NOT NULL, 
    last_name text NOT NULL, 
    email VARCHAR NOT NULL UNIQUE,
    photo_url text, 
    is_admin boolean NOT NULL DEFAULT FALSE
)