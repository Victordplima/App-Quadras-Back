import { v7 as uuidv7 } from 'uuid';
import bcrypt from 'bcrypt';

// Simulação de um banco de dados
const usuarios = new Map<string, any>();

export const criarUsuario = async (nome: string, email: string, senha: string, telefone: string, matricula: string, curso: string, role: string) => {
  const id = uuidv7();
  const senhaHash = await bcrypt.hash(senha, 10);

  const novoUsuario = { id, nome, email, senha: senhaHash, telefone, matricula, curso, role };
  usuarios.set(email, novoUsuario);

  return novoUsuario;
};

export const encontrarUsuarioPorEmail = (email: string) => {
  return usuarios.get(email);
};

export const validarSenha = async (senha: string, senhaHash: string): Promise<boolean> => {
  return bcrypt.compare(senha, senhaHash);
};
