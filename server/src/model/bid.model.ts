import mongoose, { Model, model } from "mongoose";


const bidSchema = new Model({
    gigId: { type: mongoose.Schema.Types.ObjectId, ref: 'Jobs' },
    freeLancerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    message: { type: String },
    price: { type: Number },
    status: { type: String, enum: ["pending", "hired", "rejected"] },

}
    , {
        timeStamp: true
    })

const Bid = model('Bid', bidSchema)

export default Bid;