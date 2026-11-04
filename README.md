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
- [Área de administrador](#área-de-administrador)
- [Publicação](#publicação)
- [Estrutura do projeto](#estrutura-do-projeto)
- [Vídeo de apresentação](#vídeo-de-apresentação)
- [Equipe](#equipe)

---

## Sobre o projeto

Encontrar uma clínica veterinária, agendar consultas e manter o histórico dos pets organizado costuma ser um processo espalhado entre grupos de WhatsApp, ligações e papel. O **SuperBicho** resolve isso oferecendo, num só app, um espaço para o tutor cadastrar seus pets e agendar atendimentos em clínicas parceiras já aprovadas na plataforma, acompanhando tudo pelo celular.

Este repositório contém o **aplicativo mobile do tutor**, construído em React Native/Expo. Ele se conecta a dois backends:

- uma **API Java/Spring Boot** (repositório separado), responsável pelos dados do dia a dia do tutor: tutores, pets, clínicas, veterinários e agendamentos;
- um **backend Node.js/Express** (pasta [`backend/`](backend/)), ligado ao banco **Oracle** da disciplina de banco de dados. Ele chama as procedures do pacote `PKG_ANIMAL` e alimenta a área de administrador do app, incluindo a exportação do JSON importado no MongoDB.

## Funcionalidades

- **Autenticação** com e-mail e senha (Firebase Authentication), sessão persistida e logout.
- **Meus Pets** — cadastrar, editar, listar e remover pets (CRUD completo, API Java). O botão de remover fica na tela de edição do pet, com confirmação.
- **Agendamentos** — criar, reagendar, consultar e cancelar consultas veterinárias em clínicas aprovadas (CRUD completo, API Java).
- **Lembretes de consulta** (notificações locais, sem servidor de push):
  - o lembrete é agendado ao criar ou reagendar uma consulta e dispara **4 horas antes** dela, com a mensagem *"Sua consulta das 14:30 começa em 4 horas"*;
  - se a consulta for daqui a menos de 4 horas, o lembrete chega alguns segundos depois de agendar, já com o tempo que falta (ex: *"começa em 1h30min"*);
  - cancelar a consulta remove o lembrete, e a lista do app mantém os lembretes sincronizados com a API;
  - podem ser ligados e desligados em **Conta → Notificações** (*Ativadas*/*Desativadas*). Desligar remove os lembretes já agendados, e ligar pede a permissão do Android se preciso;
  - **tocar na notificação abre os detalhes daquele agendamento**, com o app aberto, em segundo plano ou fechado.
- **Área de administrador** (Node + Oracle) — ver [Área de administrador](#área-de-administrador).
- **Sobre o app** (em *Conta*) — versão, **hash do commit** da build (com link para o GitHub), ambiente, situação das duas APIs e das notificações, e a equipe.
- **Puxar para atualizar** em todas as telas que carregam dados da internet, e tela de erro com botão **"Tentar novamente"**.
- **Mensagens de erro amigáveis** — falhas de rede, servidor iniciando, sessão expirada e erros de login aparecem em português claro, em vez de mensagens técnicas.
- **Artigos** informativos sobre cuidados com animais, guardados no Oracle (`T_ARTICLE` e `T_ARTICLE_TAG`) e servidos pelo backend Node em `/api/artigos`.
- **Configurações da conta** (*Conta*):
  - **Tema** claro/escuro, com ícone de sol ou lua conforme o tema atual;
  - **Notificações** ativadas/desativadas;
  - **Idioma**: português do Brasil (padrão) ou inglês. A escolha fica salva no aparelho e muda todas as telas, as mensagens de erro e o texto do lembrete. Conteúdos que vêm das APIs (artigos, espécies digitadas, mensagens do backend Oracle) continuam no idioma original.

## Tecnologias

**App mobile** (este repositório)
- [React Native](https://reactnative.dev/) + [Expo](https://expo.dev/)
- TypeScript
- [React Navigation](https://reactnavigation.org/) (stack + bottom tabs)
- [TanStack Query](https://tanstack.com/query) para integração com a API
- [Axios](https://axios-http.com/)
- [Firebase Authentication](https://firebase.google.com/products/auth)
- [expo-notifications](https://docs.expo.dev/versions/latest/sdk/notifications/) para os lembretes de consulta
- expo-constants / expo-application para a tela "Sobre o app"
- expo-file-system / expo-sharing para o download do JSON dos animais

**Backend Node + Oracle** (pasta [`backend/`](backend/))
- Node.js 20+ com Express 5 e [`oracledb`](https://node-oracledb.readthedocs.io/) (modo thin)
- Procedures do pacote `PKG_ANIMAL` (ex: `PR_LISTAR_ANIMAIS_JSON`, que gera o JSON dos animais)
- Deploy em produção: [`https://superbicho-oracle-api.onrender.com`](https://superbicho-oracle-api.onrender.com)

**API Java** ([repositório separado](https://github.com/luisa-ganasevici/SuperBicho))
- Java + Spring Boot (Spring Security, Spring Data JPA)
- Banco de dados Oracle
- Deploy em produção: [`https://superbicho.onrender.com`](https://superbicho.onrender.com)

## Como executar

### Pré-requisitos

- [Node.js](https://nodejs.org/) 20 ou superior
- [Expo Go](https://expo.dev/go) instalado no celular, **ou** um emulador Android (Android Studio) / simulador iOS configurado
- Conexão com a internet — o app consome as duas APIs em produção (`https://superbicho.onrender.com` e `https://superbicho-oracle-api.onrender.com`)

### Passo a passo

```bash
git clone https://github.com/johnny-mathias/challenge3-mobile.git
cd challenge3-mobile
npm install
npx expo start
```

Depois é só escanear o QR Code com o app Expo Go, ou pressionar `a` (Android) / `i` (iOS) no terminal para abrir num emulador/simulador.

> As duas APIs rodam no plano gratuito do Render, que "dorme" depois de alguns minutos sem uso. A primeira requisição após um tempo parado pode demorar até um minuto enquanto o servidor acorda. Se uma tela mostrar erro, use **"Tentar novamente"** ou puxe a tela para baixo. A tela **Conta → Sobre o app** mostra se cada API já está online. Quando o Render reinicia a API Java (deploy ou volta do modo dormindo), a sessão do tutor é perdida no servidor; o app percebe o redirecionamento para `/login` e volta para a tela de login com o aviso *"Sua sessão expirou"*, já com o e-mail preenchido. No login e no cadastro, o app espera a API Java acordar antes de abrir a sessão, para a primeira entrada do dia não falhar por causa do Render.

> **Notificações no Expo Go:** os lembretes são notificações *locais* e funcionam no Expo Go e no APK. O app importa só os módulos locais do `expo-notifications` (ver [`src/services/notifications.ts`](src/services/notifications.ts)), porque o pacote completo tenta registrar push remoto e isso derruba o Expo Go no Android desde o SDK 53. O Expo Go também não deixa o app criar um canal de notificação próprio nem agendar alarmes exatos, então lá o Android pode atrasar o lembrete em até ~1h. No APK, o app declara `USE_EXACT_ALARM` e o lembrete sai no horário exato. Se a permissão de notificações estiver desligada, ela pode ser pedida de novo em **Conta → Notificações** ou em **Conta → Sobre o app → Lembretes de consulta**.

### Variáveis de ambiente (opcional)

Por padrão o app aponta para a API em produção. Para apontar para outro servidor (ex: uma instância local da API Java), defina antes de iniciar:

```bash
EXPO_PUBLIC_API_URL=http://localhost:8080 npx expo start
```

Para usar o backend Node/Oracle rodando na sua máquina:

```bash
EXPO_PUBLIC_ORACLE_API_URL=http://<ip-da-maquina>:3000 npx expo start
```

### Backend Node + Oracle (opcional, local)

```bash
cd backend
npm install
npm start
```

Crie um arquivo `backend/.env` (não versionado) com `DB_USER`, `DB_PASSWORD`, `DB_HOST`, `DB_PORT` e `DB_SID` do Oracle.

Os artigos da Home ficam no Oracle. Para criar as tabelas e carregar os artigos iniciais (pode rodar de novo sem duplicar nada):

```bash
cd backend
node scripts/criar-artigos.js
```

Rotas principais:

| Método | Rota | O que faz |
|---|---|---|
| GET | `/api/animals` | Lista todos os animais via `PKG_ANIMAL.PR_LISTAR_ANIMAIS_JSON` (`?tutorEmail=` filtra pelo tutor) |
| POST | `/api/animals` | Cadastra um animal e o vincula ao tutor (`T_ANIMAL_RESP`) |
| GET | `/api/animals/:id?tutorEmail=` | Dados de um animal do próprio tutor, para a tela de edição |
| PUT | `/api/animals/:id` | Atualiza um animal do próprio tutor |
| DELETE | `/api/animals/:id?tutorEmail=` | Remove um animal do próprio tutor |
| GET | `/api/especies` e `/api/especies/:id/racas` | Espécies e raças para o formulário |
| GET | `/api/usuarios/perfil?email=` | Perfil do usuário: `ADMIN` ou `TUTOR` |
| GET | `/api/artigos` e `/api/artigos/:id` | Artigos da Home, com as tags |
| GET | `/api/teste` | Verifica a conexão com o Oracle |

## Área de administrador

Usuários com perfil **ADMIN** no Oracle (`T_USER_PROFILE.PROFILE_TYPE = 'ADMIN'`, ativo) veem, na aba **Pets**:

- o botão **"Ver Todos os Pets"**, que lista todos os animais registrados no Oracle (via procedure);
- o cadastro de pets direto no Oracle (na visão *Todos os Pets*), com espécie e raça vindas do banco;
- a edição e a remoção dos pets que ele mesmo cadastrou no Oracle (botão *Editar* no card; *Remover pet* fica na tela de edição);
- o botão azul de **download** no topo, que gera o arquivo `03_animais.json` com todos os animais. Esse arquivo é o mesmo importado no MongoDB:

```bash
mongoimport --uri "mongodb://localhost:27017" --db sprint4 --collection animais --file "./03_animais.json" --jsonArray --drop
```

Usuários comuns (perfil TUTOR, padrão de quem se cadastra pelo app) usam só a API Java e o Firebase. Para tornar um usuário admin, com o e-mail dele já existente em `T_USER`:

```sql
INSERT INTO T_USER_PROFILE (PROFILE_TYPE, FULL_NAME, CPF, IS_ACTIVE, CREATED_AT, UPDATED_AT, T_USER_ID)
SELECT 'ADMIN', 'Nome do Admin', '000.000.000-00', 'S', SYSTIMESTAMP, SYSTIMESTAMP, ID
  FROM T_USER WHERE LOWER(EMAIL) = LOWER('admin@exemplo.com');
COMMIT;
```

> Limitação conhecida: o backend Node não tem autenticação própria. A área de admin fica escondida no app para quem não é ADMIN, mas as rotas da API são públicas.

## Publicação

O app é distribuído pelo **Firebase App Distribution**. A versão publicada corresponde ao commit exibido em **Conta → Sobre o app**.

- **Versão publicada:** 1.0.1 (build 4), gerada do commit [`0eb7762`](https://github.com/johnny-mathias/challenge3-mobile/commit/0eb7762c63b7f17eb9cf7056a64cc3486ef5e7ac) — o mesmo exibido em **Conta → Sobre o app**
- **Link para testers:** [Firebase App Distribution](https://appdistribution.firebase.google.com/testerapps/1:56038513662:android:dffb0fa3bdc14d43a23eaf/releases/0dv1f12h3gd30). O acesso é por convite: o e-mail precisa estar cadastrado como tester no console do Firebase (*App Distribution → Testers & Groups*).
- Pacote Android: `com.superbicho.app` (app Android registrado no mesmo projeto Firebase do login)
- Projeto no Expo: [`@johnny-mathias/SuperBicho`](https://expo.dev/accounts/johnny-mathias/projects/SuperBicho)

Para gerar uma nova versão (APK) e publicar:

```bash
npx eas-cli build --platform android --profile preview
npx firebase-tools appdistribution:distribute <arquivo>.apk --app 1:56038513662:android:dffb0fa3bdc14d43a23eaf --testers "email@exemplo.com"
```

O build sai do último commit enviado: commite antes de rodar, para o hash em **Sobre o app** bater com o repositório.

## Estrutura do projeto

```
src/
├── api/          # Chamadas HTTP às APIs (axios), sessão/CSRF e mensagens de erro amigáveis
├── components/    # Componentes de UI reutilizáveis (inclui a tela de erro com "Tentar novamente")
├── config/        # Configuração do Firebase e das URLs das APIs
├── context/       # Contextos globais (autenticação, agendamentos)
├── data/          # Configurações locais da tela Conta (os artigos agora vêm da API)
├── hooks/         # Hooks de dados com TanStack Query, puxar para atualizar e navegação pelo lembrete
├── i18n/          # Idiomas (pt-BR e inglês): dicionário de textos e provider
├── screens/       # Telas do app
├── services/      # Lembretes de consulta (notificações) e exportação do JSON
├── theme/         # Cores e tema claro/escuro
└── types/         # Tipos TypeScript

backend/           # API Node/Express ligada ao Oracle
├── sql/           # DDL das tabelas criadas pelo backend (artigos)
├── scripts/       # criar-artigos.js: cria as tabelas e carrega data/artigos.json
└── data/          # Artigos iniciais (antes ficavam no app)
app.config.js      # Injeta o hash do commit na build (tela "Sobre o app")
```

## Vídeo de apresentação

**Sprint 3:** https://www.youtube.com/watch?v=FxlKVMKECHE

**Sprint 4:** https://youtu.be/1Gj0D4P9LWc

## Equipe

| Nome | RM |
|---|---|
| Ana Carolina Pereira Fontes | 562145 |
| João Victor Nascimento Adão | 563409 |
| Johnny Dias Mathias Junior | 566516 |
| Luisa Ganasevici de Abreu | 563403 |
| Matheus Moya de Oliveira | 562822 |
