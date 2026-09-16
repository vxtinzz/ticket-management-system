import { Router } from "express"
import { getResponsibles, getResponsibleById } from "../controllers/tickets.controller"

const router = Router()


router.get("/responsible/", getResponsibles)
router.get("/responsible/:id", getResponsibleById)

export default router