import mongoose from "mongoose";

const propertySchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: String,
    price: { type: Number, required: true },

    type: { type: String, enum: ['house', 'apartment', 'plot', 'commercial'], required: true },
    purpose: { type: String, enum: ['sale', 'rent'], required: true },

    location: {
      city: String,
      address: String,
    },

    bedrooms: Number,
    bathrooms: Number,
    areaSize: Number,
    images: [String],

    agent: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status: { type: String, enum: ['available', 'sold', 'rented'], default: 'available' },
  },
  { timestamps: true }
);

const Property = mongoose.model('Property', propertySchema);
export default Property;