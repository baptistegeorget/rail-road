// Imports
import express from "express"
import { TrainStation } from "../models/trainStation"
import { authentication } from "../middlewares/authentication"

// Déclarations
const router = express.Router()

// Enregistre la gare 
router.post("/", authentication, (req, res) => {
    const { name, openHour, closeHour, image, _authUser } = req.body
    if (_authUser.role === "Admin") {
        const trainStation = new TrainStation({ name, openHour, closeHour, image })
        trainStation.save()
            .then(() => {
                res.sendStatus(201)
            })
            .catch(() => {
                res.sendStatus(500)
            })
    } else {
        res.sendStatus(401)
    }
})

// Récupère les données de la gare
router.get("/", (req, res) => {

})

export default router;