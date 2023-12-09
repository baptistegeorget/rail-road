// Imports
import mongoose from "mongoose"
import express from "express"
import userRouter from "./routes/user"
import trainStationRouter from "./routes/trainStation"
import { User } from "./models/user"
import crypto from "crypto"
import "dotenv/config"

// Déclarations
const server = express()
const serverPort = process.env.SERVER_PORT || "8000"
const mongodbHost = process.env.MONGODB_HOST || "localhost"
const mongodbPort = process.env.MONGODB_PORT || "27017"
const mongodbDatabase = process.env.MONGODB_DATABASE || "database"
const adminEmail = process.env.ADMIN_EMAIL || "admin@admin.com"
const adminPseudo = process.env.ADMIN_PSEUDO || "admin"
const adminPassword = process.env.ADMIN_PASSWORD || "password"

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

// Configuration du serveur
server.use(express.json())
server.use("/user", userRouter)
server.use("/trainstation", trainStationRouter)

// Lancement du serveur
server.listen(serverPort, () => console.log(`[RAIL-ROAD]:    Serveur lancé sur le port ${serverPort}`))