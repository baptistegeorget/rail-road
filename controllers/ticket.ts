import { Request, Response } from "express"
import { TrainStation } from "../models/trainStation"
import { Train } from "../models/train"

// Renvoi un billet de train
async function read(req: Request, res: Response) {
    const { startStation, endStation, timeOfDeparture } = req.body
    const startStationFind = await TrainStation.findOne({ name: startStation })
    const endStationFind = await TrainStation.findOne({ name: endStation })
    if (startStationFind && endStationFind) {
        const trainFind = await Train.findOne({ startStation: startStationFind._id, endStation: endStationFind._id, timeOfDeparture })
        if (trainFind) {
            res.status(200).send({ trainName: trainFind.name, startStation: startStationFind.name, endStation: endStationFind.name, timeOfDeparture: trainFind.timeOfDeparture })
        } else {
            res.status(404).send("Aucun train trouvé")
        }
    } else {
        res.status(404).send("Une ou plusieurs gare n'existe pas")
    }
}

export { read }