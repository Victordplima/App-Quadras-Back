import { Router } from 'express';
import { register, login } from '../controllers/authController';
import { protegerRota } from "../middleware/authMiddleware";
import { verificarAdmin } from "../middleware/verificarAdmin";

const router = Router();

router.post('/register',protegerRota, verificarAdmin, register);
router.post('/login', login);

export default router;
