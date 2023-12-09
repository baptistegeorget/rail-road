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
    open_hour: {
        type: Schema.Types.String,
        required: true
    },
    close_hour: {
        type: Schema.Types.String,
        required: true
    },
    image: {
        type: Schema.Types.String
    }
})

// Exports
export const TrainStation = model("TrainStation", schema)