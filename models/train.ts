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
    start_station: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "TrainStation"
    },
    end_station: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "TrainStation"
    },
    time_of_departure: {
        type: Schema.Types.String,
        required: true,
    }
})

// Exports
export const Train = model("Train", schema)