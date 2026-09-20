import React, { useEffect, useState, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { StreamChat } from 'stream-chat';
import {
    Chat,
    ChannelList,
    Channel,
    Window,
    ChannelHeader,
    MessageList,
    MessageComposer,
    Thread,
    useChatContext,
} from 'stream-chat-react';
import 'stream-chat-react/css/index.css';
import { Spin, Empty, message as antdMessage } from 'antd';
import api from '../../../api/axios.js';
import { useAuth } from '../../../Context/AuthContext.jsx';
import './Messages.css';

const EmptyChannelState = () => (
    <div className="messages-state">
        <Empty description="Select a conversation to start chatting" />
    </div>
);

const AutoOpenChannel = ({ propertyId }) => {
    const { client, setActiveChannel } = useChatContext();
    const openedRef = useRef(null);

    useEffect(() => {
        if (!propertyId || openedRef.current === propertyId) return;
        openedRef.current = propertyId;

        const openChannel = async () => {
            try {
                const response = await api.post('/chat/channel', { propertyId });
                const { channelId, channelType } = response.data;
                const channel = client.channel(channelType, channelId);
                await channel.watch();
                setActiveChannel(channel);
            } catch (error) {
                console.log(error);
                antdMessage.error(error.response?.data?.message || 'Failed to start chat');
            }
        };

        openChannel();
    }, [propertyId, client, setActiveChannel]);

    return null;
};

const Messages = () => {
    const { user, authLoading } = useAuth();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const propertyId = searchParams.get('propertyId');

    const [client, setClient] = useState(null);
    const [connecting, setConnecting] = useState(true);
    const currentUserId = user?._id || user?.id;

    useEffect(() => {
        if (authLoading) return;

        if (!user) {
            navigate('/login');
            return;
        }

        let chatClient;
        let cancelled = false;

        const init = async () => {
            try {
                const response = await api.get('/chat/token');
                const { token, apiKey, user: streamUser } = response.data;

                chatClient = StreamChat.getInstance(apiKey);
                await chatClient.connectUser(
                    { id: streamUser.id, name: streamUser.name, email: streamUser.email },
                    token
                );

                if (!cancelled) setClient(chatClient);
            } catch (error) {
                console.log(error);
                antdMessage.error('Failed to connect to chat');
            } finally {
                if (!cancelled) setConnecting(false);
            }
        };

        init();

        return () => {
            cancelled = true;
            chatClient?.disconnectUser();
        };
    }, [user, authLoading, navigate]);

    if (authLoading || connecting || !client) {
        return (
            <div className="messages-state">
                <Spin size="large" />
            </div>
        );
    }

    const filters = { type: 'messaging', members: { $in: [currentUserId] } };
    const sort = [{ last_message_at: -1 }];

    return (
        <div className="messages-page">
            <Chat client={client}>
                <AutoOpenChannel propertyId={propertyId} />
                <div className="messages-layout">
                    <div className="messages-sidebar">
                        <ChannelList filters={filters} sort={sort} showChannelSearch={false} />
                    </div>
                    <div className="messages-window">
                        <Channel EmptyStateIndicator={EmptyChannelState}>
                            <Window>
                                <ChannelHeader />
                                <MessageList />
                                <MessageComposer />
                            </Window>
                            <Thread />
                        </Channel>
                    </div>
                </div>
            </Chat>
        </div>
    );
};

export default Messages;
