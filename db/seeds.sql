-- copied seeds from anidino and modules
INSERT INTO departments (name)
VALUES 
    ('Management'),
    ('Marketing'),
    ('Production'),
    ('Research & Development'),
    ('Sales'),
    ('Human Resources'),
    ('Accounting');


INSERT INTO roles (title, salary, department_id)
VALUES
    ('CEO', 350000, 1),
    ('Digital Marketing Associate', 110000, 2),
    ('Web Developer', 120000, 3),
    ('Research Analyst', 100000, 4),
    ('Sales Representative', 45000, 5),
    ('HR Associate', 85000, 6),
    ('Senior Accountant', 100000, 7);


INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES
  ('Ronald', 'Firbank', 1, 102),
  ('Virginia', 'Woolf', 2, NULL),
  ('Piers', 'Gaveston', 3, 442),
  ('Charles', 'LeRoi', 4, 657),
  ('Unica', 'Zurn', 5, NULL),
  ('Dora', 'Carrington', 6, 600),
  ('Montague', 'Summers', 7, NULL);
 
 