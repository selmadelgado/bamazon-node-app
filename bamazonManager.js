var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",
    port: 8889,
    user: "root",
    password: "root",
    database: "bamazon_db"
});

connection.connect(function(err) {
    if (err) throw err;
    //console.log("connection successful");
    showMenu();
});

function showMenu() {
    inquirer.prompt([
        {
            type: "list",
            message: "What would you like to do?",
            choices: ["View Products", "View Inventory", "Add Inventory", "Add New Products"],
            name: "task"
        }
    ]).then(function(answer) {
        if (answer.task === "View Products") {

            connection.query("SELECT * FROM products", function(err, res) {
                if (err) throw err;
                console.table(res);
                showMenu();
            });

        } else if (answer.task === "View Inventory") {

            connection.query("SELECT * FROM products WHERE stock_quantity < 5", function(err, res) {
                if (err) throw err;
                console.table(res);
                showMenu();
            });

        } else if (answer.task === "Add Inventory") {

            var inventory = [];

            connection.query("SELECT * FROM products", function(err, res) {
                if (err) throw err;
                for (var i = 0; i < res.length; i++) {
                    inventory.push(res[i].id + ". " + res[i].product_name);
                }

                inquirer.prompt([
                    {
                        type: "list",
                        message: "Which product would you like to increase the inventory for?",
                        choices: inventory,
                        name: "product"
                    },
                    {
                        message: "How many of this product would you like to add?",
                        name: "quantity"
                    }
                ]).then(function(answer){
                    var currentQuantity;
                    var quantityToAdd;
                    var updatedQuantity;

                    connection.query("SELECT stock_quantity FROM products WHERE id=?", [answer.product], function(err, res) {
                        if (err) throw err;

                        quantityToAdd = answer.quantity;
                        currentQuantity = res[0].stock_quantity;
                        updatedQuantity = parseInt(currentQuantity) + parseInt(quantityToAdd);

                        connection.query("UPDATE products SET ? WHERE ?",
                        [
                            {
                                stock_quantity: updatedQuantity
                            },
                            {
                                id: answer.product
                            }
                        ],
                        function(err, res) {
                            if (err) throw err;
                            console.log("\nINVENTORY ADDED!\n");
                            showMenu();
                        })
                    })
                });
            });

        } else if (answer.task === "Add New Product") {

            inquirer.prompt([
                {
                    message: "New Product Name?",
                    name: "product"
                },
                {
                    message: "New Product Department?",
                    name: "department"
                },
                {
                    message: "New Product Price?",
                    name: "price"
                },
                {
                    message: "New Product Quantity?",
                    name: "quantity"
                }
            ]).then(function(answer) {
                connection.query(
                    "INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES ('" + answer.product + "', '" + answer.department + "', '" + answer.price + "', '" + answer.quantity + "')",
                    function(err, res) {
                        console.log("\nYOUR PRODUCTS HAVE BEEN ADDED!\n");
                        showMenu();
                    }
                )
            });
            
        }
    });
};