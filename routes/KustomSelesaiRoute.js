import express from "express";
import {
    getKustomSelesai,
    getKustomSelesaiById,
    createKustomSelesai,
    updateKustomSelesai,
    deleteKustomSelesai
} from "../controllers/KustomSelesai.js";
import { verifyUser } from "../middleware/AuthUser.js";

const router = express.Router();

router.get('/kustom-selesai',verifyUser, getKustomSelesai);
router.get('/kustom-selesai/:uuid',verifyUser, getKustomSelesaiById);
router.post('/kustom-selesai',verifyUser, createKustomSelesai);
router.patch('/kustom-selesai/:uuid',verifyUser, updateKustomSelesai);
router.delete('/kustom-selesai/:uuid',verifyUser, deleteKustomSelesai);

export default router;