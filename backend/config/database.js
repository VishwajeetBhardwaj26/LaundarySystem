const mongoose = require("mongoose");
let uri="mongodb+srv://Dbuser1:ggZBc91mFwqOiKPJ@cluster0.2bzzu.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const database=( )=>{
    mongoose.connect(uri
    ,{useNewUrlParser:true,useUnifiedTopology:true})
    .then((data)=>{
    console.log(`mongodb connected to the server:${data.connection.host}`);
})
}
module.exports=database;