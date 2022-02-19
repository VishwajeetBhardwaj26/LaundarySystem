const mongoose = require("mongoose");
const validator= require("validator");
const bcrypt= require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto= require("crypto");
const userSchema= new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please Enter Your Name"],
        maxLength: [30, "Name cannot exceed 30 characters"],
        minLength: [4, "Name should have more than 4 characters"],
      },
      email: {
        type: String,
        required: [true, "Please Enter Your Email"],
        unique: true,
        validate: [validator.isEmail, "Please Enter a valid Email"],
      },
      password: {
        type: String,
        required: [true, "Please Enter Your Password"],
        minLength: [8, "Password should be greater than 8 characters"],
        select: false,
      },
      role: {
        type: String,
        default: "user",
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
      token:String,
    
      resetPasswordToken: String,
      resetPasswordExpire: Date,
});
//hashing password before saving
userSchema.pre("save",async function(next){
    if(!this.isModified("password")){
      next();
    }
    this.password= await bcrypt.hash(this.password,10)
  });
  //Creating JWT Token For the user
  userSchema.methods.getJWTToken= function(){
    return jwt.sign({id: this._id},process.env.JWT_SECRET,{
        expiresIn:'60d',
    });
  };
  //compairing password
  userSchema.methods.comparePassword =async function(password){
    return await bcrypt.compare(password,this.password);
  }
    //generating password reset token
    userSchema.methods.getResetPasswordToken = function() {
      //Generating token here
      const resetToken= crypto.randomBytes(20).toString("hex");
      //hashing and adding resetPasswordToken to the userSchema
      this.resetPasswordToken=crypto.createHash("sha256").update(resetToken).digest("hex");
      this.resetPasswordExpire=Date.now()+15*60*1000;
      return resetToken;
    }
module.exports=mongoose.model("User",userSchema);