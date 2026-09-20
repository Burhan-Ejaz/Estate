import User from "../Models/User.model.js";
import Property from "../Models/Property.model.js";



//User page
const getAllUsers = async (req , res) =>{
    try {
        const allUsers = await User.find({role : "user"}).select('-password')
        res.status(200).json(allUsers);
        
    } catch (error) {
        res.status(500).json({ message: 'Failed to get users', error: error.message  });
        
    }

}
//Agent page
const getAllAgents = async (req , res) =>{
    try {
        const allAgents = await User.find({role : "agent"}).select('-password')
        res.status(200).json(allAgents);
        
    } catch (error) {
        res.status(500).json({ message: 'Failed to get agents', error: error.message  });
        
    }

}

const deleteAllUserandAgents = async (req, res ) =>{
    try {
        const deleteUserandAgent = await User.findByIdAndDelete(req.params.id);
    if(!deleteUserandAgent){
        return res.status(401).json({message: 'Cannot find user'})

    }
    res.status(200).json({message:'User Deleted successfully'})
        
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete user', error: error.message  });
    }
}

//Agent request page
const getPendingAgentApplication = async (req , res)=>{
       try {
        const pendingRequest = await User.find({agentStatus : 'pending'}).select('-password');
        res.status(200).json(pendingRequest)
        
       } catch (error) {
        res.status(500).json({ message: 'Failed to get application', error: error.message  });
       }

}

const approveAgent = async (req , res) =>{
    try {
        const request = await User.findById(req.params.id);
        if(!request || request.agentStatus != 'pending'){
            return res.status(404).json({message: 'Application not found'})
        }
        request.agentStatus = 'approved'
        request.role = 'agent'
        await request.save()
        res.status(200).json({message:'Agent Approved'})

        
    } catch (error) {
        res.status(500).json({ message: 'Failed to approve application', error: error.message  });
    }
}

const rejectAgent = async (req , res) =>{
    try {
        const request = await User.findById(req.params.id);
        if(!request || request.agentStatus != 'pending'){
            return res.status(404).json({message:'Application not found'})
        }
        request.agentStatus = 'rejected'
        await request.save()
        res.status(200).json({message:'Agent rejected'})
        
    } catch (error) {
        res.status(500).json({ message: 'Failed to reject application', error: error.message  });
    }
}

// Proprties page
const deleteProperties = async (req , res) =>{
    try {
        const properties =  await Property.findByIdAndDelete(req.params.id);
        if(!properties){
            return res.status(400).json({message : 'Property not found'})
        }
        res.status(200).json({message: 'property deleted successfully'})
        
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete property', error: error.message  });
    }
}

const getAllProperties = async (req , res) =>{
    try {
        const allProperties = await Property.find().populate('agent', 'name email');
        res.status(200).json(allProperties)
        
    } catch (error) {
        res.status(500).json({ message: 'Failed to get properties', error: error.message  });
    }
}

export{
    getAllUsers,
    getAllAgents,
    deleteAllUserandAgents,

    getPendingAgentApplication,
    approveAgent,
    rejectAgent,

    getAllProperties,
    deleteProperties
}











/*const approveAgent = async (req , res) =>{
    try {
        
    } catch (error) {
        res.status(500).json({ message: 'Failed to get application', error: error.message  });
    }
}*/