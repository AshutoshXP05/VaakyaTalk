import { upsertStreamUser } from "../lib/stream.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";


const generateAccessandRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })

        return { accessToken, refreshToken }

    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating refresh and access tokens")
    }
}


const signUp = asyncHandler(async (req, res) => {

    const { userName, email, password } = req.body

    if (
        [userName, email, password].some((field) => field?.trim() === "")
    ) {
        throw new ApiError(400, "All fields are necessary : ");
    }

    if (password.length < 8) {
        throw new ApiError(400, "Password must be at least 8 character");
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
        throw new ApiError(400, "Invalid email format ");
    }

    const existedUser = await User.findOne({ email })

    if (existedUser) {
        throw new ApiError(400, "Email already exists, please use a different one");
    }

    const index = Math.floor(Math.random() * 100) + 1;   // generate a number between [1,100]
    const randomAvatar = `https://avatar.iran.liara.run/public/${index}.png`

    const user = await User.create({
        userName,
        email,
        password,
        profilePic: randomAvatar
    });

    try {
        await upsertStreamUser({
            id: user._id.toString(),
            name: user.userName,
            image: user.profilePic || ""
        });
        console.log(`Stream user upserted successfully ${user.userName}`);

    } catch (error) {
        console.log("Error upserting Stream user: ", error);

    }


    const createUser = await User.findById(user._id).
        select(
            "-password -refreshToken"
        )


    if (!createUser) {
        throw new ApiError(400, "Something went wrong while signUp the user ")
    }

    return res.status(201).json(
        new ApiResponse(200, createUser, "User Created Successfully")
    )

})


const loginUser = asyncHandler(async (req, res) => {

    const { email, password } = req.body

    if (!email || !password) {
        throw new ApiError(400, "All fields are required ")
    }

    const user = await User.findOne({ email })

    if (!user) {
        throw new ApiError(400, " Invalid Email or Password ")
    }

    const isPasswordValid = await user.isPasswordCorrect(password)

    if (!isPasswordValid) {
        throw new ApiError(401, "Password is not correct ")
    }

    const { accessToken, refreshToken } = await generateAccessandRefreshToken(user._id);

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
    }

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200,
                {
                    user: loggedInUser, accessToken, refreshToken
                },
                "User Logged in Successfully"
            )
        )
})


const logoutUser = asyncHandler(async (req, res) => {

    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                refreshToken: undefined
            }
        },
        {
            new: true
        }
    )

    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
    };

    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(
            new ApiResponse(
                200,
                {},
                "User Logged Out Successfully "
            )
        )

})


const onBoarding = asyncHandler(async (req, res) => {
    const user = req.user._id;

    const { userName, bio, nativeLanguage, learningLanguage, location } = req.body;

    if (!userName || !bio || !nativeLanguage || !learningLanguage || !location) {
        return res.status(400).json({
            message: "All fields are required",
            missingFields: [
                !userName && "userName",
                !bio && "bio",
                !nativeLanguage && "nativeLanguage",
                !learningLanguage && "learningLanguage",
                !location && "location"
            ].filter(Boolean),
        });
    }

    const updatedUser = await User.findByIdAndUpdate(
        user,
        {
            ...req.body,
            isOnboarded: true
        },
        { new: true }
    );

    if (!updatedUser) {
        throw new ApiError(400, "Failed to update user during onboarding");
    }

    return res.status(201).json(
        new ApiResponse(200, updatedUser, "User onboarded successfully")
    );
});



export {
    signUp,
    loginUser,
    logoutUser,
    onBoarding

}