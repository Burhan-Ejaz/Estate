
import mongoose from "mongoose";
import Property from "../Models/Property.model.js";
import User from "../Models/User.model.js";

const createProperty = async (req,res) => {
    try {
        const {
            title,
            description,
            price,
            type,
            purpose,
            city,
            address,
            bedrooms,
            bathrooms,
            areaSize,
        } = req.body;

        const images = (req.files || []).map(
            (file) => `${req.protocol}://${req.get("host")}/uploads/${file.filename}`
        );

        const newProperty = await Property.create({
            title,
            description,
            price: price !== undefined && price !== "" ? Number(price) : undefined,
            type,
            purpose,
            location: { city, address },
            bedrooms: bedrooms !== undefined && bedrooms !== "" ? Number(bedrooms) : undefined,
            bathrooms: bathrooms !== undefined && bathrooms !== "" ? Number(bathrooms) : undefined,
            areaSize: areaSize !== undefined && areaSize !== "" ? Number(areaSize) : undefined,
            images,
            agent: req.user.id,
        });

        res.status(201).json({message: "Property created", property: newProperty})
    } catch (error) {
        res.status(500).json({ message: 'Failed to create a property', error: error.message });
    }
}

const getMyProperty = async (req,res) => {
    try {
        const myProperty = await Property.find({agent: req.user.id})
        res.status(201).json(myProperty)
        
    } catch (error) {
        res.status(500).json({ message: 'Failed to get property', error: error.message });
    }
}


const deleteMyProperty = async (req,res) => {
    try {
        const myProperty = await Property.findById(req.params.id)
        if(!myProperty){
            return res.status(404).json({message: "Property not Found"})
        }
        if(myProperty.agent.toString() !== req.user.id){
           return res.status(404).json({message: "Not your Property"})
        }
        await Property.findByIdAndDelete(req.params.id);
        res.status(201).json({message: "Property Deleted"})
        
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete the Property', error: error.message  });
    }
}

const updateMyProperty = async (req,res) => {
    try {
        const myProperty = await Property.findById(req.params.id);
        if(!myProperty){
            return res.status(404).json({message: "Property not Found"})
        }
        if(myProperty.agent.toString() !== req.user.id){
           return res.status(404).json({message: "Not your Property"})
        }
        const allowedFields = ["title", "description", "price", "type", "purpose", "location", "bedrooms", "bathrooms", "areaSize"];
        const updates = {};
        for (const field of allowedFields) {
            if (req.body[field] !== undefined) updates[field] = req.body[field];
        }

        await Property.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true });
        res.status(201).json({message: "Property Updated"})
        
    } catch (error) {
        res.status(500).json({ message: 'Failed to update the Property', error: error.message  });
    }
}

const getAllProperties = async (req , res)=> {
   try {
     const {
        type,
        purpose,
        city,
        minPrice,
        maxPrice,
        bedrooms,
        bathrooms,
        minArea,
        maxArea,
        status,
        search,
        limit,
     } = req.query;

     const filter = { status: status || "available" };

     if (type) filter.type = type;
     if (purpose) filter.purpose = purpose;
     if (city) filter["location.city"] = { $regex: city, $options: "i" };
     if (bedrooms) filter.bedrooms = { $gte: Number(bedrooms) };
     if (bathrooms) filter.bathrooms = { $gte: Number(bathrooms) };

     if (minPrice || maxPrice) {
        filter.price = {};
        if (minPrice) filter.price.$gte = Number(minPrice);
        if (maxPrice) filter.price.$lte = Number(maxPrice);
     }

     if (minArea || maxArea) {
        filter.areaSize = {};
        if (minArea) filter.areaSize.$gte = Number(minArea);
        if (maxArea) filter.areaSize.$lte = Number(maxArea);
     }

     if (search) {
        filter.title = { $regex: search, $options: "i" };
     }

     let query = Property.find(filter).populate("agent", "name email").sort({ createdAt: -1 });

     if (limit) query = query.limit(Number(limit));

     const allProperties = await query;
     res.status(200).json(allProperties)

   } catch (error) {
    res.status(500).json({ message: 'Failed to get properties', error: error.message  });

   }
}

const getPropertyById = async (req, res) => {
    try {
        const property = await Property.findById(req.params.id).populate("agent", "name email");
        if (!property) {
            return res.status(404).json({ message: "Property not Found" });
        }
        res.status(200).json(property)

    } catch (error) {
        res.status(500).json({ message: 'Failed to get property', error: error.message  });
    }
}

const getAgentProperties = async (req, res) => {
    try {
        const { agentId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(agentId)) {
            return res.status(404).json({ message: "Agent not Found" });
        }

        const agent = await User.findOne({ _id: agentId, role: "agent" }).select("name email");
        if (!agent) {
            return res.status(404).json({ message: "Agent not Found" });
        }

        const properties = await Property.find({ agent: agentId }).sort({ createdAt: -1 });
        res.status(200).json({ agent, properties })

    } catch (error) {
        res.status(500).json({ message: 'Failed to get agent properties', error: error.message  });
    }
}

const markPropertySold = async (req, res) => {
  try {
    const property = await Property.findById(req.params.propertyId);

    if (!property) {
      return res.status(404).json({
        message: "Property not found",
      });
    }

    // Make sure the logged-in agent owns this property
    if (property.agent.toString() !== req.user.id) {
      return res.status(403).json({
        message: "You are not authorized to update this property",
      });
    }

    // Prevent marking an already sold property as sold again
    if (property.status === "sold") {
      return res.status(400).json({
        message: "Property is already sold",
      });
    }

    property.status = "sold";
    await property.save();

    res.status(200).json({
      message: "Property marked as sold",
      property,
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to update property",
      error: error.message,
    });
  }
};













export {
    createProperty,
    getMyProperty,
    deleteMyProperty,
    updateMyProperty,
    getAllProperties,
    getPropertyById,
    getAgentProperties,
    markPropertySold
}