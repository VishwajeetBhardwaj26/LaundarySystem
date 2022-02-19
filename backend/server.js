const app = require("./app");
const dotenv= require("dotenv");
const database = require('./config/database');
//handling uncaught error
process.on("uncaughtException",(err)=>
{
    console.log(`Error:${err.message}`);
    console.log(`Sorry for the interuption but server is shutting down for uncaught Exception`);
    process.exit(1);
});
dotenv.config({path:"backend/config/config.env"});
database();
const server=app.listen(8080,()=>{
    console.log("server is listening on port 8080");
});
//unhandled Promise Rejection
process.on("unhandledRejection",(err)=>{
    console.log(`Error:${err.message}`);
    console.log(`Sorry for the interuption but server is shutting down for unhandled Exception`);
    server.close(()=>{
        process.exit(1);
    });
});
