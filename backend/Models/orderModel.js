const mongoose =require("mongoose");
const validator= require("validator");
const orderSchema=new mongoose.Schema({
    PersonalInfo:{
        Name:{
            type:String,
            required:true,
        },
        Date:{
            type:Date,
            default:Date.now()
        },
        LaundaryNo:{
            type:String,
            required:true
        },
        EnrollmentNo:{
            type:String,
            required:true
        },
        email:{
            type: String,
            required: [true, "Please Enter Your Email"],
            unique: true,
            validate: [validator.isEmail, "Please Enter a valid Email"],

        }

    },
    ClothQuantity:{
        Shirt:{
            type:Number,
            required:false
        },
        TShirt:{
            type:Number,
            required:false
        },
        PillowCover:{
            type:Number,
            required:false
        },
        BedSheet:{
            type:Number,
            required:false
        },
        Towel:{
            type:Number,
            required:false
        },
        Pant:{
            type:Number,
            required:false
        },
        Jean:{
            type:Number,
            required:false
        },
        Payjama:{
            type:Number,
            required:false
        },
        Bermuda:{
            type:Number,
            required:false
        },
    },
    deliveryDate:Date


});
module.exports = mongoose.model("Order", orderSchema);