// Imports
import { Schema, model } from "mongoose"

// Déclarations
const schema = new Schema({
    name: {
        type: Schema.Types.String,
        required: true,
        unique: true,
        maxLength: 50
    },
    startStation: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "TrainStation"
    },
    endStation: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "TrainStation"
    },
    timeOfDeparture: {
        type: Schema.Types.String,
        required: true,
    }
})

// Exports
export const Train = model("Train", schema)