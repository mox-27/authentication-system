import { Router } from "express";

const router = Router();

// Controllers and middlewares
import { getProfile } from "../controllers/user.controllers.js";
import { protect } from "../middlewares/protect.js";

router.get('/me', protect, getProfile);

export default router;