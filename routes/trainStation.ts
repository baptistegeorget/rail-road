// Imports
import express from "express"
import { TrainStation } from "../models/trainStation"
import { auth } from "../middlewares/auth"

// Déclarations
const router = express.Router()

// Enregistre la gare 
router.post("/", auth, (req, res) => {
    const payload = {
        name: req.body.name,
        open_hour: req.body.openHour,
        close_hour: req.body.closeHour,
        image: req.body.image
    }
    const authUser = req.body._authUser
    if (authUser.role === "Admin") {
        const trainStation = new TrainStation(payload)
        trainStation.save()
            .then(() => {
                res.sendStatus(201)
            })
            .catch((err) => {
                console.log(err)
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