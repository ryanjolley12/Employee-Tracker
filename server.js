const connection = require("./db/connection");
const db = require("./db/connection");
const inquirer = require ("inquirer");
// CODE FROM ANI-- REQUIRE FIGLET
const figlet = require("figlet");
// const mysql = require(mysql);
// const consoleTable = require(console.table);



// use figlet to display bubble text in terminal
figlet("Employee Tracker!", (err, data) => {
    if (err)
    throw err;
    console.log(data);
});



// would like to have this in connection.js but code breaks when removed, even when firstQuestion(); is left here. 
connection.connect((err) => {
    if (err) {
        throw err
    } else {
        console.log("Welcome to your Employee Tracker!")
    } firstQuestion();
});

// function to begin inquirer prompt questions, use async to make promise
//try this block of code, catch any errors
//use switch to evaluate user answer from OptionsList. If the case matches, execute method then break to end case clause. Move to next
const firstQuestion = async () => {
    try {
        let answer = await inquirer.prompt({
            name: "optionsList",
            type: "list",
            message: "What would you like to do first?",
            choices: ["View all Departments", "View all Roles", "View all Employees", "Add a Department", "Add a Role", "Add an Employee", "Update an Employee Role", "Return"]

        });
        switch (answer.optionsList) {
            case "View all Departments":
                viewDepartments();
                break;

            case "View all Roles":
                viewRoles();
                break;

            case "View all Employees":
                viewEmployees();
                break;

            case "Add a Department":
                addDepartment();
                break;

            case "Add a Role":
                addRole();
                break;

            case "Add an Employee":
                addEmployee();
                break;

            case "Update an Employee role":
                updateRole();
                break;

            case "Return":
                connection.end();
                break;
        };

    } catch (err) {
        console.log(err);

    };
}



//user can view departments
function viewDepartments() {
    db.query(`SELECT * FROM department`, (err, rows) => {
        if (err) {
            throw err;
        } else {
            console.log("Viewing All Current Departments")
            console.table(rows);
            firstQuestion();
        }
    });
};

//user can view roles
function viewRoles() {

    db.query(`SELECT * FROM e_role`, (err, rows) => {
        if (err) {
            throw err;
        } else {
            console.log("Viewing All Current Roles");
            console.table(rows);
            firstQuestion();
        }
    });
};

// user can view employees 
function viewEmployees() {
    db.query(`SELECT * FROM employee`, (err, rows) => {
        if (err) {
            throw err;
        } else {
            console.log("Viewing All Current Employees");
            console.table(rows);
            firstQuestion();
        }
    })
};



// if user selects add department, they are asked to enter input for new department
//once information is entered a message appears saying it was added successfully
// then user is taken back to 'home menu' using firstQuestion(); 
// when user then clicks on 'View all Departments" from main menu they can see it was added successfully. 
// use similar process for adding role, employee, and updating employee 
async function addDepartment() {
    let deptAnswer = await inquirer.prompt([
        {
            name: "deptName",
            type: "input",
            message: "Please enter the name of the new department."
        }
    ]);

    connection.query(`INSERT INTO department SET ?`, {
        dept_name: deptAnswer.deptName
    });

    console.log(`${deptAnswer.deptName} was successfully added to departments!`)
    firstQuestion();
};

async function addRole() {
    let deptChoices = await connection.promise().query(`SELECT * FROM department`)

    // console.log(deptChoices[0]);

    let deptArray = [];
    for (let i = 0; i < deptChoices[0].length; i++) {   //deptChoices is massive parent array in console 
        deptArray.push(deptChoices[0][i].dept_name)   //previously departArray.push(deptChoices[0][i].deptName)
        // console.log(deptArray)
    }

    // console.log(" dept array " + JSON.stringify(deptArray))
    // let department = connection.query(`SELECT * FROM department`)
    let userRole = await inquirer.prompt([
        {
            name: "title",
            type: "input",
            message: "Please enter the name of the new role"
        },
        {
            name: "salary",
            type: "input",
            message: "Please enter the salary for this role"
        },
        {
            name: "department",
            type: "list",
            choices: deptArray  // user selects from array of depts 

        }

    ]);
    const deptId = await connection.promise().query('SELECT id FROM department WHERE dept_name = ?', userRole.department);
    // console.log(deptId[0]);
    // console.log(deptId[0][0].id);

    connection.query(`INSERT INTO e_role SET ?`, {
        title: userRole.title,                                          // title on right is not part of /same as title on left 
        salary: userRole.salary,
        dept_id: deptId[0][0].id

    });
    // console.log("test", roleResponse);
    console.log(`${userRole.title} was successfully added to Roles!`)
    // console.log(roleResponse)
    firstQuestion();
};

async function addEmployee() {
    let employeeRoleChoices = await connection.promise().query(`SELECT * FROM e_role`)
    // console.log(employeeRoleChoices[0])
    let roleArray = [];
    for (let i = 0; i < employeeRoleChoices[0].length; i++) {
        roleArray.push(employeeRoleChoices[0][i].title)
        // console.log(roleArray);
    }

    // console.log(" employee array " + JSON.stringify(roleArray))

    // when user selects add employee, they are prompted to enter first_name, last_name, role, and manager. 
    //once user enters all of the above, a message appears saying it was successfully added. 
    //user is returned to 'home screen' via firstquestion(); 
    // when user clicks view all employees, the new employee is there
    //the employee role id references primary key from e_role. the manager id references any other employee  
    let newEmployee = await inquirer.prompt([
        {
            name: "firstName",
            type: "input",
            message: "Please enter the first name of the new employee"
        },
        {
            name: "lastName",
            type: "input",
            message: "Please enter the last name of the new employee"

        },
        {
            name: "employee",
            type: "list",
            choices: roleArray

        },
        {
            name: "managerId",
            type: "input",
            message: "Please enter the id of the manager for this employee"
        }
    ]);
    // console.log(newEmployee);
    const employeeRoleId = await connection.promise().query('SELECT id FROM e_role WHERE title = ?', newEmployee.employee);

    await connection.promise().query(`INSERT INTO employee SET ? `, {

        first_name: newEmployee.firstName,
        last_name: newEmployee.lastName,
        role_id: employeeRoleId[0][0].id,
        manager_id: newEmployee.managerId
    })
    console.log(`${newEmployee.firstName} + ${newEmployee.lastName} was successfully added to Employees!`)
    firstQuestion();

};

async function updateRole() {
    let employeeChoices = await connection.promise().query(`SELECT * FROM employee`);
    let employeeArray = [];
    console.log(employeeArray)
    let roleChoices = await connection.promise().query(`SELECT * FROM e_role`);
    let roleArray = [];
    for (let i = 0; i < employeeChoices[0].length; i++) {
        employeeArray.push(employeeChoices[0][i].last_name)
        for (let i = o; i < roleChoices[0].length; i++) {
            roleArray.push(roleChoices[0][i].title)

        }



    }

    let updatePrompt = await inquirer.prompt([

        {
            name: "userPick",
            type: "list",
            message: "Which employee would you like to update?",
            choices: employeeArray

        },
        {
            name: "newEmployeeRole",
            type: "list",
            message: "What is this employee's new role?",
            choices: roleArray

        }
    ]);
    await connection.promise().query(`UPDATE employee SET employee.role_id = ? WHERE employee.id = ?`, updatePrompt.newEmployeeRole);



};










