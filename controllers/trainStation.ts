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
                let uploadPath = file ? path.join(workingDirectory, "public", "uploads", name + "." + file.originalname) : null
                if (uploadPath && file) {
                    const resizedBuffer = await sharp(file.buffer).resize({ width: 200, height: 200, fit: 'inside' }).toBuffer()
                    await sharp(resizedBuffer).toFile(uploadPath)
                }
                const trainStationNew = new TrainStation({ name, openHour, closeHour, image: file ? `${req.protocol}://${req.get('host')}/uploads/${name + "." + file.originalname}` : null })
                await trainStationNew.save()
                    .then(() => {
                        res.status(201).send("Gare créée")
                    })
                    .catch((err) => {
                        if (uploadPath) {
                            fs.unlink(uploadPath, () => { })
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
    if (trainStations) {
        res.status(200).send(trainStations)
    } else {
        res.status(404).send("Aucune gare trouvée")
    }
}

async function update(req: Request, res: Response) {
    console.log(await resizeAndSaveImage(req, "test"))
    const { name, openHour, closeHour, newName, user } = req.body
    const { file } = req
    if (user.role === "Admin") {
        const error = trainStationValidationSchema.validate({ name: newName, openHour, closeHour }).error
        if (error) {
            res.status(401).send(error)
        } else {
            let trainStationExist = null
            if (name !== newName) {
                trainStationExist = await TrainStation.findOne({ name: newName })
            }
            if (trainStationExist) {
                res.status(401).send("Une gare avec le même nom existe déjà")
            } else {
                let uploadPath = file ? path.join(workingDirectory, "public", "uploads", newName + "." + file.originalname) : null
                if (uploadPath && file) {
                    const resizedBuffer = await sharp(file.buffer).resize({ width: 200, height: 200, fit: 'inside' }).toBuffer()
                    await sharp(resizedBuffer).toFile(uploadPath)
                } else {
                    
                }
                const trainStationUpdate = await TrainStation.findOneAndUpdate({ name }, { name: newName, openHour, closeHour, image: file ? `${req.protocol}://${req.get('host')}/uploads/${newName + "." + file.originalname}` : null })
            }
        }
    } else {
        res.status(401).send("Vous n'avez pas les droits nécessaires")
    }
}

async function remove(req: Request, res: Response) {

}

// Redimensionne une image, l'enregistre et retourne le nom du fichier
async function resizeAndSaveImage(req: Request, name: string) {
    const { file } = req
    if (file) {
        const fileName = name + "." + file.mimetype.split("/")[1]
        const uploadPath = path.join(workingDirectory, "public", "uploads", fileName)
        const resizedBuffer = await sharp(file.buffer).resize({ width: 200, height: 200, fit: 'inside' }).toBuffer()
        await sharp(resizedBuffer).toFile(uploadPath)
        return fileName
    } else {
        return null
    }
}

export { create, read, update, remove }