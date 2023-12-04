import { Schema, model } from "mongoose"

const schema = new Schema({
    email: {
        type: Schema.Types.String,
        required: true,
        unique: true,
        maxLength: 50
    },
    pseudo: {
        type: Schema.Types.String,
        required: true,
        unique: true,
        maxLength: 50
    },
    password: {
        type: Schema.Types.String,
        required: true,
        maxLength: 256
    },
    role: {
        type: Schema.Types.String,
        required: true,
        enum: ['User', 'Employee', 'Admin'],
        default: 'User'
    }
})

export const User = model("User", schema)