import express from "express";
import {
    getPemesanan,
    getPemesananById,
    createPemesanan,
    updatePemesanan,
    deletePemesanan
} from "../controllers/Pemesan.js";
import { verifyUser } from "../middleware/AuthUser.js";

const router = express.Router();

router.get('/pemesanan',verifyUser, getPemesanan);
router.get('/pemesanan/:uuid',verifyUser, getPemesananById);
router.post('/pemesanan',verifyUser, createPemesanan);
router.patch('/pemesanan/:uuid',verifyUser, updatePemesanan);
router.delete('/pemesanan/:uuid',verifyUser, deletePemesanan);

export default router;