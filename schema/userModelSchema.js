import mongoose,{Schema} from "mongoose";


const userSchema = new Schema({
    fullName:{
        type:String,
        required:true
    },
    userName:{
        type:String,
        required:[true,"Username is required"],
        unique:true,
        lowercase:true,
    },
    email:{
        type:String,
        required:[true,"Email is required"],
        unique:true,
    },
    password:{
        type:String,
        required:[true,"Password is required"],
        minlength:[6,"Password must be at least 6 characters long"],
        select:false
    },
    profilePicture:{
        type:String,
        required:[true,"Profile picture is required"],
    },
    refreshToken:{
        type:String,
        
    },
})

export const User = mongoose.model("User", userSchema);