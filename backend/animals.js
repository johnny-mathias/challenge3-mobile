const express = require("express");
const { conectarOracle } = require("./database");
const { buscarPerfilTutor, obterOuCriarPerfilTutor } = require("./tutores");

const router = express.Router();

const fs = require("node:fs/promises");
const path = require("node:path");

router.get("/", async (req, res) => {
  let connection;

  try {
    connection = await conectarOracle();

    // Habilita a captura da saída da procedure
    await connection.execute(`
      BEGIN
        DBMS_OUTPUT.ENABLE(NULL);
      END;
    `);

    // Executa a package existente no Oracle
    await connection.execute(`
      BEGIN
        PKG_ANIMAL.PR_LISTAR_ANIMAIS_JSON;
      END;
    `);

    const linhas = [];
    let terminou = false;

    while (!terminou) {
      const resultado = await connection.execute(
        `
        BEGIN
          DBMS_OUTPUT.GET_LINE(:linha, :status);
        END;
      `,
        {
          linha: {
            dir: require("oracledb").BIND_OUT,
            type: require("oracledb").STRING,
            maxSize: 32767,
          },
          status: {
            dir: require("oracledb").BIND_OUT,
            type: require("oracledb").NUMBER,
          },
        },
      );

      if (resultado.outBinds.status !== 0) {
        terminou = true;
      } else {
        linhas.push(resultado.outBinds.linha);
      }
    }

    // Converte as linhas JSON em objetos JavaScript
    let animais = linhas
      .filter((linha) => linha.trim().startsWith("{"))
      .map((linha) => JSON.parse(linha));

    // ?tutorEmail=... restringe aos animais sob responsabilidade ativa do tutor
    const { tutorEmail } = req.query;

    if (tutorEmail) {
      const perfilId = await buscarPerfilTutor(connection, tutorEmail);

      const vinculos = perfilId
        ? await connection.execute(
            `SELECT T_ANIMAL_ID FROM T_ANIMAL_RESP
              WHERE T_USER_PROFILE_ID = :perfilId AND END_DATE IS NULL`,
            { perfilId },
          )
        : { rows: [] };

      const idsDoTutor = new Set(vinculos.rows.map((linha) => linha[0]));
      animais = animais.filter((animal) => idsDoTutor.has(animal.id));
    }

    res.json({
      sucesso: true,
      total: animais.length,
      animais,
    });
  } catch (error) {
    console.error("Erro ao listar animais:", error);

    res.status(500).json({
      sucesso: false,
      mensagem: "Erro ao executar PKG_ANIMAL.",
    });
  } finally {
    if (connection) {
      await connection.close();
    }
  }
});

router.post("/", async (req, res) => {
  let connection;

  try {
    const {
      nome,
      apelido,
      genero,
      dataNascimento,
      rga,
      microchip,
      castrado,
      peso,
      altura,
      cor,
      especieId,
      racaId,
      tutorEmail,
      tutorNome,
    } = req.body;

    if (!nome || !genero || !especieId || !racaId) {
      return res.status(400).json({
        sucesso: false,
        mensagem: "Nome, gênero, espécie e raça são obrigatórios.",
      });
    }

    if (!tutorEmail) {
      return res.status(400).json({
        sucesso: false,
        mensagem: "O e-mail do tutor é obrigatório.",
      });
    }

    if (!["M", "F"].includes(genero)) {
      return res.status(400).json({
        sucesso: false,
        mensagem: "Gênero deve ser M ou F.",
      });
    }

    connection = await conectarOracle();

    const racaDaEspecie = await connection.execute(
      `SELECT COUNT(*) FROM T_BREED WHERE ID = :racaId AND T_SPECIES_ID = :especieId`,
      { racaId, especieId },
    );

    if (racaDaEspecie.rows[0][0] === 0) {
      return res.status(400).json({
        sucesso: false,
        mensagem: "A raça informada não pertence à espécie selecionada.",
      });
    }

    const resultado = await connection.execute(
      `INSERT INTO T_ANIMAL (
        NAME, NICKNAME, GENDER, BIRTH_DATE,
        RGA, MICROCHIP_CODE, IS_NEUTERED,
        WEIGHT, HEIGHT, COLOR, STATUS,
        CREATED_AT, UPDATED_AT,
        T_SPECIES_ID, T_BREED_ID
      ) VALUES (
        :nome, :apelido, :genero,
        TO_DATE(:dataNascimento, 'YYYY-MM-DD'),
        :rga, :microchip, :castrado,
        :peso, :altura, :cor, 'ATIVO',
        SYSTIMESTAMP, SYSTIMESTAMP,
        :especieId, :racaId
      ) RETURNING ID INTO :id`,
      {
        nome,
        apelido: apelido || null,
        genero,
        dataNascimento: dataNascimento || null,
        rga: rga || null,
        microchip: microchip || null,
        castrado: castrado ? "S" : "N",
        peso: peso ?? null,
        altura: altura ?? null,
        cor: cor || null,
        especieId,
        racaId,
        id: {
          dir: require("oracledb").BIND_OUT,
          type: require("oracledb").NUMBER,
        },
      },
    );

    const animalId = resultado.outBinds.id[0];

    // Animal e vínculo com o tutor entram na mesma transação
    const perfilId = await obterOuCriarPerfilTutor(connection, tutorEmail, tutorNome);

    await connection.execute(
      `INSERT INTO T_ANIMAL_RESP (
        RELATION_TYPE, IS_PRIMARY, START_DATE, CREATED_AT,
        T_ANIMAL_ID, T_USER_PROFILE_ID
      ) VALUES (
        'TUTOR', 'S', TRUNC(SYSDATE), SYSTIMESTAMP,
        :animalId, :perfilId
      )`,
      { animalId, perfilId },
    );

    await connection.commit();

    res.status(201).json({
      sucesso: true,
      mensagem: "Animal cadastrado no Oracle!",
      id: animalId,
    });
  } catch (error) {
    console.error("Erro ao cadastrar animal:", error);

    res.status(500).json({
      sucesso: false,
      mensagem: "Erro ao cadastrar animal no Oracle.",
    });
  } finally {
    if (connection) {
      await connection.close();
    }
  }
});

