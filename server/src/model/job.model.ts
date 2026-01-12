import mongoose, { model, Model } from "mongoose";
import { timeStamp } from "node:console";



const jobSchema = new Model({
    title: { type: String, required: true },
    description: { type: String, required: true },
    budget: { type: Number, required: true },
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    status: { type: String, enum: ['open', 'assigned'], default: 'open', message: '{VALUE} is not a valid status' },

},
    { timeStamps: true }
)

const Gig = model("Gig", jobSchema);

export default Gig;

