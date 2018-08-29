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
    console.log("\nConnected as ID: " + connection.threadId + "\n");
    displayProducts();
});

function displayProducts() {
    connection.query("SELECT * FROM products", function(err, res) {
        if (err) throw err;
        for (var i = 0; i < res.length; i++) {
            console.log(
                res[i].id + ". " +
                res[i].product_name + ", $" +
                res[i].price
            );
        };
        startSale();
    });
};

function startSale() {
    inquirer.prompt([
        {
            message: "What would you like to buy today?",
            name: "id"
        },
        {
            message: "How many would you like to buy to day",
            name: "quantity"
        }
    ]).then(function(answer) {
        var userQuantity = parseFloat(answer.quantity);
        var storeQuantity;
        connection.query("SELECT * FROM products WHERE id=?", [answer.id], function(err, res) {
            if (err) throw err;

            storeQuantity = res[0].stock_quantity;
            itemPrice = res[0].price;

            if (userQuantity > storeQuantity) {
                console.log("\nInsufficient quantity! Try again!\n");
                displayProducts();
            } else {
                var currentQuantity = storeQuantity - userQuantity;

                var totalCost = userQuantity * itemPrice;

                connection.query(
                    "UPDATE products SET ? WHERE ?",
                    [
                        {
                            stock_quantity: currentQuantity
                        },
                        {
                            id: answer.id
                        }
                    ],
                    function(err, res) {
                        if (err) throw err;

                        console.log("\nYour total is: $" + totalCost + "\n");
                        displayProducts();
                    }
                );
            };
        });
    });
};