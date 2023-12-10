import "dotenv/config"
import { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"
import Cookies from "cookies"

const secretKey = process.env.JWT_SECRET_KEY || "secret"
const cookieName = process.env.JWT_COOKIE_NAME || "token"

// Récupère le token. Si il y a un token et qu'il est valide alors ajoute les données de l'utilisateur dans la requête.
function authentication(req: Request, res: Response, next: NextFunction) {
    const token = new Cookies(req, res).get(cookieName)
    if (token) {
        jwt.verify(token, secretKey, (err, decoded) => {
            if (err || !decoded) {
                res.status(401).send("Token invalide")
            } else {
                req.body.user = decoded
                next()
            }
        })
    } else {
        res.status(401).send("Aucun token trouvé")
    }
}

export { authentication }