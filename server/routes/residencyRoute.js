import express from 'express'
import { createResidency, getAllResdencies, getResidency } from '../controllers/residencyControl.js'
import jwtCheck from '../config/auth0Config.js'
const router = express.Router()

router.post("/create", jwtCheck, createResidency)
router.get("/allresd", getAllResdencies)
router.get("/:id", getResidency)
export {router as residencyRoute}