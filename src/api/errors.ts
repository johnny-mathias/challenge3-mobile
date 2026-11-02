import { isAxiosError } from 'axios';

// Erros do Firebase Authentication (login/cadastro)
const FIREBASE_MESSAGES: Record<string, string> = {
  'auth/invalid-credential': 'E-mail ou senha incorretos',
  'auth/invalid-email': 'E-mail inválido',
  'auth/user-not-found': 'E-mail ou senha incorretos',
  'auth/wrong-password': 'E-mail ou senha incorretos',
  'auth/email-already-in-use': 'Este e-mail já está cadastrado',
  'auth/weak-password': 'A senha precisa ter pelo menos 6 caracteres',
  'auth/too-many-requests': 'Muitas tentativas seguidas. Aguarde um pouco e tente novamente',
  'auth/network-request-failed': 'Sem conexão com a internet. Verifique sua rede e tente novamente',
};

function messageForStatus(status: number) {
  if (status === 401 || status === 403) return 'Sua sessão expirou. Saia e entre novamente na sua conta';
  if (status === 404) return 'Não encontramos esse registro. Ele pode ter sido removido';
  if (status === 409) return 'Não foi possível concluir: este registro está ligado a outros dados';
  if (status === 400 || status === 422) return 'Confira os dados informados e tente novamente';
  if (status >= 500) return 'O servidor teve um problema. Tente novamente em instantes';
  return 'Algo deu errado. Tente novamente';
}

// Converte qualquer erro (axios, Firebase ou validação) numa frase para o usuário
export function getErrorMessage(error: unknown): string {
  if (isAxiosError(error)) {
    // O backend Node/Oracle já responde { mensagem } em português
    const mensagem = (error.response?.data as any)?.mensagem;
    if (typeof mensagem === 'string' && mensagem) return mensagem;

    if (error.response) return messageForStatus(error.response.status);

    if (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') {
      return 'O servidor demorou para responder. Ele pode estar iniciando — tente novamente em alguns segundos';
    }
    return 'Não foi possível conectar ao servidor. Verifique sua internet e tente novamente';
  }

  const code = (error as any)?.code;
  if (typeof code === 'string' && FIREBASE_MESSAGES[code]) return FIREBASE_MESSAGES[code];

  if (error instanceof Error && error.message) return error.message;
  return 'Algo deu errado. Tente novamente';
}

// Interceptor dos clientes axios: as telas recebem Error com a mensagem amigável
// (status preservado para quem precisar)
export function toFriendlyError(error: unknown) {
  const friendly = new Error(getErrorMessage(error)) as Error & { status?: number };
  if (isAxiosError(error)) friendly.status = error.response?.status;
  return Promise.reject(friendly);
}
