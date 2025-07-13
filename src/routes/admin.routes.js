import { Router } from "express";

const router = Router();

// Controllers and middlewares
import { getAllUsers } from "../controllers/admin.controllers.js";
import { adminOnly, protect } from "../middlewares/protect.js";


router.get('/users', protect, adminOnly, getAllUsers);

export default router;