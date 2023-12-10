import express from "express"
import { authentication } from "../middlewares/authentication"
import { create, read, update, remove } from "../controllers/user"

const router = express.Router()

router.post("/", create) // Validé
router.get("/", authentication, read) // Validé
router.patch("/", authentication, update) // Validé
router.delete("/", authentication, remove) // Validé

export default router;