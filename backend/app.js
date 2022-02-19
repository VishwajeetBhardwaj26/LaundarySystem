const express= require("express");
const app = express();
const cookieParser=require("cookie-parser");
app.use(express.json());
app.use(cookieParser());
const errorMiddleware= require("./middleware/error");
//importing Route
const user =require("./routes/userRoute");
const order=require("./routes/orderRoute");
app.use("/api/v1",user);
app.use("/api/v1",order);
//error Middleware
app.use(errorMiddleware);
module.exports=app;