import express from "express"
import { authentication } from "../middlewares/authentication"
import { create, read, update, remove } from "../controllers/train"

const router = express.Router()

router.post("/", authentication, create) // Validé
router.get("/", read) // Validé
router.patch("/", authentication, update) // Validé
router.delete("/", authentication, remove) // Validé

export default router