router.delete("/:id", async (req, res) => {
  let connection;

  try {
    const animalId = Number(req.params.id);
    const { tutorEmail } = req.query;

    if (!Number.isInteger(animalId) || animalId <= 0 || !tutorEmail) {
      return res.status(400).json({
        sucesso: false,
        mensagem: "ID do animal e e-mail do tutor são obrigatórios.",
      });
    }

    connection = await conectarOracle();

    const perfilId = await buscarPerfilTutor(connection, tutorEmail);

    const vinculo = perfilId
      ? await connection.execute(
          `SELECT COUNT(*) FROM T_ANIMAL_RESP
            WHERE T_ANIMAL_ID = :animalId AND T_USER_PROFILE_ID = :perfilId`,
          { animalId, perfilId },
        )
      : { rows: [[0]] };

    if (vinculo.rows[0][0] === 0) {
      return res.status(404).json({
        sucesso: false,
        mensagem: "Animal não encontrado para este tutor.",
      });
    }

    await connection.execute(
      `DELETE FROM T_ANIMAL_RESP WHERE T_ANIMAL_ID = :animalId`,
      { animalId },
    );
    await connection.execute(`DELETE FROM T_ANIMAL WHERE ID = :animalId`, { animalId });

    await connection.commit();

    res.json({
      sucesso: true,
      mensagem: "Animal removido do Oracle.",
    });
  } catch (error) {
    console.error("Erro ao remover animal:", error);

    // ORA-02292: animal ainda referenciado (consultas, prontuários)
    const referenciado = error.errorNum === 2292;

    res.status(referenciado ? 409 : 500).json({
      sucesso: false,
      mensagem: referenciado
        ? "Este animal possui consultas ou prontuários e não pode ser removido."
        : "Erro ao remover animal no Oracle.",
    });
  } finally {
    if (connection) {
      await connection.close();
    }
  }
});

router.post("/exportar", async (req, res) => {
  let connection;

  try {
    connection = await conectarOracle();

    await connection.execute(`
      BEGIN
        DBMS_OUTPUT.ENABLE(NULL);
        PKG_ANIMAL.PR_LISTAR_ANIMAIS_JSON;
      END;
    `);

    const animais = [];

    while (true) {
      const resultado = await connection.execute(
        `BEGIN
          DBMS_OUTPUT.GET_LINE(:linha, :status);
        END;`,
        {
          linha: {
            dir: require("oracledb").BIND_OUT,
            type: require("oracledb").STRING,
            maxSize: 32767,
          },
          status: {
            dir: require("oracledb").BIND_OUT,
            type: require("oracledb").NUMBER,
          },
        },
      );

      if (resultado.outBinds.status !== 0) {
        break;
      }

      const linha = resultado.outBinds.linha?.trim();

      if (linha?.startsWith("{")) {
        const animal = JSON.parse(linha);

        if (animal.id !== undefined) {
          animais.push(animal);
        }
      }
    }

    if (animais.length === 0) {
      return res.status(422).json({
        sucesso: false,
        mensagem: "Nenhum animal encontrado. Arquivo não alterado.",
      });
    }

    // Salva o arquivo na pasta principal do projeto Expo.
    const os = require("node:os");

    const caminho = path.join(os.homedir(), "Downloads", "03_animais.json");

    await fs.writeFile(caminho, JSON.stringify(animais, null, 2), "utf8");

    res.json({
      sucesso: true,
      mensagem: "JSON exportado com sucesso!",
      total: animais.length,
      arquivo: "03_animais.json",
    });
  } catch (error) {
    console.error("Erro na exportação:", error);

    res.status(500).json({
      sucesso: false,
      mensagem: "Erro ao exportar os animais.",
    });
  } finally {
    if (connection) {
      await connection.close();
    }
  }
});

module.exports = router;
