import { useEffect, useState } from "react";
import { useParams } from "react-router";
import useAuthUser from "../hooks/useAuthUser.js";
import { useQuery } from "@tanstack/react-query";
import { getStreamToken } from "../lib/api";

import {
  Channel,
  ChannelHeader,
  Chat,
  MessageInput,
  MessageList,
  Thread,
  Window,
} from "stream-chat-react";

import { StreamChat } from "stream-chat";
import toast from "react-hot-toast";
import ChatLoader from "../components/ChatLoader.jsx";
import CallButton from "../components/CallButton.jsx";

const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY;

function ChatPage() {
  const { id: targetUserId } = useParams();

  const [chatClient, setChatClient] = useState(null);
  const [channel, setChannel] = useState(null);
  const [loading, setLoading] = useState(true);

  const { authUser } = useAuthUser();

  // Fetch Stream token when authUser is available
  const { data: tokenData } = useQuery({
    queryKey: ["streamToken"],
    queryFn: getStreamToken,
    enabled: !!authUser, // Only run query if authUser is defined
  });

  useEffect(() => {
    const initChat = async () => {
      console.log("Running initChat()");

      if (!tokenData?.token || !authUser) {
        console.log("Missing token or authUser", tokenData, authUser);
        return;
      }

      try {
        console.log("Initializing streaming chat client...");

        // Create StreamChat instance
        const client = StreamChat.getInstance(STREAM_API_KEY);

        // Important: disconnect previous user if already connected
        if (client.userID) {
          console.log("Disconnecting previous user...");
          await client.disconnectUser();
        }

        // Connect current user
        await client.connectUser(
          {
            id: authUser._id,
            name: authUser.userName,
            image: authUser.profilePic,
          },
          tokenData.token
        );

        // Create a consistent channel ID between two users (alphabetical order)
        const channelId = [authUser._id, targetUserId].sort().join("-");

        // Initialize the messaging channel
        const currChannel = client.channel("messaging", channelId, {
          members: [authUser._id, targetUserId],
        });

        await currChannel.watch(); // Start watching the channel

        setChatClient(client);
        setChannel(currChannel);
      } catch (error) {
        console.error("Error initializing chat client:", error);
        toast.error("Could not connect to chat. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    initChat();
  }, [tokenData, authUser, targetUserId]);

  // Cleanup when component unmounts
  useEffect(() => {
    return () => {
      if (chatClient) {
        console.log("Disconnecting chat client on unmount...");
        chatClient.disconnectUser();
      }
    };
  }, [chatClient]);

  const handleVideoCall = () => {
    if ( channel ) {
      const callUrl = `${window.location.origin}/call/${channel.id}`;

      channel.sendMessage({
        text: `I've started a video call! Join here: ${callUrl}`,
      })

      toast.success("Video call link sent successfully!");
    }
   }

  // Show spinner while loading
  if (loading || !chatClient || !channel) {
    return <ChatLoader />;
  }

  // Final UI
  return (
    <div className="h-[93vh]">
      <Chat client={chatClient}>
        <Channel channel={channel}>
          <div className="w-full relative">
            <CallButton handleVideoCall={handleVideoCall}/>
            <Window>
              <ChannelHeader />
              <MessageList />
              <MessageInput focus />
            </Window>
          </div>
          <Thread />
        </Channel>
      </Chat>
    </div>
  );
}

export default ChatPage;
