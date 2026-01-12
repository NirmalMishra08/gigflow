import mongoose, { Model, model } from "mongoose";


const bidSchema = new Model({
    gigId: { type: mongoose.Schema.Types.ObjectId, ref: 'Gig', required: true },
    freeLancerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    message: { type: String },
    price: { type: Number },
    status: { type: String, enum: ["pending", "hired", "rejected"] },

}
    , {
        timeStamps: true
    })

const Bid = model('Bid', bidSchema)

export default Bid;