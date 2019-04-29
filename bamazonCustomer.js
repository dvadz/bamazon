var inquirer = require("inquirer");
var mysql = require("mysql");

var bamazonApp = {
    inventory : [],
    item_id: 0,
    quantity: 0
    
}

// TODO: secure your password
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "password",
    database: "bamazon"    
    // database: "top_songsDB"

});

function fetchInventory(query) {

    connection.connect(function(error){
        if(error) {
            console.log("ERROR setting up database connection");
            throw error;
        }
        console.log("Database connection established");
    
        connection.query(
            "SELECT * FROM products", 
            function(error, response){
                if(error){
                    console.log(">>>> ERROR READING FROM DATABASE <<<<");
                    console.log(error.sql);
                    throw error;
                }

                //save the response into an array for later review
                response.forEach(element => {
                    bamazonApp.inventory.push(element);            
                });

                //display the inventory
                // TODO: Don't show the index
                console.table(bamazonApp.inventory);

                //now ask your buyer some questions
                selectITem();
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
            bamazonApp.inventory.forEach(function(item){
                if(answer.itemID===item.item_id) isItemIDValid = true;
            });

            if(isItemIDValid){
                // save the itemID
                bamazonApp.item_id = answer.itemID;
                console.log(`Item: ${bamazonApp.item_id}`);
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
        message: "How many would like to buy?"
    })
    .then(function(answer){
        if(isNaN(answer.quantity)){
            selectQuantity();
        } else {
            console.log("You picked:" + answer.quantity);
            // TODO: check if there is enough inventory
            
            // TODO: give the total cost

            // TODO: update the inventory

        }

    });
}

fetchInventory();

