import User from "../Models/User.model.js";

const getProfile = async (req,res) =>{
    try {
        const getProfile = await User.findById(req.user.id).select('-password');
        if(!getProfile){
            return res.status(401).json({message:"Profile not Found"})
        }
        res.status(201).json(getProfile);
    } catch (error) {
        res.status(500).json({ message: 'Failed to get Profile', error: error.message  });
    }
}  

const deleteProfile = async (req, res) => {
    try {
        const profile = await User.findByIdAndDelete(req.user.id);
        res.status(201).json({message:"Profile deleted sucessfully"})
        
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete Profile', error: error.message  });
    }

}

const updateProfile = async (req,res) =>{
   try {
     const { name, email } = req.body;

     const updateProfile = await User.findByIdAndUpdate(req.user.id ,{ name, email },
        { new : true, runValidators: true }).select('-password');

     if(!updateProfile){
        return res.status(402).json({message: 'Profile not found'})
    }
    res.status(201).json({message: 'Profile updated successfully', user: updateProfile})

   } catch (error) {
    res.status(500).json({ message: 'Failed to update Profile', error: error.message  });
   }
}

const applyForAgent = async (req,res) => {
    try {
        const agentRequest = await User.findById(req.user.id);
        if (!agentRequest) { 
            return res.status(404).json({ message: "User not found" });
         }
        if(agentRequest.role === "agent"){
            return res.status(401).json({message: 'You are already an agent'})
        }
        if(agentRequest.agentStatus === 'pending'){
            return res.status(401).json({message: 'Application already sumitted'})
        }
        agentRequest.agentStatus = 'pending'
        await agentRequest.save()
        res.status(201).json({message:'Application submitted wait for admin response'})
        
    } catch (error) {
        res.status(500).json({ message: 'Application failed', error: error.message   });
    }
}

const checkAgentApplication = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("agentStatus role");

    if (!user) {
      return res.status(404).json({message: "User not found",});
    }

    res.status(200).json({agentStatus: user.agentStatus,  role: user.role,});

  } catch (error) {
    res.status(500).json({message:'Failed to check Apllication',error: error.message,});
  }
};





export {
    getProfile,
    deleteProfile,
    updateProfile,
    applyForAgent,
    checkAgentApplication
}