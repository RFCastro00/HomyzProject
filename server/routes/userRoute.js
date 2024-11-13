import express from 'express'
import { bookVisit, cancelBooking, createUser, getAllBookings, getAllFavorites, toFavorite } from '../controllers/userControl.js'
import jwtCheck from '../config/auth0Config.js';
const router = express.Router()

router.post("/register", jwtCheck, createUser);
router.post("/bookVisit/:id", jwtCheck, bookVisit);
router.post("/allBookings", jwtCheck, getAllBookings);
router.post("/removeBooking/:id", jwtCheck, cancelBooking);
router.post("/toFavorites/:rid", jwtCheck, toFavorite);
router.post("/allFavorites", jwtCheck, getAllFavorites);
export {router as userRoute}