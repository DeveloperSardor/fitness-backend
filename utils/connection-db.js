const mongoose = require('mongoose')
require('dotenv').config()

const DB_URL = process.env.DB_URL;

 const ConnectDb = ()=>{
mongoose.connect(DB_URL)
 .then(data=>{
    console.log('Successfuly connected to DB');
 }) 
 .catch(err=>console.log(err))  
}

module.exports = ConnectDb;