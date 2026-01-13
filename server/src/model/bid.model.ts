import mongoose, { Model, model, Schema } from "mongoose";


const bidSchema = new Schema({
    gigId: { type: mongoose.Schema.Types.ObjectId, ref: 'Gig', required: true },
    freeLancerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    message: { type: String },
    price: { type: Number },
    status: { type: String, enum: ["pending", "hired", "rejected"] },

}
    , {
        timestamps: true
    })

const Bid = model('Bid', bidSchema)

export default Bid;