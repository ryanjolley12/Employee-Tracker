DROP TABLE IF EXISTS employees;
DROP TABLE IF EXISTS roles;
DROP TABLE IF EXISTS departments;

CREATE TABLE employees (
    id: INT AUTO_INCREMENT PRIMARY KEY,
    first_name: VARCHAR(30) NOT NULL,
    last_name: VARCHAR(30) NOT NULL,
    role_id: INTEGER,
    manager_id: INTEGER,
    -- CONSTRAINT fk_role FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE SET NULL
);

CREATE TABLE roles (
    id: INT AUTO_INCREMENT PRIMARY KEY,
    title: VARCHAR(30) NOT NULL,
    salary: DECIMAL(9, 2) NOT NULL,
    department_id: INTEGER,
    CONSTRAINT fk_department FOREIGN KEY (department_id) REFERENCES department(id)

);

CREATE TABLE departments (
    id: INT AUTO_INCREMENT PRIMARY KEY,
    department_name: VARCHAR(30) NOT NULL
);
