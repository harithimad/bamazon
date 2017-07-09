var mysql= require("mysql");
var inquirer=require("inquirer");
var Table=require("cli-table");
var connection = mysql.createConnection({
	host: "localhost",
	port: 3306,
	// Your username
	user: "root",
	// Your password
	password: "Slipknot@14",
	database: "bamazon"
});
connection.connect(function(err){
	if (err) {
		throw err;
	}
	console.log("connected successfully !");
	startmenu();
});

function startmenu(){
	inquirer.prompt([
	{
		type:"list",
		message:"what would you like to do ?",
		choices:["View Products for Sale","View Low Inventory","Add to Inventory","Add New Product"],
		name:"menu"
	}
		]).then(function(answer){
			switch(answer.menu){
				case "View Products for Sale":
				productsforsale();
				break;
				case "View Low Inventory":
				lowinventory();
				break;
				case "Add to Inventory":
				addInventory();
				break;
				case "Add New Product":
				addProduct();
				break;
			}
		})
}

function productsforsale(){
	connection.query("SELECT * from Products",function(err,res){
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

}

function lowinventory() {

	connection.query("select * from Products where stock_quantity<5",function (err,res){
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

	}

	function addInventory() {
		inquirer.prompt([
		{
			type:"input",
			message:"which item_id would you like to add Inventory to ?",
			name:"id",
			validate: function(val){
			return (!isNaN(val) && parseInt(val) > 0)
			}
		},
		{
			type:"input",
			message:"what is the Quantity that you would like to add ?",
			name:"quantity",
			validate: function(val){
			return (!isNaN(val) && parseInt(val) > 0)
			}
		}
		]).then(function(manager){
			var oldval;
			connection.query("select item_id,stock_quantity from Products where item_id=?",[manager.id],function(err,result){
				if(err){
					throw err;
				}
				if(result.length>0){
					oldval=parseInt(result[0].stock_quantity);
					connection.query("update products set stock_quantity = ? where item_id = ?",[oldval+parseInt(manager.quantity),manager.id],function(err,result){
						if (err){
							throw err;
						}
						console.log("the Stock Quantity has been updated");
					})
				}
				startmenu();
			})
		})
	}

	function addProduct(){

		inquirer.prompt([
		{
			type:"input",
			message:"what is the name of the Item ?",
			name:"item"
		},
		{
			type:"input",
			message:" which department would you like to add this item to ?",
			name:"department",
		},
		{
			type:"input",
			message:"what's the quantity that you'd like to add?",
			name:"quantity",
			validate: function(val){
			return (!isNaN(val) && parseFloat(val) > 0)
			}
		},
		{
			type:"input",
			message:" what is the price for the item?",
			name:"price",
			validate: function(val){
			return (!isNaN(val) && parseFloat(val) > 0)
			}
		}

			]).then(function(manager){
				var query="insert into products set ?";
				var values={
					product_name:manager.item,
					department_name:manager.department,
					price:parseInt(manager.price),
					stock_quantity:parseFloat(manager.quantity)
				}
				connection.query(query,values,function(err,result){
					if(err){
						throw err;

					}
					console.log("New product is inserted");
				})

				startmenu();
			})
			
		}

	


