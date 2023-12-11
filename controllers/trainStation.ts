import { Request, Response } from "express"
import { TrainStation, trainStationValidationSchema } from "../models/trainStation"
import path from "path"
import sharp from "sharp"
import fs from "fs"
import { workingDirectory } from ".."

// Si l'utilisateur est un Admin, créer une gare si elle n'existe pas déjà.
async function create(req: Request, res: Response) {
    const { name, openHour, closeHour, user } = req.body
    const { file } = req
    if (user.role === "Admin") {
        const error = trainStationValidationSchema.validate({ name, openHour, closeHour }).error
        if (error) {
            res.status(401).send(error)
        } else {
            const trainStationFind = await TrainStation.findOne({ name })
            if (trainStationFind) {
                res.status(401).send("Une gare avec le même nom existe déjà")
            } else {
                const fileName = await resizeAndSaveRequestImage(req, name)
                const trainStationNew = new TrainStation({ name, openHour, closeHour, image: fileName ? `${req.protocol}://${req.get('host')}/uploads/${fileName}` : null })
                await trainStationNew.save()
                    .then(() => {
                        res.status(201).send("Gare créée")
                    })
                    .catch((err) => {
                        if (fileName) {
                            removeImage(fileName)
                        }
                        res.status(500).send(err)
                    })
            }
        }
    } else {
        res.status(401).send("Vous n'avez pas les droits nécessaires")
    }
}

// Renvoi toutes les gares. Les gares seront filtrés si il y a des filtres.
async function read(req: Request, res: Response) {
    const { sortBy, order } = req.body
    const keys = ["name"]
    const sortConfig: { [key: string]: "asc" | "desc" } = {}
    if (keys.includes(sortBy) && (order === "asc" || order === "desc")) {
        sortConfig[sortBy] = order
    }
    const trainStations = await TrainStation.find().sort(sortConfig)
    if (trainStations.length > 0) {
        res.status(200).send(trainStations)
    } else {
        res.status(404).send("Aucune gare trouvée")
    }
}

// Si l'utilisateur est un Admin, modifie la gare.
async function update(req: Request, res: Response) {
    const { name, openHour, closeHour, newName, user } = req.body
    if (user.role === "Admin") {
        const error = trainStationValidationSchema.validate({ name: newName, openHour, closeHour }).error
        if (error) {
            res.status(401).send(error)
        } else {
            const trainStationExist = name !== newName ? await TrainStation.findOne({ name: newName }) : null
            if (trainStationExist) {
                res.status(401).send("Le nouveau nom est déjà utilisé")
            } else {
                const fileName = await resizeAndSaveRequestImage(req, newName)
                const trainStationUpdate = await TrainStation.findOneAndUpdate({ name }, { name: newName, openHour, closeHour, image: fileName ? `${req.protocol}://${req.get('host')}/uploads/${fileName}` : null })
                if (trainStationUpdate) {
                    if (trainStationUpdate.image) {
                        removeImage(trainStationUpdate.image.split("/")[trainStationUpdate.image.split("/").length - 1])
                    }
                    res.status(200).send("Gare modifiée")
                } else {
                    if (fileName) {
                        removeImage(fileName)
                    }
                    res.status(500).send("La gare n'existe pas.")
                }
            }
        }
    } else {
        res.status(401).send("Vous n'avez pas les droits nécessaires")
    }
}

// Si l'utilisateur est Admin, cherche et supprime la gare.
async function remove(req: Request, res: Response) {
    const { name, user } = req.body
    if (user.role === "Admin") {
        const trainStationFind = await TrainStation.findOneAndDelete({ name })
        if (trainStationFind) {
            res.status(200).send("Gare supprimée")
        } else {
            res.status(404).send("La gare n'existe pas")
        }
    } else {
        res.status(401).send("Vous n'avez pas les droits nécessaires")
    }
}

// Redimensionne l'image contenue dans la requête, l'enregistre et retourne le nom du fichier. Renvoi null si aucune image est trouvée.
async function resizeAndSaveRequestImage(req: Request, name: string) {
    const { file } = req
    if (file) {
        const fileName = name + "." + file.mimetype.split("/")[1]
        const uploadPath = path.join(workingDirectory, "public", "uploads", fileName)
        await sharp(file.buffer).resize({ width: 200, height: 200, fit: 'inside' }).toFile(uploadPath)
        return fileName
    } else {
        return null
    }
}

// Supprime une image dans le dossier uploads.
function removeImage(fileName: string) {
    const uploadPath = path.join(workingDirectory, "public", "uploads", fileName)
    fs.unlinkSync(uploadPath)
}

export { create, read, update, remove }