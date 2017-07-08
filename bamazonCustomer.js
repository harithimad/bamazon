var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require('cli-table');
var connection = mysql.createConnection({
	host: "localhost",
	port: 3306,
	// Your username
	user: "root",
	// Your password
	password: "",
	database: "bamazon"
});
connection.connect(function(err) {
	if (err) {
		throw err;
	}
	console.log("connected succesfully");
});
//var query = "SELECT item_id,produc_name,department_name,price,stock_quantity from products";
var query = "SELECT * from products";
connection.query(query, function(err, res) {
	console.log('======================_.~"~._.~"~._.~Welcome to BAMazon~._.~"~._.~"~._=============================');

	var table = new Table({
                head: ['ItemID', 'ProductName', 'Price', 'Quantity'],
                colWidths: [10, 40, 10, 10]
            });
        for (var i=0; i < res.length; i++) {
            var productArray = [res[i].item_id, res[i].product_name, res[i].price, res[i].stock_quantity];
            table.push(productArray);
        }
        console.log(table.toString());
        startmenu();
})

function startmenu() {
	inquirer.prompt([{
		type: "input",
		message: "Which Item_id would you like to Buy",
		name: "id",
		validate: function(value) {
			if (isNaN(value) === false && value <= 10) {
				return true;
			} else {
				return false;
			}
		}
	}, {
		type: "input",
		message: "How many units would you like to buy ?",
		name: "quantity",
		validate: function(value) {
			if (isNaN(value)) {
				return false;
			} else {
				return true;
			}
		}
	}]).then(function(answer) {
		var userQuantity = parseInt(answer.quantity);
		connection.query("SELECT * FROM products where ?", [{
			item_id: answer.id
		}], function(err, response) {
			if (err) {
				throw err;
			}
			if (response[0].stock_quantity < userQuantity) {
				console.log("Sorry we don't have that quantity in the store, we have " + response[0].stock_quantity + " available");
				console.log("please adjust the quantity or choose another item");
				startmenu();
			} else {
				var updatedQuantity = response[0].stock_quantity - userQuantity;
				console.log(updatedQuantity);
				var totalPrice = response[0].price * userQuantity;
				connection.query("UPDATE products SET stock_quantity= ? where item_id = ?", [updatedQuantity, answer.id], function(err, result) {
					if (err) {
						throw err;
					}
					console.log("Purchasd succesfully");
					console.log("Your total price :" + totalPrice);
					inquirer.prompt([{
						type: "confirm",
						message: "would you like to buy more ?",
						name: "buyMore"
					}]).then(function(answer) {
						if (answer.buyMore === true) {
							startmenu();
						} else {
							console.log("Thanks for visiting come again");
							connection.end();
						}
					})
				})
			}
		})
	});
}