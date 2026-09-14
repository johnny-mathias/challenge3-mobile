[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/GDVnG_N-)
[![Open in Visual Studio Code](https://classroom.github.com/assets/open-in-vscode-2e0aaae1b6195c2367325f4f02e2d04e9abb55f0b24a779b69b11b9e10269abc.svg)](https://classroom.github.com/online_ide?assignment_repo_id=23919763&assignment_repo_type=AssignmentRepo)

<div align="center">
  <img src="./assets/sb-logo-png.png" alt="Logo SuperBicho" width="110" />

  # SuperBicho

  Aplicativo mobile para tutores de pets agendarem consultas veterinárias e gerenciarem seus animais.
</div>

---

## Índice

- [Sobre o projeto](#sobre-o-projeto)
- [Funcionalidades](#funcionalidades)
- [Tecnologias](#tecnologias)
- [Como executar](#como-executar)
- [Estrutura do projeto](#estrutura-do-projeto)
- [Vídeo de apresentação](#vídeo-de-apresentação)
- [Equipe](#equipe)

---

## Sobre o projeto

Encontrar uma clínica veterinária, agendar consultas e manter o histórico dos pets organizado costuma ser um processo espalhado entre grupos de WhatsApp, ligações e papel. O **SuperBicho** resolve isso oferecendo, num só app, um espaço para o tutor cadastrar seus pets e agendar atendimentos em clínicas parceiras já aprovadas na plataforma, acompanhando tudo pelo celular.

Este repositório contém o **aplicativo mobile do tutor**, construído em React Native/Expo, que se conecta a uma API própria (Java/Spring Boot) responsável por toda a persistência de dados (tutores, pets, clínicas, veterinários e agendamentos).

## Funcionalidades

- **Autenticação** com e-mail e senha (Firebase Authentication), sessão persistida e logout.
- **Meus Pets** — cadastrar, editar, listar e remover pets (CRUD completo).
- **Agendamentos** — criar, reagendar, consultar e cancelar consultas veterinárias em clínicas aprovadas (CRUD completo).
- **Artigos** informativos sobre cuidados com animais.
- Suporte a tema claro/escuro.

## Tecnologias

**App mobile** (este repositório)
- [React Native](https://reactnative.dev/) + [Expo](https://expo.dev/)
- TypeScript
- [React Navigation](https://reactnavigation.org/) (stack + bottom tabs)
- [TanStack Query](https://tanstack.com/query) para integração com a API
- [Axios](https://axios-http.com/)
- [Firebase Authentication](https://firebase.google.com/products/auth)

**API** ([repositório separado](https://github.com/luisa-ganasevici/SuperBicho))
- Java + Spring Boot (Spring Security, Spring Data JPA)
- Banco de dados Oracle
- Deploy em produção: [`https://superbicho.onrender.com`](https://superbicho.onrender.com)

## Como executar

### Pré-requisitos

- [Node.js](https://nodejs.org/) 18 ou superior
- [Expo Go](https://expo.dev/go) instalado no celular, **ou** um emulador Android (Android Studio) / simulador iOS configurado
- Conexão com a internet — o app consome a API em produção (`https://superbicho.onrender.com`)

### Passo a passo

```bash
git clone https://github.com/2TDSPX/challenge12-superbicho.git
cd challenge12-superbicho
npm install
npx expo start
```

Depois é só escanear o QR Code com o app Expo Go, ou pressionar `a` (Android) / `i` (iOS) no terminal para abrir num emulador/simulador.

> A API roda no plano gratuito do Render, que "dorme" depois de alguns minutos sem uso — a primeira requisição após um tempo parado pode demorar até um minuto para responder enquanto o servidor acorda.

### Variáveis de ambiente (opcional)

Por padrão o app aponta para a API em produção. Para apontar para outro servidor (ex: uma instância local da API Java), defina antes de iniciar:

```bash
EXPO_PUBLIC_API_URL=http://localhost:8080 npx expo start
```

## Estrutura do projeto

```
src/
├── api/          # Chamadas HTTP à API (axios), autenticação de sessão e CSRF
├── components/    # Componentes de UI reutilizáveis
├── config/        # Configuração do Firebase e da URL base da API
├── context/       # Contextos globais (autenticação, agendamentos)
├── data/          # Conteúdo estático local (artigos, configurações)
├── hooks/         # Hooks de dados com TanStack Query
├── screens/       # Telas do app
├── theme/         # Cores e tema claro/escuro
└── types/         # Tipos TypeScript
```

## Vídeo de apresentação

**Sprint 3:** [Adicionar link do vídeo aqui]

**Sprint 1/2:** [Clique aqui](https://youtu.be/wh2CUeqV0Wo)

## Equipe

| Nome | RM |
|---|---|
| Ana Carolina Pereira Fontes | 562145 |
| João Victor Nascimento Adão | 563409 |
| Johnny Dias Mathias Junior | 566516 |
| Luisa Ganasevici de Abreu | 563403 |
| Matheus Moya de Oliveira | 562822 |
