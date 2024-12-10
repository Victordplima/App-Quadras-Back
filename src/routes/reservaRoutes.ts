import { Router } from "express";
import * as reservaController from "../controllers/reservaController";
import { protegerRota } from "../middleware/authMiddleware";
import { verificarPermissoes } from "../middleware/verificarPermissoes";
import {
    verificarHorarioPermitido,
    verificarReservaConsecutiva,
} from "../middleware/reservaMiddleware";
import { verificarBloqueio } from "../middleware/verificarBloqueio";
import { verificarAdmin } from "../middleware/verificarAdmin";

const router = Router();

// Criar uma nova reserva
router.post(
    "/",
    protegerRota,
    verificarBloqueio,
    verificarHorarioPermitido,
    verificarReservaConsecutiva,
    reservaController.criarReserva
);

// Criar uma nova reserva como aula (somente admins)
router.post(
    "/admin",
    protegerRota,
    verificarAdmin,
    reservaController.criarReservaAdmin
);

// Buscar reservas da semana
router.get(
    "/semana",
    protegerRota,
    verificarPermissoes,
    reservaController.buscarReservasDaSemana
);

// Buscar reservas por usuário
router.get(
    "/usuario/:usuarioId",
    protegerRota,
    reservaController.buscarReservasPorUsuario
);

// Alterar o status de uma reserva
router.put(
    "/status/:reservaId",
    protegerRota,
    verificarPermissoes,
    reservaController.alterarStatusReserva
);

// Buscar agendamentos por quadra e dia
router.get(
    "/:quadraId/agendamentos",
    protegerRota,
    reservaController.buscarAgendamentosPorQuadraEDia
);

// Cancelar uma reserva (atualiza o status para "Cancelada" e aplica bloqueio se necessário)
router.put(
    "/:reservaId/cancelar",
    protegerRota,
    reservaController.cancelarReserva
);

router.get(
    "/dia",
    protegerRota,
    reservaController.buscarReservasDoDia
);

router.get(
    "/dia-sem-ocorrencia",
    protegerRota,
    reservaController.buscarReservasDoDiaSemOcorrencias
);

export default router;
