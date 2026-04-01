import { ApiResponse } from "../utils/api-response.js";
import { ApiError } from "../utils/api-error.js";
import { asyncHandler } from "../utils/async-handler.js";
import { User } from "../models/user.models.js";


const generateAccessAndRefreshToken = async function (userId) {
    try {
        const user = await User.findActiveId(userId)
        const accessToken = await user.generateAccessToken()
        const refreshToken = await user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({validateBeforeSave: false})
        return { accessToken, refreshToken }
    } catch (error) {
        console.log(error)
        throw new ApiError(500, "error generating access and refresh tokens...")
    }
}

const registerUser = asyncHandler(async function(req, res) {

    const {email, username, password} = req.body
    
    //checking if username or email already exists
    const existingUser = await User.findActiveOne({
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

    const createdUser = await User.findActiveId(user._id).select("-password -refreshToken -isDeleted")

    if (!createdUser) {
        throw new ApiError(500, "Problem occured while creating user!")
    }

    return res.status(201).json(new ApiResponse(201, {user: createdUser}, "user registered successfully!")) 
    
})

const loginUser = asyncHandler(async function(req, res) {

    const {email, username, password} = req.body

    if (!email && !username) {
        throw new ApiError(400, "email or username required!")
    }

    //checking if User exists or not
    const existingUser = await User.findActiveOne({
        $or: [{email}, {username}]
    })

    if (!existingUser) {
        throw new ApiError(400, "invalid credentials!")
    }

    const isPasswordValid = await existingUser.isPasswordCorrect(password)

    if (!isPasswordValid) {
        throw new ApiError(400, "invalid credentials!")
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(existingUser._id)

    const loggedUser = existingUser.toObject()
    delete loggedUser.password

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200,
                {user: loggedUser},
                "user loggedin succesfully"
            )
        )
})

//later
const deleteUser = asyncHandler(async function (req, res) {
    
    const { id } = req.params   

    if (!id) {
        throw new ApiError(404, "id not found!")
    }

    const user = await User.findOneAndUpdate(
    { id, isDeleted: false},
    { isDeleted: true },
    { new: true }
    )

    if (!user) {
        throw new ApiError(404, "user not found!")
    }
    res.status(200).json(new ApiResponse(200, null, "user deleted successfully"))
})

export { registerUser, loginUser, deleteUser }