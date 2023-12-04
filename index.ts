import mongoose from "mongoose"
import express from "express"
import config from "./tsconfig.json"
import userRouter from "./routes/user"

const server = express()
const port = 8000

mongoose.connect(config.mongoURL)
    .then(() => console.log("Connecté à la base de données"))
    .catch((err) => console.log(err))

server.use(express.json())
server.use("/", userRouter)

server.listen(port, () => console.log(`Serveur lancé sur le port ${port}`))