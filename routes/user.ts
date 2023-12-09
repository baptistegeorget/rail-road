// Imports
import express from "express"
import { User } from "../models/user"
import jwt from "jsonwebtoken"
import crypto from "crypto"
import Cookies from "cookies"
import { auth } from "../middlewares/auth"
import "dotenv/config"

// Déclarations
const router = express.Router()
const secretKey = process.env.JWT_SECRET_KEY || "secretKey"
const cookieName = process.env.JWT_COOKIE_NAME || "authToken"

// Enregistre l'utilisateur et lui génère un token d'authentification valable 1h
router.post("/signup", async (req, res) => {
    const payload = {
        email: req.body.email,
        pseudo: req.body.pseudo,
        password: crypto.createHash("sha256").update(req.body.password).digest("hex")
    }
    const user = new User(payload)
    await user.save()
        .then(() => {
            const token = jwt.sign({ email: user.email, pseudo: user.pseudo, role: user.role }, secretKey, { expiresIn: "1h" })
            new Cookies(req, res).set(cookieName, token, { httpOnly: true, secure: false })
            res.sendStatus(201)
        })
        .catch(() => {
            res.sendStatus(500)
        })
})

// Génère un token d'authentification valable 1h pour l'utilisateur
router.post("/signin", async (req, res) => {
    const payload = {
        email: req.body.email,
        password: crypto.createHash("sha256").update(req.body.password).digest("hex")
    }
    const user = await User.findOne({ email: payload.email })
    if (!user) {
        res.sendStatus(404)
    } else {
        if (user.password !== payload.password) {
            res.sendStatus(401)
        } else {
            const token = jwt.sign({ email: user.email, pseudo: user.pseudo, role: user.role }, secretKey, { expiresIn: "1h" })
            new Cookies(req, res).set(cookieName, token, { httpOnly: true, secure: false })
            res.sendStatus(200)
        }
    }
})

// Supprime l'utilisateur et son token d'authentification
router.delete("/", auth, async (req, res) => {
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
})

// Modifie l'utilisateur et lui génère un token d'authentification valable 1h si il se modifie lui même
router.patch("/", auth, async (req, res) => {
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
})

// Récupère les données de l'utilisateur
router.get("/", auth, async (req, res) => {
    const payload = {
        email: req.body.email
    }
    const authUser = req.body._authUser
    if (authUser.role === ("Admin" || "Employee") || payload.email === authUser.email) {
        const user = await User.findOne({ email: payload.email })
        if (!user) {
            res.sendStatus(404)
        } else {
            res.status(200).send({email: user.email, pseudo: user.pseudo, role: user.role})
        }
    } else {
        res.sendStatus(401)
    }
})

// Exports
export default router;