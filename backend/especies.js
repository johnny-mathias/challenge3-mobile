const express = require("express");
const { conectarOracle } = require("./database");

const router = express.Router();

const oracledb = require("oracledb");

router.get("/", async (req, res) => {
  let connection;

  try {
    connection = await conectarOracle();

    const resultado = await connection.execute(
      `SELECT ID, NAME, SCIENTIFIC_NAME
         FROM T_SPECIES
        ORDER BY NAME`,
      [],
      { outFormat: oracledb.OUT_FORMAT_OBJECT },
    );

    const especies = resultado.rows.map((linha) => ({
      id: linha.ID,
      nome: linha.NAME,
      nomeCientifico: linha.SCIENTIFIC_NAME,
    }));

    res.json({
      sucesso: true,
      total: especies.length,
      especies,
    });
  } catch (error) {
    console.error("Erro ao listar espécies:", error);

    res.status(500).json({
      sucesso: false,
      mensagem: "Erro ao listar espécies no Oracle.",
    });
  } finally {
    if (connection) {
      await connection.close();
    }
  }
});

router.get("/:id/racas", async (req, res) => {
  let connection;

  try {
    const especieId = Number(req.params.id);

    if (!Number.isInteger(especieId) || especieId <= 0) {
      return res.status(400).json({
        sucesso: false,
        mensagem: "ID da espécie inválido.",
      });
    }

    connection = await conectarOracle();

    // PREDISPOSITION_JSON (CLOB) fica de fora: a tela só precisa de nome e porte
    const resultado = await connection.execute(
      `SELECT ID, NAME, PORT
         FROM T_BREED
        WHERE T_SPECIES_ID = :especieId
        ORDER BY NAME`,
      { especieId },
      { outFormat: oracledb.OUT_FORMAT_OBJECT },
    );

    const racas = resultado.rows.map((linha) => ({
      id: linha.ID,
      nome: linha.NAME,
      porte: linha.PORT,
    }));

    res.json({
      sucesso: true,
      total: racas.length,
      racas,
    });
  } catch (error) {
    console.error("Erro ao listar raças:", error);

    res.status(500).json({
      sucesso: false,
      mensagem: "Erro ao listar raças no Oracle.",
    });
  } finally {
    if (connection) {
      await connection.close();
    }
  }
});

module.exports = router;
