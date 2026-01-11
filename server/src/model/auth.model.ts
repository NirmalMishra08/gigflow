import mongoose, { model, Schema } from "mongoose"

const userSchema = new Schema({
    name: { type: String },
    email: { type: String, unique: true, require: true },
    password: { type: String }
})

const user = model("User", userSchema)

export default user;