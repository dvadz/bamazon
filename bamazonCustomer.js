var inquirer = require("inquirer");
var mysql = require("mysql");

var bamazonApp = {
    inventory : [],
    item_id: 0,
    itemIndex: 0,
    quantity: 0
}



function fetchInventory() {

    var connection = mysql.createConnection({
        host: "localhost",
        port: 3306,
        user: "root",
        password: "password",
        database: "bamazon"    
    });

    connection.connect(function(error){
        if(error) {
            console.log("ERROR: connection.connect");
            throw error;
        }
    
        connection.query(
            "SELECT * FROM products", 
            function(error, response){
                if(error){
                    console.log("ERROR: connection.query");
                    console.log(error.sql);
                    throw error;
                }

                //save the response into an array for later review
                response.forEach(element => {
                    bamazonApp.inventory.push(element);            
                });

                //display the inventory
                console.table(bamazonApp.inventory);

                //now ask your buyer some questions
                selectITem();
            }
        ); 
        connection.end();
    });

}

function updateInventory() {

    var connection = mysql.createConnection({
        host: "localhost",
        port: 3306,
        user: "root",
        password: "password",
        database: "bamazon"    
    });

    connection.connect(function(error){
        if(error) {
            console.log("ERROR setting up database connection");
            throw error;
        }
    
        connection.query(
            "UPDATE products SET stock_quantity = ? WHERE item_id = ?",
            [
                bamazonApp.inventory[bamazonApp.itemIndex].stock_quantity,
                bamazonApp.item_id
            ],
            function(error, response){
                if(error){
                    console.log(">>>> ERROR UPDATING DATABASE <<<<");
                    console.log(error.sql);
                    throw error;
                }
            }
        ); 
        connection.end();
    });
}


function selectITem(){
    //just creating some space
    console.log("");

    inquirer.prompt({
        type: "number",
        name: "itemID",
        message: "Please select from the 'item_id'?"
    })
    .then(function(answer){
        //user input is NOT a number
        if(isNaN(answer.itemID)){
            selectITem();
        
        //user input IS a number
        } else {
            // TODO: confirm that itemID exists
            let isItemIDValid = false;
            bamazonApp.inventory.forEach(function(item, index){
                if(answer.itemID===item.item_id) {
                    isItemIDValid = true;
                    bamazonApp.itemIndex = index;
                }
            });
            if(isItemIDValid){
                // save the itemID
                bamazonApp.item_id = answer.itemID;
                // show the name of the item that was selected
                console.log(` You picked: ${bamazonApp.inventory[bamazonApp.itemIndex].product_name}`);
                // ask for the quantity
                selectQuantity();
            } else {
                console.log("Item does not exist");
                selectITem();
            }
        }
    });
}

function selectQuantity(){
    //just creating some space
    console.log("");

    inquirer.prompt({
        type: "number",
        name: "quantity",
        message: "How many would you like to buy?"
    })
    .then(function(answer){
        //user input is NOT a number
        if(isNaN(answer.quantity)){
            selectQuantity();
        //user input IS a number
        } else {
            bamazonApp.quantity = answer.quantity;
            // check if there is enough inventory
            let available = bamazonApp.inventory[bamazonApp.itemIndex].stock_quantity;
            if(bamazonApp.quantity <= available) {
                //subtract the order quantity
                bamazonApp.inventory[bamazonApp.itemIndex].stock_quantity -= bamazonApp.quantity;
                let total = bamazonApp.quantity * bamazonApp.inventory[bamazonApp.itemIndex].price;
                // TODO: update the inventory
                updateInventory();
                // give the total cost
                console.log("");
                console.log(`Your total is $${total}`);
                console.log("");
        } else {
                console.log("Sorry we don't have enough to fulfill your order");
            }
        }

    });
}

fetchInventory();
