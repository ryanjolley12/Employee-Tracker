DROP TABLE IF EXISTS employee;
DROP TABLE IF EXISTS roles;
DROP TABLE IF EXISTS departments;

CREATE TABLE employees (
    id: INT PRIMARY KEY,
    first_name: VARCHAR(30) NOT NULL,
    last_name: VARCHAR(30) NOT NULL,
);

CREATE TABLE roles (
    id: INT PRIMARY KEY,
    title: 
    salary: 
    department_id: INTEGER,
);

CREATE TABLE departments (
    id: INT PRIMARY KEY,
);
