const express = require("express");
const { conectarOracle } = require("./database");

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
    const animais = linhas
      .filter((linha) => linha.trim().startsWith("{"))
      .map((linha) => JSON.parse(linha));

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
    } = req.body;

    if (!nome || !genero || !especieId || !racaId) {
      return res.status(400).json({
        sucesso: false,
        mensagem: "Nome, gênero, espécie e raça são obrigatórios.",
      });
    }

    if (!["M", "F"].includes(genero)) {
      return res.status(400).json({
        sucesso: false,
        mensagem: "Gênero deve ser M ou F.",
      });
    }

    connection = await conectarOracle();

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
      { autoCommit: true },
    );

    res.status(201).json({
      sucesso: true,
      mensagem: "Animal cadastrado no Oracle!",
      id: resultado.outBinds.id[0],
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
