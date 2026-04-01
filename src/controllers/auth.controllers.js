import { ApiResponse } from "../utils/api-response.js";
import { ApiError } from "../utils/api-error.js";
import { asyncHandler } from "../utils/async-handler.js";
import { User } from "../models/user.models.js";

// later 
const generateAccessAndRefreshToken = async function (userId) {
    try {
        const user = await User.findById(userId)

    } catch (error) {
        
    }
}

const registerUser = asyncHandler(async function(req, res) {

    const {email, username, password} = req.body
    
    //checking if username or email already exists
    const existingUser = await User.findOne({
        $or: [{email: email}, {username: username}]
    })
    
    if (existingUser) {
        throw new ApiError(409, "Username or email already exists!", [])
    }

    //creating user document and saving
    const user = await User.create({
        email: email,
        username: username,
        password: password
    })

    const createdUser = await User.findById(user._id).select("-password -refreshToken")

    if (!createdUser) {
        throw new ApiError(500, "Problem occured while creating user!")
    }

    return res.status(201).json(new ApiResponse(201, {user: createdUser}, "user registered successfully!")) 
    
})

export { registerUser }