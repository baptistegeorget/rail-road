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

async function read(req: Request, res: Response) {
    const {  } = req.body
}

export { create, read }