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
    openHour: {
        type: Schema.Types.String,
        required: true
    },
    closeHour: {
        type: Schema.Types.String,
        required: true
    },
    image: {
        type: Schema.Types.String
    }
})

// Exports
export const TrainStation = model("TrainStation", schema)