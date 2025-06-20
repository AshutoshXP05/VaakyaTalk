import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { FriendRequest } from "../models/friendRequest.model.js";

const getrecommendedUsers = asyncHandler(async (req, res) => {
    const currentUserId = req.user._id;
    const currentUser = req.user;

    const recommendedUsers = await User.find({
        $and: [
            { _id: { $ne: currentUserId } }, // exclude current user
            { _id: { $nin: currentUser.friends } }, // exclude current user friends
            { isOnboarded: true }
        ]
    })
    return res.status(200).json(
        new ApiResponse(200, recommendedUsers, "Recommended Users Fetched Successfully")
    )
})


const getMyFriends = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id)
        .select("friends")
        .populate("friends", "userName profilePic nativeLanguage learningLanguage ");

    return res.status(200).json(
        new ApiResponse(200, user.friends, "Friends Fetched Successfully")
    )
})


const sendFriendRequest = asyncHandler(async (req, res) => {
    const myId = req.user._id;
    const { id: recipientId } = req.params;

    // prevent sending friend request to self
    if (myId === recipientId) {
        throw new ApiError(400, "You cannot send a friend request to yourself");
    }

    const recipient = await User.findById(recipientId)
    if (!recipient) {
        throw new ApiError(404, "Recipient not found");
    }

    // check if user is already a friend
    if (recipient.friends.includes(myId)) {
        throw new ApiError(400, "You are already friends with this user");
    }

    // check if friend request already exists
    const existingRequest = await FriendRequest.findOne({
        $or: [
            { sender: myId, recipient: recipientId },
            { sender: recipientId, recipient: myId }
        ],
    });

    if (existingRequest) {
        throw new ApiError(400, "Friend request already exists between you and this user");
    }

    // now we can create a new friend request
    const friendRequest = await FriendRequest.create({
        sender: myId,
        recipient: recipientId
    });

    return res.status(201).json(
        new ApiResponse(201, friendRequest, "Friend request sent successfully")
    );
})


const acceptFriendRequest = asyncHandler(async (req, res) => {
    const { id : requestId } = req.params;

    const friendRequest = await FriendRequest.findById(requestId) ;

    if ( ! friendRequest ) {
        throw new ApiError(404, "Friend request not found");
    }

    // Verify that the current user is the recipient of the request
    if ( friendRequest.recipient.toString() !== req.user._id) {
        throw new ApiError(403, "You are not authorized to accept this friend request");
    }

    friendRequest.status = "accepted";
    await friendRequest.save();

    // Add each user to the other's friends list
    // addToSet : add the element to the array only if it doesn't already exist
    await User.findByIdAndUpdate(friendRequest.sender, {
        $addToSet: { friends: friendRequest.recipient }
    })

    await User.findByIdAndUpdate(friendRequest.recipient, {  
        $addToSet: { friends: friendRequest.sender }
    })

    return res.status(200).json(
        new ApiResponse(200, friendRequest, "Friend request accepted successfully")
    );

})


const getFriendRequest = asyncHandler ( async (req,res) => {
    const incomingRequest = await FriendRequest.find({
        recipient: req.user._id,
        status: "pending",
    }).populate("sender", "userName profilePic nativeLanguage learningLanguage");

    const acceptedRequest = await FriendRequest.find({
        sender: req.user._id,
        status: "accepted",
    }).populate("recipient", "userName profilePic");

    return res.status(200).json(
        new ApiResponse(200, {
            incomingRequest,
            acceptedRequest
        }, "Friend requests fetched successfully")
    );
})


const getOutgoingFriendRequest = asyncHandler( async ( req, res) => {
    const outgoingFriendRequests = await FriendRequest.find({
        sender: req.user._id,
        status: "pending",  // only pending requests
    }).populate("recipient", "userName profilePic nativeLanguage learningLanguage");

    return res.status(200).json(
        new ApiResponse(200, outgoingFriendRequests, "Outgoing friend requests fetched successfully")
    );
})


export {
    getrecommendedUsers,
    getMyFriends,
    sendFriendRequest,
    acceptFriendRequest,
    getFriendRequest,
    getOutgoingFriendRequest
}