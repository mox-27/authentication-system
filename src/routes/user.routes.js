import { Router } from "express";

const router = Router();

// Controllers and middlewares
import { deleteAccountController, getProfile, updateUserController } from "../controllers/user.controllers.js";
import { protect } from "../middlewares/protect.js";
import { validate } from '../middlewares/validate.js';
import { updateUserBodySchema } from "../zodValidations/user.schema.js";

router.get('/me', protect, getProfile);
router.put('/me', protect, validate(updateUserBodySchema), updateUserController);
router.delete('/me', protect, deleteAccountController);


export default router;