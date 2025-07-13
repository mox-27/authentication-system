import { Router } from "express";

const router = Router();

// Controllers and middlewares
import { getAllUsers, deleteAnyUser } from "../controllers/admin.controllers.js";
import { adminOnly, protect } from "../middlewares/protect.js";


router.get('/users', protect, adminOnly, getAllUsers);
router.delete('/users/:id', protect, adminOnly, deleteAnyUser);

export default router;