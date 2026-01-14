import mongoose, { Schema, model } from "mongoose";

const jobSchema = new Schema(
    {
        title: { type: String, required: true },
        description: { type: String, required: true },
        budget: { type: Number, required: true },
        ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        freeLancerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        status: {
            type: String,
            enum: ['open', 'assigned'],
            default: 'open'
        },
    },
    {
        timestamps: true
    }
);

// 3. Create the Model from the Schema
const Gig = model("Gig", jobSchema);

export default Gig;