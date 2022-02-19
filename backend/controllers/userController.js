const ErrorHandler = require("../utils/errorHandler");
const catchAsyncError= require("../middleware/asyncError");
const User= require("../Models/userModel");
const sendToken = require("../utils/jwtToken");
const sendEmail = require("../utils/sendEmail");
const crypto= require("crypto");
//Registering a user
exports.registerUser = catchAsyncError((req,res,next)=>{
    const {name,email,password}= req.body;
    const user = User.create({
        name,
        email,
        password,
    });
       sendToken(user,200,res);
});
//login User
exports.loginUser =catchAsyncError(async(req,res,next)=>{
    const{email,password}=req.body;
//checking if user have given both the fields
    if(!email||!password) {
        return next(new ErrorHandler("Please enter Email and Password",400));
    }
    const user = await User.findOne({email:email}).select("+password");
    if(!user){
        return next(new ErrorHandler("Kindly Fill the Correct Email or Password",401));
    }
    const isPasswordMatched=await user.comparePassword(password);
    if(!isPasswordMatched){
        return next(new ErrorHandler("Please enter the field precisely",401))
    }
   sendToken(user,200,res);

});
//User Logout
exports.logout = catchAsyncError(async(req,res,next)=>{
    res.cookie("token",null,{
        expires:new Date(Date.now()),
        httpOnly:true,
    });
    res.status(200).json({
        success:true,
        message:"Logged Out Successfully"
    });
});
//Forgot Password
exports.forgotPassword = catchAsyncError(async(req,res,next)=>{
    const user= await User.findOne({email:req.body.email});
    if(!user){
        return next(new ErrorHandler("user not found",404));
    }
    //Get ResetPassword token
    const resetToken = user.getResetPasswordToken();
    await user.save({validateBeforeSave: false});
    const resetPasswordUrl=`${req.protocol}://${req.get("host")}/api/v1/password/reset/${resetToken}`;
    const message=`Here is your link to reset your Password :- \n\n${resetPasswordUrl}`;
    try {
        await sendEmail({
            email:user.email,
            subject:`Password Recovery Email`,
            message,

        });
        res.status(200).json({
            success:true,
            message:`Email sent to  ${user.email} successfully`,
        });
        
    } catch (error) {
        user.getResetPasswordToken=undefined;
        user.resetPasswordExpire=undefined;
        await user.save({validateBeforeSave: false});
        return next(new ErrorHandler(error.message,500))
        
    }

});
//Reset Password
exports.resetPassword= catchAsyncError(async(req,res,next)=>{
    //creating tokenHash
    const resetPasswordToken=crypto.createHash("sha256").update(req.params.token).digest("hex");
    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire:{$gt:Date.now()},
    });
    if(!user){
        return next(new ErrorHandler("Reset Password Token is not valid or expired",400));

    }
    if(req.body.password !=req.body.confirmPassword){
        return next(new ErrorHandler("Please retype your password",400));
    }
    user.password=req.body.password
    user.resetPasswordToken= undefined,
    user.resetPasswordExpire= undefined,
    await user.save();
    sendToken(user,200,res);

});
