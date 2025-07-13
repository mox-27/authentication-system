import { Router } from "express";

const router = Router();

// Controllers adn middlewares
import { getProfile } from "../controllers/user.controllers.js";
import { protect } from "../middlewares/protect.js";

router.get('/me', protect, getProfile);

export default router;