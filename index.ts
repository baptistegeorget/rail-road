import mongoose from "mongoose"
import express from "express"
import userRouter from "./routes/user"
import trainStationRouter from "./routes/trainStation"
import trainRouter from "./routes/train"
import ticketRouter from "./routes/ticket"
import { User } from "./models/user"
import crypto from "crypto"
import "dotenv/config"
import swaggerJsdoc from "swagger-jsdoc"
import swaggerUi from "swagger-ui-express"

export const server = express()
export const workingDirectory = __dirname
const serverPort = process.env.SERVER_PORT || "8000"
const serverHost = process.env.SERVER_HOST || "localhost"
const mongodbHost = process.env.MONGODB_HOST || "localhost"
const mongodbPort = process.env.MONGODB_PORT || "27017"
const mongodbDatabase = process.env.MONGODB_DATABASE || "database"
const adminEmail = process.env.ADMIN_EMAIL || "admin@admin.com"
const adminPseudo = process.env.ADMIN_PSEUDO || "admin"
const adminPassword = process.env.ADMIN_PASSWORD || "password"
const swaggerOptions: swaggerJsdoc.Options = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: "Rail Road API",
            version: "1.0.0",
            description: "",
            contact: {
                name: "Baptiste GEORGET et Scott CIROT"
            },
            servers: [`http://${serverHost}:${serverPort}`]
        }
    },
    apis: ["routes/*.ts"]
}
const swaggerDocs = swaggerJsdoc(swaggerOptions)

// Connecte la base de données et créer l'utilisateur admin si il n'existe pas
mongoose.connect(`mongodb://${mongodbHost}:${mongodbPort}/${mongodbDatabase}`)
    .then(async () => {
        console.log("[RAIL-ROAD]:    Connecté à la base de données")
        const admin = await User.findOne({ email: adminEmail, pseudo: adminPseudo })
        if (admin) {
            console.log("[RAIL-ROAD]:    Admin trouvé")
        } else {
            await new User({ email: adminEmail, pseudo: adminPseudo, password: crypto.createHash("sha256").update(adminPassword).digest("hex"), role: "Admin" }).save()
                .then(() => {
                    console.log("[RAIL-ROAD]:    Admin créé")
                })
                .catch((err) => {
                    console.log(err)
                })
        }
    })
    .catch((err) => console.log(err))

server.use(express.static("public"))
server.use(express.json())
server.use("/user", userRouter)
server.use("/trainstation", trainStationRouter)
server.use("/train", trainRouter)
server.use("/ticket", ticketRouter)
server.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs))

server.listen(serverPort, () => console.log(`[RAIL-ROAD]:    Serveur lancé sur le port ${serverPort}`))