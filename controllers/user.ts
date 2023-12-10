import "dotenv/config"
import { Request, Response } from "express"
import Cookies from "cookies"
import crypto from "crypto"
import { User, userValidationSchema } from "../models/user"
import jwt from "jsonwebtoken"

const secretKey = process.env.JWT_SECRET_KEY || "secret"
const cookieName = process.env.JWT_COOKIE_NAME || "token"

// Cherche l'utilisateur. Si il est trouvé et que le mot de passe est bon alors un token est créé. Si l'utilisateur n'existe pas alors lui et un token sont créés.
async function create(req: Request, res: Response) {
    const { email, pseudo, password } = req.body
    const userFind = await User.findOne({ email })
    if (userFind) {
        if (crypto.createHash("sha256").update(password).digest("hex") === userFind.password) {
            const token = jwt.sign(userFind.toJSON(), secretKey, { expiresIn: "7d" })
            new Cookies(req, res).set(cookieName, token, { httpOnly: true, secure: false })
            res.status(201).send("Connexion réussie")
        } else {
            res.status(401).send("Mot de passe incorrect")
        }
    } else {
        const error = userValidationSchema.validate({ email, pseudo, password, role: "User" }).error
        if (error) {
            res.status(401).send(error)
        } else {
            const userNew = new User({ email, pseudo, password: crypto.createHash("sha256").update(password).digest("hex"), role: "User" })
            await userNew.save()
                .then(() => {
                    const token = jwt.sign(userNew.toJSON(), secretKey, { expiresIn: "7d" })
                    new Cookies(req, res).set(cookieName, token, { httpOnly: true, secure: false })
                    res.status(201).send("Utilisateur créé")
                })
                .catch((err) => {
                    res.status(500).send(err)
                })
        }
    }
}

// Envoi ses données à l'utilisateur. Si c'est un Admin ou un Employee, cherche l'utilisateur. Si il est trouvé, alors les données de l'utilisateur sont envoyées.
async function read(req: Request, res: Response) {
    const { email, user } = req.body
    if (email === user.email) {
        res.status(200).send(user)
    } else {
        if (user.role === ("Admin" || "Employee")) {
            const userFind = await User.findOne({ email })
            if (userFind) {
                res.status(200).send(userFind)
            } else {
                res.status(404).send("L'utilisateur n'existe pas")
            }
        } else {
            res.status(401).send("Vous n'avez pas les droits nécessaires pour accéder à ces données")
        }
    }
}

// Modifie l'utilisateur et lui recréer un token. Si c'est un Admin, cherche l'utilisateur. Si il est trouvé, alors ses données sont modifiées. Seul l'Admin peut modifier le role.
async function update(req: Request, res: Response) {
    const { email, pseudo, password, role, newEmail, user } = req.body
    if (user.role === "Admin" || user.email === email) {
        const error = userValidationSchema.validate({ email: newEmail, pseudo, password, ...(user.role === "Admin" ? { role } : { role: user.role }) }).error
        if (error) {
            res.status(401).send(error)
        } else {
            let userExist = null
            if (email !== newEmail) {
                userExist = await User.findOne({ email: newEmail })
            }
            if (userExist) {
                res.status(401).send("Le nouvel email est déjà utilisé")
            } else {
                const userUpdate = await User.findOneAndUpdate({ email }, { email: newEmail, pseudo: pseudo, password: crypto.createHash("sha256").update(password).digest("hex"), ...(user.role === "Admin" ? { role } : { role: user.role }) }, { new: true })
                if (userUpdate) {
                    if (user.email === email) {
                        const token = jwt.sign(userUpdate.toJSON(), secretKey, { expiresIn: "7d" })
                        new Cookies(req, res).set(cookieName, token, { httpOnly: true, secure: false })
                    }
                    res.status(200).send("Utilisateur modifié")
                } else {
                    res.status(404).send("L'utilisateur n'existe pas")
                }
            }
        }
    } else {
        res.status(401).send("Vous n'avez pas les droits nécessaires pour modifier ces données")
    }
}

// Supprime l'utilisateur et son token.
async function remove(req: Request, res: Response) {
    const { email, user } = req.body
    if (email === user.email) {
        const userFind = await User.findOneAndDelete({ email })
        if (userFind) {
            new Cookies(req, res).set(cookieName, null)
            res.status(200).send("Utilisateur supprimé")
        } else {
            res.status(404).send("L'utilisateur n'existe pas")
        }
    } else {
        res.status(401).send("Vous n'avez pas les droits nécessaires pour supprimer ces données")
    }
}

export { create, read, update, remove }