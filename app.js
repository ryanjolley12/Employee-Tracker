
const mysql = require('mysql2');
const inquirer = require('inquirer');
const cTable = require('console.table');
const figlet = require('figlet');

// below code from classmate sberkebile7
figlet('Employee \n Tracker', (err, data) => {
    if (err) throw err;
    console.log(data);
})

// creates a connection to mysql database
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'crouton97',
    database: 'employees'
},
console.log('CONNECTED!')
);

db.connect(err => {
    if(err) throw err;
    startTracker();
});

// Function to start the tracker and allow the user to choose what they'd like to do
function startTracker() {
    inquirer.prompt({
        name: 'action',
        type: 'list',
        message: 'What would you like to do?',
        choices: [
            "View All Departments",
            "View All Roles",
            "View All Employees",
            "Add Department",
            "Add Role",
            "Add Employee",
            "Update Employee Role",
            "Exit"
        ]
    }).then((answer) => {
        switch(answer.action) {
            case "View All Departments":
                viewDepartments();
                break;

            case "View All Roles":
                viewRoles();
                break;
                
            case "View All Employees":
                viewEmployees();
                break;

            case "Add Department":
                addDepartment();
                break;

            case "Add Role":
                addRole();
                break;

            case "Add Employee":
                addEmployee();
                break;

            case "Update Employee Role":
                updateEmployeeRole();
                break;

            case "Exit":
                db.end()
                break;
        }
    });
};

// Shows all departments
function viewDepartments() {
    db.query(`SELECT * FROM department`, (err, data) => {
        if (err) throw err;
        console.log('Displaying all departments');
        console.table(data);
        startTracker();
    });
}

// Shows all roles
function viewRoles() {
    db.query(`SELECT * FROM role`, (err, data) => {
        if (err) throw err;
        console.log('Displaying all roles');
        console.table(data);
        startTracker();
    });
}

// Shows all employees
function viewEmployees() {
    db.query(`SELECT * FROM employee`, (err, data) => {
        if (err) throw err;
        console.log('Displaying all employees');
        console.table(data);
        startTracker();
    });
}

// Allows user to add departments
function addDepartment() {
    inquirer.prompt([
        {
            name: 'department',
            type: 'input',
            message: 'What is the name of the new department?',
            validate: (value) => {
                if(value) {
                    return true;
                } else {
                    console.log('Please enter a department name.');
                }
            }
        }
    ]).then(answer => {
        db.query(`INSERT INTO department SET ?`, {name: answer.department}, (err) => {
            if (err) throw err;
            console.log(`New department ${answer.department} has been added.`);
            startTracker();
        })
    });
}

// Allows user to add roles
function addRole() {
    const sql = `SELECT * FROM department`;
    db.query(sql, (err, results) => {
        if (err) throw err;

        inquirer.prompt([
            {
                name: 'title',
                type: 'input',
                message: 'What is the title for the new role?',
                validate: (value) => {
                    if(value) {
                        return true;
                    } else {
                        console.log('Please enter the title.');
                    }
                }
            },
            {
                name: 'salary',
                type: 'input',
                message: 'What is the salary for the new role?',
                validate: (value) => {
                    if(value) {
                        return true;
                    } else {
                        console.log('Please enter the salary.');
                    }
                }
            },
            {
                name: 'department',
                type: 'rawlist',
                choices: () => {
                    let deptChoices = [];
                    for(let i = 0; i < results.length; i++) {
                        deptChoices.push(results[i].name);
                    }
                    return deptChoices;
                },
                message: 'What is the department for the new role?',
            }
        ]).then(answer => {
            let chosenDept;
            for(let i = 0; i < results.length; i++) {
                if(results[i].name === answer.department) {
                    chosenDept = results[i];
                }
            }

            db.query(`INSERT INTO role SET ?`,
            {
                title: answer.title,
                salary: answer.salary,
                department_id: chosenDept.id
            }, (err) => {
                if (err) throw err;
                console.log(`New Role ${answer.title} has been added.`);
                startTracker();
            })
        });
    });
}

// Allows user to add employees
function addEmployee() {
    const sql = `SELECT * FROM employee, role`;
    db.query(sql, (err, results) => {
        if (err) throw err;

        inquirer.prompt([
            {
                name: 'first',
                type: 'input',
                message: 'What is their first name?',
                validate: (value) => {
                    if(value) {
                        return true;
                    } else {
                        console.log('Please enter their first name.');
                    }
                }
            },
            {
                name: 'last',
                type: 'input',
                message: 'What is their last name?',
                validate: (value) => {
                    if(value) {
                        return true;
                    } else {
                        console.log('Please enter their last name.');
                    }
                }
            },
            {
                name: 'role',
                type: 'rawlist',
                choices: () => {
                    let roleChoices = [];
                    for(let i = 0; i < results.length; i++) {
                        roleChoices.push(results[i].title);
                    }
                    let freshArray = [...new Set(roleChoices)];
                    return freshArray;
                },
                message: 'What is their role?'
            },
        ]).then(answer => {
            let chosenRole;

            for(let i = 0; i < results.length; i++) {
                if(results[i].title === answer.role) {
                    chosenRole = results[i];
                }
            }

            db.query(`INSERT INTO employee SET ?`,
            {
                first_name: answer.first,
                last_name: answer.last,
                role_id: chosenRole.id
            }, (err) => {
                if (err) throw err;
                console.log(`New employee ${answer.first} ${answer.last} has been added to the tracker in a ${answer.role} role.`);
                startTracker();
            })
        })
    });
}

// Allows user to update an employees role
function updateEmployeeRole() {
    db.query(`SELECT * FROM employee, role`, (err, results) => {
        if (err) throw err;

        inquirer.prompt([
            {
                name: 'employee',
                type: 'rawlist',
                choices: () => {
                    let employeeArray = [];
                    for(let i = 0; i < results.length; i++) {
                        employeeArray.push(results[i].last_name);
                    }
                    let freshArray = [...new Set(employeeArray)];
                    return freshArray;
                },
                message: 'Which employee needs their role updated?'
            },
            {
                name: 'role',
                type: 'rawlist',
                choices: () => {
                    let roleArray = [];
                    for(let i = 0; i < results.length; i++) {
                        roleArray.push(results[i].title);
                    }
                    let freshArray = [...new Set(roleArray)];
                    return freshArray;
                },
                message: 'What is their new role?'
            }
        ]).then(answer => {
            let chosenEmp;
            let chosenRole;

            for(let i = 0; i < results.length; i++) {
                if(results[i].last_name === answer.employee) {
                    chosenEmp = results[i];
                }
            }
            for(let i = 0; i < results.length; i++) {
                if(results[i].title === answer.role) {
                    chosenRole = results[i];
                }
            }

            db.query(`UPDATE employee SET ? WHERE ?`,
            [
                {role_id: chosenRole},
                {last_name: chosenEmp}
            ], (err) => {
                if (err) throw err;
                console.log(`Role has been updated.`);
                startTracker();
            })
        });
    });
}