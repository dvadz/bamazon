var inquirer = require("inquirer");
var mysql = require("mysql");


var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "password",
    database: "bamazon"    
    // database: "top_songsDB"

});

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
            console.table(response) ;
        }
    ); 

    connection.end();
    console.log("Database connection has ended");
});