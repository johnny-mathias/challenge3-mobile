const oracledb = require("oracledb");

// O login do app é feito no Firebase, então o tutor ainda pode não existir no Oracle.
// O app só conhece nome e e-mail: o CPF (obrigatório em T_USER_PROFILE) fica como "NAO INFORMADO".
const CPF_NAO_INFORMADO = "NAO INFORMADO";

async function buscarPerfilTutor(connection, email) {
  const resultado = await connection.execute(
    `SELECT p.ID
       FROM T_USER u
       JOIN T_USER_PROFILE p ON p.T_USER_ID = u.ID
      WHERE LOWER(u.EMAIL) = LOWER(:email)
        AND p.PROFILE_TYPE = 'TUTOR'
      ORDER BY p.ID
      FETCH FIRST 1 ROWS ONLY`,
    { email },
  );

  return resultado.rows.length ? resultado.rows[0][0] : null;
}

// Retorna o ID do perfil de tutor do e-mail, criando T_USER/T_USER_PROFILE se necessário.
// Não faz commit: quem chama controla a transação.
async function obterOuCriarPerfilTutor(connection, email, nome) {
  const perfilExistente = await buscarPerfilTutor(connection, email);

  if (perfilExistente) {
    return perfilExistente;
  }

  const usuario = await connection.execute(
    `SELECT ID FROM T_USER WHERE LOWER(EMAIL) = LOWER(:email)`,
    { email },
  );

  let usuarioId = usuario.rows.length ? usuario.rows[0][0] : null;

  if (!usuarioId) {
    const novoUsuario = await connection.execute(
      `INSERT INTO T_USER (EMAIL, STATUS, CREATED_AT, UPDATED_AT)
       VALUES (LOWER(:email), 'ATIVO', SYSTIMESTAMP, SYSTIMESTAMP)
       RETURNING ID INTO :id`,
      {
        email,
        id: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
      },
    );

    usuarioId = novoUsuario.outBinds.id[0];
  }

  const novoPerfil = await connection.execute(
    `INSERT INTO T_USER_PROFILE (
       PROFILE_TYPE, FULL_NAME, CPF, IS_ACTIVE,
       CREATED_AT, UPDATED_AT, T_USER_ID
     ) VALUES (
       'TUTOR', :nome, :cpf, 'S',
       SYSTIMESTAMP, SYSTIMESTAMP, :usuarioId
     ) RETURNING ID INTO :id`,
    {
      nome: nome || email,
      cpf: CPF_NAO_INFORMADO,
      usuarioId,
      id: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
    },
  );

  return novoPerfil.outBinds.id[0];
}

module.exports = { buscarPerfilTutor, obterOuCriarPerfilTutor };
