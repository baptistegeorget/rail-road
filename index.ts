// Imports
import express from "express"

// Déclarations
const app = express()
const port = 3000

// Middlewares
app.use(express.json())

// Routes
app.get("/", (req, res) => {
    res.send("Hello world !")
})

// Lancement du serveur
app.listen(port, () => {
    console.log(`[SERVEUR] Serveur lancé sur le port ${port}`)
})