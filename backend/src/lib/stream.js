import {StreamChat} from 'stream-chat';
import "dotenv/config"
import { asyncHandler } from '../utils/asyncHandler.js';

const apiKey = process.env.STREAM_API_KEY
const apiSecret = process.env.STREAM_API_SECRET;

if ( !apiKey || !apiSecret ) {
    throw new Error("STREAM_API_KEY or STREAM_API_SECRET is missing");
}

const streamClient = StreamChat.getInstance(apiKey, apiSecret);

export const upsertStreamUser = asyncHandler ( async (userData) => {
    await streamClient.upsertUser(userData);
    return userData;
});


// export const generateStreamToken = ( userId ) => {} ;


