import { User } from "../schema/userModelSchema.js";

/*
 * / / / / / / / / / / / / / /
 * GENERATE ACCESS AND REFRESH TOKEN - LOGIN CONTROLLER
 *  / / / / / / / / / / / / / /
 */

const generateAcessTokenAndRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId);
        if (!user) {
            throw new Error("User not found");
        }

        // Generate access and refresh token
        const accessToken = user.generateAcessToken();
        const refreshToken = user.generateRefreshToken();
        // Save the refresh token in the database
        user.refreshToken = refreshToken;
        await user.save({validateBeforeSave: false});

        // Send the tokens to the client

        return {
            accessToken,
            refreshToken
        }

    } catch (error) {
        res.send(404, {message: "Error generating access token and refresh token"});
        console.log(error);
    }
}
export const register = async (req,res) =>{
    try {
        // Step 1: Get the dtat of the user (FrontEnd)
    const {fullName,userName,email,password} = await req.body;
    // Step 2: Validate the fields
    if(!fullName|| !userName|| !email|| !password){
        return res.status(400).json({message: "All fields are required"});
    }
    // Step 3: Check if the username or email already exists
    const isEmailUserName = await User.findOne({
        $or:[{userName}, {email}]
    })

    if(isEmailUserName){
        return res.status(400).json({message: "Username or Email already exists"});
    }
    // Step 4: Create a new user
    const newUser = await User.create({
        fullName,
        userName,
        email,
        password
    })
    // Step 5: return the new user
    return res.status(201).json({
        message: "User created successfully",
        data: newUser
    });
    } catch (error) {
        throw new Error(error);
    }
}

export const login = async (req,res) =>{
    try {
        // step 1: get the data from the server
    const {email,password} = await req.body;
    // step 2: validate the fields
    if(!email || !password){
        return res.status(400).json({message: "All fields are required"});
    }
    // step 3: check if the user exists
    const isUser = await User.findOne({email:email}).select("+password");

    if(!isUser){
        return res.status(401).json({message: "User Does Not Exist"});
    }

    // step 4: check if the password is correct
    const isMatch = await isUser.isPasswordCorrect(password);
    if(!isMatch){
        return res.status(401).json({message: "Invalid Password"});
    }
    // step 5: generateing the access and refresh token
    const {accessToken, refreshToken} = await generateAcessTokenAndRefreshToken(isUser._id);
    const loggedInUser = await User.findById(isUser._id).select("-password -refreshToken")
    // step 6: return the access and refresh token
    const options = {
        httpOnly: true,
        secure: true
    }
    return res
     .status(200)
     .cookie("refreshToken", refreshToken, options)
     .cookie("accessToken", accessToken, options)
     .json({
        message: "User logged in successfully",
        data: {
            user: loggedInUser,accessToken,refreshToken
        }
     })
    } catch (error) {
        throw new Error(error);
    }
}

export const getAllUsers = async (req, res) => {
    try {
        // step 1: get all users
    const users = await User.find({}); // User.find({}) is a Mongoose method that retrieves all documents from the User collection.
    // step 2: return the users
    return res.json({
        message: "Users fetched successfully",
        data: users
    });
    } catch (error) {
        throw new Error(error);
    }
}
