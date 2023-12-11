import { Schema, model } from "mongoose"
import Joi from "joi"

const Train = model("Train", new Schema({
    name: Schema.Types.String,
    startStation: Schema.Types.ObjectId,
    endStation: Schema.Types.ObjectId,
    timeOfDeparture: Schema.Types.String
}))

const trainValidationSchema = Joi.object({
    name: Joi.string().min(1).max(50).required(),
    startStation: Joi.string(),
    endStation: Joi.string(),
    timeOfDeparture: Joi.string().pattern(new RegExp("^([01]?[0-9]|2[0-3]):[0-5][0-9]$")).required()
})

export { Train, trainValidationSchema }