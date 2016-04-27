//////////////////////////////////////////////////////////////////
////////////Seed script - this is where we clean / seed the database during development
//////////////////////////////////////////////////////////////

var mongoose = require("mongoose");
var User = require ("./models/user");
var faker = require("faker");

function cleanDB(){
    // Remove all Users
    User.remove({}, function(err){
        if (err){
            console.log(err);
        } else {
            console.log("Removed Users");
        };
        })
    };

function seedDB(){
    // clean the db
    cleanDB();
    // seed code goes here
    
}
module.exports = seedDB;


