CREATE DATABASE sig;
use sig; 

CREATE TABLE restaurant (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    image VARCHAR(255) NOT NULL
);

CREATE TABLE menu (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

CREATE TABLE menu_resto (
    id SERIAL PRIMARY KEY,
    idResto int,
    idMenu int
);
