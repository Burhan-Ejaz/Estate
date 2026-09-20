import streamClient from "../Config/stream.js";
import User from "../Models/User.model.js";
import Property from "../Models/Property.model.js";

const getStreamToken = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        await streamClient.upsertUser({
            id: user._id.toString(),
            name: user.name,
            email: user.email,
        });

        const token = streamClient.createToken(user._id.toString());

        res.status(200).json({
            token,
            apiKey: process.env.STREAM_API_KEY,
            user: {
                id: user._id.toString(),
                name: user.name,
                email: user.email,
            },
        });
    } catch (error) {
        res.status(500).json({ message: "Failed to get chat token", error: error.message });
    }
};

const createPropertyChannel = async (req, res) => {
    try {
        const { propertyId } = req.body;

        if (!propertyId) {
            return res.status(400).json({ message: "propertyId is required" });
        }

        const property = await Property.findById(propertyId).populate("agent", "name email");
        if (!property) {
            return res.status(404).json({ message: "Property not found" });
        }

        const agentId = property.agent._id.toString();
        const customerId = req.user.id;

        if (agentId === customerId) {
            return res.status(400).json({ message: "You cannot start a chat about your own property" });
        }

        const customer = await User.findById(customerId);
        if (!customer) {
            return res.status(404).json({ message: "User not found" });
        }

        await streamClient.upsertUsers([
            { id: agentId, name: property.agent.name, email: property.agent.email },
            { id: customerId, name: customer.name, email: customer.email },
        ]);

        const channelId = `property-${propertyId}-${customerId}`.slice(0, 64);

        const channel = streamClient.channel("messaging", channelId, {
            members: [agentId, customerId],
            created_by_id: customerId,
            property_id: propertyId,
            property_title: property.title,
        });

        await channel.create();

        res.status(200).json({ channelId, channelType: "messaging" });
    } catch (error) {
        res.status(500).json({ message: "Failed to start chat", error: error.message });
    }
};

export { getStreamToken, createPropertyChannel };
