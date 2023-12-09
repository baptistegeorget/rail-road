// Imports
import jwt from "jsonwebtoken"
import Cookies from "cookies"
import "dotenv/config"
import { Request, Response, NextFunction } from "express"

// Déclarations
const secretKey = process.env.JWT_SECRET_KEY || "secretKey"
const cookieName = process.env.JWT_COOKIE_NAME || "authToken"

// Récupère, décode et passe dans la requête le token de l'utilisateur
function auth(req: Request, res: Response, next: NextFunction) {
    const token = new Cookies(req, res).get(cookieName)
    if (token) {
        jwt.verify(token, secretKey, (err, decoded) => {
            if (err) {
                res.sendStatus(401)
            } else {
                req.body._authUser = decoded
                next()
            }
        })
    } else {
        res.sendStatus(401)
    }
}

// Exports
export { auth }