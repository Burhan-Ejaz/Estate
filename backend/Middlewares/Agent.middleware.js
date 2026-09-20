const agentMiddleware = (req, res, next) => {

    if (req.user.role !== "agent") {
        return res.status(403).json({
            message: "Only agents can perform this operation"
        });
    }

    next();
};

export default agentMiddleware;