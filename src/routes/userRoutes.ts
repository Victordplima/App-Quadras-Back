import express from 'express';
import { buscarUsuario, editarUsuario, deletarUsuario, listarTodosUsuarios, buscarHistoricoUsuario } from '../controllers/userController';
import { protegerRota } from '../middleware/authMiddleware';
import { verificarAdmin } from '../middleware/verificarAdmin';

const router = express.Router();

router.get('/:id', protegerRota, verificarAdmin, buscarUsuario);
router.put('/:id', protegerRota, verificarAdmin, editarUsuario);
router.delete('/:id', protegerRota, verificarAdmin, deletarUsuario);
router.get('/', protegerRota, verificarAdmin, listarTodosUsuarios);
router.get('/:id/historico', protegerRota, verificarAdmin, buscarHistoricoUsuario);

export default router;
