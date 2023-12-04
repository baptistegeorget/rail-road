import jwt from "jsonwebtoken"
import Cookies from "cookies"
import config from "../tsconfig.json"

export function auth(req, res, next) {
    const token = new Cookies(req, res).get("accessToken")
    jwt.verify(token, config.secretKey, (err, decoded) => {
        if (err) {
            res.status(401).send("Veuillez vous connecter")
        } else {
            req.body.authUser = decoded
            next()
        }
    })
}