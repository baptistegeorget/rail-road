import { Schema, model } from "mongoose"
import Joi from "joi"

const User = model("User", new Schema({
    email: Schema.Types.String,
    pseudo: Schema.Types.String,
    password: Schema.Types.String,
    role: Schema.Types.String
}))

const userValidationSchema = Joi.object({
    email: Joi.string().email().max(50).required(),
    pseudo: Joi.string().min(1).max(50).required(),
    password: Joi.string().min(8).max(50).required(),
    role: Joi.string().valid("Admin", "Employee", "User").required()
});

export { User, userValidationSchema }