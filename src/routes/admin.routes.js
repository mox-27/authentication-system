import { Router } from "express";

const router = Router();

// Controllers and middlewares
import { getAllUsers, deleteAnyUser, updateUserRole } from "../controllers/admin.controllers.js";
import { adminOnly, protect } from "../middlewares/protect.js";
import { validate } from '../middlewares/validate.js';
import { updateUserRoleSchema } from '../zodValidations/admin.schema.js';


router.get('/users', protect, adminOnly, getAllUsers);
router.delete('/users/:id', protect, adminOnly, deleteAnyUser);
router.put('/users/:id/role', protect, adminOnly, validate(updateUserRoleSchema), updateUserRole);

export default router;