import "dotenv/config"
import { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"
import Cookies from "cookies"

const secretKey = process.env.JWT_SECRET_KEY || "secret"
const cookieName = process.env.JWT_COOKIE_NAME || "token"

function authentication(req: Request, res: Response, next: NextFunction) {
    const token = new Cookies(req, res).get(cookieName)
    if (token) {
        jwt.verify(token, secretKey, (err, decoded) => {
            if (err || !decoded) {
                res.sendStatus(401)
            } else {
                req.body.user = decoded
                next()
            }
        })
    } else {
        res.sendStatus(401)
    }
}

export { authentication }