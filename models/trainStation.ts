import { Schema, model } from "mongoose"
import { Train } from "./train"
import Joi from "joi"

const schema = new Schema({
    name: Schema.Types.String,
    openHour: Schema.Types.String,
    closeHour: Schema.Types.String,
    image: Schema.Types.String
})

schema.pre("findOneAndDelete", async function (next) {
    await Train.deleteMany({startStation: this.get("_id")}) // ne fonctionne pas
    next()
})

schema.pre("findOneAndDelete", async function (next) {
    await Train.deleteMany({endStation: this.get("_id")}) // ne fonctionne pas
    next()
})

const TrainStation = model("TrainStation", schema)

const trainStationValidationSchema = Joi.object({
    name: Joi.string().min(1).max(50).required(),
    openHour: Joi.string().pattern(new RegExp("^([01]?[0-9]|2[0-3]):[0-5][0-9]$")).required(),
    closeHour: Joi.string().pattern(new RegExp("^([01]?[0-9]|2[0-3]):[0-5][0-9]$")).required()
})

export { TrainStation, trainStationValidationSchema }