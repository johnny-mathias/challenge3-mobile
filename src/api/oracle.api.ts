import axios from 'axios';

import { ORACLE_API_URL } from '../config/env';

import type {
  OracleAnimal,
  OracleAnimalInput,
  OracleBreed,
  OracleSpecies,
  UserRole,
} from '../types/api.types';

export const oracleClient = axios.create({
  baseURL: `${ORACLE_API_URL}/api`,
  timeout: 20000,
});

// O backend responde { sucesso: false, mensagem } em erros de validação/banco
function toError(error: any): Error {
  const mensagem = error?.response?.data?.mensagem;
  if (mensagem) return new Error(mensagem);
  if (!error?.response) {
    return new Error(`Não foi possível conectar ao servidor (${ORACLE_API_URL})`);
  }
  return error;
}

export async function getSpecies(): Promise<OracleSpecies[]> {
  try {
    const { data } = await oracleClient.get<{ especies: OracleSpecies[] }>('/especies');
    return data.especies;
  } catch (error) {
    throw toError(error);
  }
}

export async function getBreedsBySpecies(especieId: number): Promise<OracleBreed[]> {
  try {
    const { data } = await oracleClient.get<{ racas: OracleBreed[] }>(
      `/especies/${especieId}/racas`,
    );
    return data.racas;
  } catch (error) {
    throw toError(error);
  }
}

export async function createOracleAnimal(input: OracleAnimalInput): Promise<number> {
  try {
    const { data } = await oracleClient.post<{ id: number }>('/animals', input);
    return data.id;
  } catch (error) {
    throw toError(error);
  }
}

export async function getOracleAnimalsByTutor(tutorEmail: string): Promise<OracleAnimal[]> {
  try {
    const { data } = await oracleClient.get<{ animais: OracleAnimal[] }>('/animals', {
      params: { tutorEmail },
    });
    return data.animais;
  } catch (error) {
    throw toError(error);
  }
}

export async function deleteOracleAnimal(id: number, tutorEmail: string): Promise<void> {
  try {
    await oracleClient.delete(`/animals/${id}`, { params: { tutorEmail } });
  } catch (error) {
    throw toError(error);
  }
}

// Todos os animais via PKG_ANIMAL.PR_LISTAR_ANIMAIS_JSON (dataset para o MongoDB)
export async function getAllOracleAnimals(): Promise<OracleAnimal[]> {
  try {
    const { data } = await oracleClient.get<{ animais: OracleAnimal[] }>('/animals');
    return data.animais;
  } catch (error) {
    throw toError(error);
  }
}

export async function getUserRole(email: string): Promise<UserRole> {
  try {
    const { data } = await oracleClient.get<{ perfil: UserRole }>('/usuarios/perfil', {
      params: { email },
    });
    return data.perfil;
  } catch (error) {
    throw toError(error);
  }
}
