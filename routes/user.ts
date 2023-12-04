import express from "express"
import { User } from "../models/user"
import jwt from "jsonwebtoken"
import crypto from "crypto"
import config from "../tsconfig.json"
import Cookies from "cookies"
import { auth } from "../middlewares/auth"

const router = express.Router()

router.post("/signup", async (req, res) => {
    const payload = {
        email: req.body.email,
        pseudo: req.body.pseudo,
        password: crypto.createHash("sha256").update(req.body.password).digest("hex"),
        role: req.body.role
    }
    const user = new User(payload)
    await user.save()
        .then(() => {
            const token = jwt.sign(payload, config.secretKey, { expiresIn: "1h" })
            new Cookies(req, res).set("accessToken", token, { httpOnly: true, secure: false })
            res.status(201).send("Utilisateur créé")
        })
        .catch(() => {
            res.status(500).send("Erreur serveur")
        })
})

router.post("/login", async (req, res) => {
    const payload = {
        email: req.body.email,
        password: crypto.createHash("sha256").update(req.body.password).digest("hex")
    }
    const user = await User.findOne({ email: payload.email })
    if (!user) {
        res.status(404).send("Utilisateur introuvable")
    } else {
        if (user.password !== payload.password) {
            res.status(401).send("Mot de passe incorrect")
        } else {
            const token = jwt.sign({ email: user.email, pseudo: user.pseudo, password: user.password, role: user.role }, config.secretKey, { expiresIn: "1h" })
            new Cookies(req, res).set("accessToken", token, { httpOnly: true, secure: false })
            res.status(200).send("Authentification réussie")
        }
    }
})

router.delete("/", auth, async (req, res) => {
    const payload = {
        email: req.body.email
    }
    if (payload.email === req.body.authUser.email) {
        const user = await User.findOneAndDelete({ email: payload.email })
        if (user) {
            new Cookies(req, res).set("accessToken", null)
            res.status(200).send("Utilisateur supprimé")
        } else {
            res.status(404).send("Utilisateur introuvable")
        }
    } else {
        res.status(401).send("Action non autorisée")
    }
})

router.patch("/", auth, async (req, res) => {
    const payload = {
        email: req.body.email,
        pseudo: req.body.pseudo,
        password: crypto.createHash("sha256").update(req.body.password).digest("hex"),
        role: req.body.role
    }
    if (req.body.authUser.role === "Admin" || req.body.authUser.email === payload.email) {
        let user = undefined
        if (req.body.authUser.role === "Admin") {
            user = await User.findOneAndUpdate({ email: payload.email }, { email: payload.email, pseudo: payload.pseudo, password: payload.password, role: payload.role })
        } else {
            user = await User.findOneAndUpdate({ email: payload.email }, { email: payload.email, pseudo: payload.pseudo, password: payload.password })
        }
        if (!user) {
            res.status(404).send("Utilisateur introuvable")
        } else {
            user.save()
                .then(() => {
                    res.status(201).send("Utilisateur modifié")
                })
                .catch(() => {
                    res.status(500).send("Erreur serveur")
                })
        }
    } else {
        res.status(401).send("Action non autorisée")
    }
})

router.get("/", auth, async (req, res) => {
    const payload = {
        email: req.body.email
    }
    if (req.body.authUser.role === ("Admin" || "Employee") || payload.email === req.body.authUser.email) {
        const user = await User.findOne({ email: payload.email })
        if (!user) {
            res.status(404).send("Utilisateur introuvable")
        } else {
            res.status(200).send(user)
        }
    } else {
        res.status(401).send("Action non autorisée")
    }
})

export default router;