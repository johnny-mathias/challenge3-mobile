import axios from 'axios';

import { ORACLE_API_URL } from '../config/env';
import { toFriendlyError } from './errors';

import type { Article } from '../types/article';
import type {
  OracleAnimal,
  OracleAnimalDetails,
  OracleAnimalInput,
  OracleBreed,
  OracleSpecies,
  UserRole,
} from '../types/api.types';

export const oracleClient = axios.create({
  baseURL: `${ORACLE_API_URL}/api`,
  timeout: 45000,
});

// Erros já chegam às telas com mensagem amigável (ver api/errors.ts)
oracleClient.interceptors.response.use(undefined, toFriendlyError);

export async function getSpecies(): Promise<OracleSpecies[]> {
  const { data } = await oracleClient.get<{ especies: OracleSpecies[] }>('/especies');
  return data.especies;
}

export async function getBreedsBySpecies(especieId: number): Promise<OracleBreed[]> {
  const { data } = await oracleClient.get<{ racas: OracleBreed[] }>(
    `/especies/${especieId}/racas`,
  );
  return data.racas;
}

export async function createOracleAnimal(input: OracleAnimalInput): Promise<number> {
  const { data } = await oracleClient.post<{ id: number }>('/animals', input);
  return data.id;
}

export async function getOracleAnimalsByTutor(tutorEmail: string): Promise<OracleAnimal[]> {
  const { data } = await oracleClient.get<{ animais: OracleAnimal[] }>('/animals', {
    params: { tutorEmail },
  });
  return data.animais;
}

export async function getOracleAnimal(id: number, tutorEmail: string): Promise<OracleAnimalDetails> {
  const { data } = await oracleClient.get<{ animal: OracleAnimalDetails }>(`/animals/${id}`, {
    params: { tutorEmail },
  });
  return data.animal;
}

export async function updateOracleAnimal(id: number, input: OracleAnimalInput): Promise<void> {
  await oracleClient.put(`/animals/${id}`, input);
}

// Artigos da Home (T_ARTICLE), antes fixos em src/data/articles.json
export async function getArticles(): Promise<Article[]> {
  const { data } = await oracleClient.get<{ artigos: Article[] }>('/artigos');
  return data.artigos;
}

export async function deleteOracleAnimal(id: number, tutorEmail: string): Promise<void> {
  await oracleClient.delete(`/animals/${id}`, { params: { tutorEmail } });
}

// Todos os animais via PKG_ANIMAL.PR_LISTAR_ANIMAIS_JSON (dataset para o MongoDB)
export async function getAllOracleAnimals(): Promise<OracleAnimal[]> {
  const { data } = await oracleClient.get<{ animais: OracleAnimal[] }>('/animals');
  return data.animais;
}

export async function getUserRole(email: string): Promise<UserRole> {
  const { data } = await oracleClient.get<{ perfil: UserRole }>('/usuarios/perfil', {
    params: { email },
  });
  return data.perfil;
}
