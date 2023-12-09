import "dotenv/config"
import { Request, Response } from "express"
import Cookies from "cookies"
import crypto from "crypto"
import { User, userValidationSchema } from "../models/user"
import jwt from "jsonwebtoken"

const secretKey = process.env.JWT_SECRET_KEY || "secret"
const cookieName = process.env.JWT_COOKIE_NAME || "token"

// Cherche l'utilisateur, si il est trouvé alors un token est créé, sinon l'utilisateur et un token sont créés.
async function create(req: Request, res: Response) {
    const { email, pseudo, password } = req.body
    const userFind = await User.findOne({ email })
    if (userFind) {
        const token = jwt.sign({ id: userFind._id }, secretKey, { expiresIn: "7d" })
        new Cookies(req, res).set(cookieName, token, { httpOnly: true, secure: false })
        res.sendStatus(201)
    } else {
        let error = userValidationSchema.validate({ email, pseudo, password, role: "User" }).error
        if (error) {
            res.status(401).send(error)
        } else {
            const userNew = new User({ email, pseudo, password: crypto.createHash("sha256").update(password).digest("hex"), role: "User" })
            await userNew.save()
                .then(() => {
                    const token = jwt.sign({ id: userNew._id }, secretKey, { expiresIn: "7d" })
                    new Cookies(req, res).set(cookieName, token, { httpOnly: true, secure: false })
                    res.sendStatus(201)
                })
                .catch((err) => {
                    console.log(err)
                    res.status(500).send(err)
                })
        }
    }
}

async function read(req: Request, res: Response) {
    const payload = {
        email: req.body.email
    }
    const authUser = req.body._authUser
    if (authUser.role === ("Admin" || "Employee") || payload.email === authUser.email) {
        const user = await User.findOne({ email: payload.email })
        if (!user) {
            res.sendStatus(404)
        } else {
            res.status(200).send({ email: user.email, pseudo: user.pseudo, role: user.role })
        }
    } else {
        res.sendStatus(401)
    }
}

async function update(req: Request, res: Response) {
    const payload = {
        email: req.body.email,
        newEmail: req.body.newEmail,
        pseudo: req.body.pseudo,
        password: crypto.createHash("sha256").update(req.body.password).digest("hex"),
        role: req.body.role
    }
    const authUser = req.body._authUser
    if (authUser.role === "Admin" || authUser.email === payload.email) {
        const user = await User.findOneAndUpdate({ email: payload.email }, {
            email: payload.newEmail,
            pseudo: payload.pseudo,
            password: payload.password,
            ...(authUser.role === "Admin" ? { role: payload.role } : {})
        }, { new: true })
        if (user) {
            if (authUser.email === payload.email) {
                const token = jwt.sign({ email: user.email, pseudo: user.pseudo, role: user.role }, secretKey, { expiresIn: "1h" })
                new Cookies(req, res).set(cookieName, token, { httpOnly: true, secure: false })
            }
            res.sendStatus(201)
        } else {
            res.sendStatus(404)
        }
    } else {
        res.sendStatus(401)
    }
}

async function remove(req: Request, res: Response) {
    const payload = {
        email: req.body.email
    }
    const authUser = req.body._authUser
    if (payload.email === authUser.email) {
        const user = await User.findOneAndDelete({ email: payload.email })
        if (user) {
            new Cookies(req, res).set(cookieName, null)
            res.sendStatus(200)
        } else {
            res.sendStatus(404)
        }
    } else {
        res.sendStatus(401)
    }
}

export { create, read, update, remove }