import mongoose, { model, Model } from "mongoose";
import { timeStamp } from "node:console";



const jobSchema = new Model({
    title: { type: String, require: true },
    description: { type: String, require: true },
    budget: { type: Number, require: true },
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    status: { type: String, enum: ['open', 'assigned'], default: 'open', message: '{VALUE} is not a valid status' },

},
    { timeStamp: true }
)

const jobs = model("Jobs", jobSchema);

export default jobs;