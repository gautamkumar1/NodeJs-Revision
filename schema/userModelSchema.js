import mongoose, { Schema } from "mongoose";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

const userSchema = new Schema({
  fullName: {
    type: String,
    required: true,
  },
  userName: {
    type: String,
    required: [true, "Username is required"],
    unique: true,
    lowercase: true,
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: [6, "Password must be at least 6 characters long"],
    select: false,
  },
  profilePicture: {
    type: String,
  },
  refreshToken: {
    type: String,
  },
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcryptjs.hash(this.password, 10);
  next();
});

userSchema.methods.isPasswordCorrect = async function(password){
    return await bcryptjs.compare(password,this.password);
}

userSchema.methods.generateAcessToken = async function(){

    const token = jwt.sign({ 
        id: this._id,
        username: this.userName,
        email: this.email,

    }, 
    process.env.ACCESS_TOKEN_SECRET, 
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY });

    console.log("Generated Access Token:", token); // Debug log
    return token;

}

userSchema.methods.generateRefreshToken = async function(){
    const token = jwt.sign({ id: this._id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn:process.env.REFRESH_TOKEN_EXPIRY });
    
    console.log("Generated Refresh Token:", token); // Debug log
    return token;
}
export const User = mongoose.model("User", userSchema);
