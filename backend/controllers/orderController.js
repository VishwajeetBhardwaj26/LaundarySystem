const Order =require("../Models/orderModel");
const User=require("../Models/userModel");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncError=require("../middleware/asyncError");
const sendEmail = require("../utils/sendEmail");
//Create New Product
exports.newOrder=catchAsyncError(async(req,res,next)=>{
    const {PersonalInfo,ClothQuantity}=req.body;
   
    
    const order=await Order.create({
        PersonalInfo,
        ClothQuantity,
        deliveryDate:new Date(Date.now() + ( 3600 * 1000 * 4*24))
    });
    const deliveryDate=new Date(Date.now() + ( 3600 * 1000 * 4*24));
    const message=`Your order summary is \n \n${JSON.stringify(ClothQuantity)} \n\nand you can receive it on ${deliveryDate}`; 
    try {
        await sendEmail({
            email:PersonalInfo.email,
            subject:`Order Summary`,
            message,

        });
        res.status(200).json({
            success:true,
            message:`Email sent to  ${PersonalInfo.Name} successfully`,
        });
        
    } catch (error) {
        return next(new ErrorHandler(error.message,500))
        
    }
    
});
//get single order details
exports.getSingleOrder=catchAsyncError(async(req,res,next)=>{
    const order=await Order.findById(req.params.id).populate("user","name email");
    if(!order){
        return next(new ErrorHandler("Order not found with this user Id",404));
    }
    res.status(200).json({
        success:true,
        order
    });
});