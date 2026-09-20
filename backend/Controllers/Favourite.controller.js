import Favourite from "../Models/Favourite.model.js";

const getMyFavourite = async (req,res) => {
    try {
        const myFavourite = await Favourite.find({user:req.user.id}).populate('property');
        res.status(201).json(myFavourite)
        
    } catch (error) {
        res.status(500).json({ message: 'Failed to get favorites', error: error.message   });
    }
}

const addFavourite = async (req,res) => {
    try {
        const existing = await Favourite.findOne({user:req.user.id, property:req.params.propertyId});
        if(existing){
            return res.status(200).json({message:'Already in favourite'})
        }
        const addFavourite = await Favourite.create({user:req.user.id, property:req.params.propertyId});
            res.status(201).json({message: 'Added to favorite'})
        
    } catch (error) {
        res.status(500).json({ message: 'Failed to add to favourite', error: error.message   });
    }
}

const removeFavourite = async (req , res) => {
   try {
     const deleteFavourite = await Favourite.findOneAndDelete({
        user:req.user.id, 
        property:req.params.propertyId});

    res.status(201).json({message:'Removed from favourites'})
    
   } catch (error) {
    res.status(500).json({ message: 'Failed to remove favourite', error: error.message   });
    
   }

    
}

export{
    getMyFavourite,
    addFavourite,
    removeFavourite
}

/*const createProperty = async (req,res) => {
    try {
        
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message   });
    }
}*/