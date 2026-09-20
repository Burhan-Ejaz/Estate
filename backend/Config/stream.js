import { StreamChat } from "stream-chat";

const streamClient = StreamChat.getInstance(
    process.env.STREAM_API_KEY,
    process.env.STREAM_API_SECRET
);

export default streamClient;
