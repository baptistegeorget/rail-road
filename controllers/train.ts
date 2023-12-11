import { Request, Response } from "express"
import { Train, trainValidationSchema } from "../models/train"
import { TrainStation } from "../models/trainStation"

// Si l'utilisateur est Admin, alors un train est créé.
async function create(req: Request, res: Response) {
    const { name, startStation, endStation, timeOfDeparture, user } = req.body
    if (user.role === "Admin") {
        const error = trainValidationSchema.validate({ name, startStation, endStation, timeOfDeparture }).error
        if (error) {
            res.status(401).send(error)
        } else {
            const trainFind = await Train.findOne({ name })
            if (trainFind) {
                res.status(401).send("Un train avec le même nom existe déjà")
            } else {
                const startStationFind = await TrainStation.findOne({ name: startStation })
                const endStationFind = await TrainStation.findOne({ name: endStation })
                if (startStationFind && endStationFind) {
                    const trainNew = new Train({ name, startStation: startStationFind._id, endStation: endStationFind._id, timeOfDeparture })
                    await trainNew.save()
                        .then(() => {
                            res.status(201).send("Train créé")
                        })
                        .catch((err) => {
                            res.status(500).send(err)
                        })
                } else {
                    res.status(404).send("Une ou plusieurs gares n'existe pas")
                }
            }
        }
    } else {
        res.status(401).send("Vous n'avez pas les droits nécessaires")
    }
}

// Renvoi 10 trains par défaut sinon renvoi un nombre égal à limit. Les trains seront filtrés si il y a des filtres.
async function read(req: Request, res: Response) {
    const { sortBy, order, limit } = req.body
    const keys = ["timeOfDeparture", "startStation", "endStation"]
    const sortConfig: { [key: string]: "asc" | "desc" } = {}
    if (keys.includes(sortBy) && (order === "asc" || order === "desc")) {
        sortConfig[sortBy] = order
    }
    const trains = await Train.find().sort(sortConfig).limit(limit && typeof limit === "number" ? limit : 10)
    if (trains.length > 0) {
        res.status(200).send(trains)
    } else {
        res.status(404).send("Aucun train trouvé")
    }
}

// Si l'utilisateur est Admin, modifie le train.
async function update(req: Request, res: Response) {
    const { name, startStation, endStation, timeOfDeparture, newName, user } = req.body
    if (user.role === "Admin") {
        const error = trainValidationSchema.validate({ name: newName, startStation, endStation, timeOfDeparture }).error
        if (error) {
            res.status(401).send(error)
        } else {
            const trainExist = name !== newName ? await Train.findOne({ name: newName }) : null
            if (trainExist) {
                res.status(401).send("Un train avec le même nom existe déjà")
            } else {
                const startStationFind = await TrainStation.findOne({ name: startStation })
                const endStationFind = await TrainStation.findOne({ name: endStation })
                if (startStationFind && endStationFind) {
                    const trainUpdate = await Train.findOneAndUpdate({ name }, { name: newName, startStation: startStationFind._id, endStation: endStationFind._id, timeOfDeparture })
                    if (trainUpdate) {
                        res.status(200).send("Train modifié")
                    } else {
                        res.status(404).send("Le train n'existe pas")
                    }
                } else {
                    res.status(404).send("Une ou plusieurs gares n'existe pas")
                }
            }
        }
    } else {
        res.status(401).send("Vous n'avez pas les droits nécessaires")
    }
}

// Si l'utilisateur est Admin, cherche et supprime le train.
async function remove(req: Request, res: Response) {
    const { name, user } = req.body
    if (user.role === "Admin") {
        const trainFind = await Train.findOneAndDelete({ name })
        if (trainFind) {
            res.status(200).send("Train supprimé")
        } else {
            res.status(404).send("Le train n'existe pas")
        }
    } else {
        res.status(401).send("Vous n'avez pas les droits nécessaires")
    }
}

export { create, read, update, remove }