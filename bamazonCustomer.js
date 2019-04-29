var inquirer = require("inquirer");
var mysql = require("mysql");

var inventory = [];

// TODO: secure your password
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "password",
    database: "bamazon"    
    // database: "top_songsDB"

});

function checkInventory(query) {

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
                    inventory.push(element);            
                });

                //display the inventory
                // TODO: Don't show the index
                console.table(inventory) ;

                //now ask your buyer some questions
                askCustomerToSelectITem();
            }
        ); 
        connection.end();
    });

}

function askCustomerToSelectITem(){
    //just creating some space
    console.log("");

    inquirer.prompt({
        type: "number",
        name: "itemID",
        message: "Please select from the 'item_id'?"
    })
    .then(function(answer){
        if(isNaN(answer.itemID)){
            askCustomerToSelectITem();
        } else {
            console.log("You picked:" + answer.itemID);
            // TODO: confirm that itemID exists

        }

    });
}


checkInventory();

